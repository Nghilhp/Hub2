import { deflateSync, inflateSync } from 'node:zlib'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ASSET_DIR = 'public/principles'
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const ILLUSTRATION_BACKGROUND = [247, 243, 255]

const crcTable = new Uint32Array(256)
for (let i = 0; i < 256; i += 1) {
  let c = i
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  crcTable[i] = c >>> 0
}

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type)
  const output = Buffer.alloc(12 + data.length)
  output.writeUInt32BE(data.length, 0)
  typeBuffer.copy(output, 4)
  data.copy(output, 8)
  output.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length)
  return output
}

function parsePng(buffer) {
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('Invalid PNG signature')
  }

  let offset = 8
  let ihdr = null
  const idat = []
  const passthrough = []

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString('ascii', offset + 4, offset + 8)
    const data = buffer.subarray(offset + 8, offset + 8 + length)

    if (type === 'IHDR') {
      ihdr = Buffer.from(data)
    } else if (type === 'IDAT') {
      idat.push(Buffer.from(data))
    } else if (type !== 'IEND') {
      passthrough.push({ type, data: Buffer.from(data) })
    }

    offset += length + 12
  }

  if (!ihdr || idat.length === 0) {
    throw new Error('Missing IHDR or IDAT')
  }

  const width = ihdr.readUInt32BE(0)
  const height = ihdr.readUInt32BE(4)
  const bitDepth = ihdr[8]
  const colorType = ihdr[9]
  const interlace = ihdr[12]

  if (bitDepth !== 8 || colorType !== 6 || interlace !== 0) {
    throw new Error('Only 8-bit RGBA non-interlaced PNG files are supported')
  }

  return {
    height,
    ihdr,
    idat: Buffer.concat(idat),
    passthrough,
    width,
  }
}

function paeth(left, up, upperLeft) {
  const estimate = left + up - upperLeft
  const leftDistance = Math.abs(estimate - left)
  const upDistance = Math.abs(estimate - up)
  const upperLeftDistance = Math.abs(estimate - upperLeft)

  if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) {
    return left
  }
  return upDistance <= upperLeftDistance ? up : upperLeft
}

function unfilter(data, width, height) {
  const bytesPerPixel = 4
  const stride = width * bytesPerPixel
  const output = Buffer.alloc(width * height * bytesPerPixel)
  let inputOffset = 0
  let outputOffset = 0

  for (let y = 0; y < height; y += 1) {
    const filter = data[inputOffset]
    inputOffset += 1

    for (let x = 0; x < stride; x += 1) {
      const raw = data[inputOffset + x]
      const left = x >= bytesPerPixel ? output[outputOffset + x - bytesPerPixel] : 0
      const up = y > 0 ? output[outputOffset + x - stride] : 0
      const upperLeft =
        y > 0 && x >= bytesPerPixel ? output[outputOffset + x - stride - bytesPerPixel] : 0

      if (filter === 0) output[outputOffset + x] = raw
      else if (filter === 1) output[outputOffset + x] = (raw + left) & 0xff
      else if (filter === 2) output[outputOffset + x] = (raw + up) & 0xff
      else if (filter === 3) output[outputOffset + x] = (raw + Math.floor((left + up) / 2)) & 0xff
      else if (filter === 4) output[outputOffset + x] = (raw + paeth(left, up, upperLeft)) & 0xff
      else throw new Error(`Unsupported PNG filter ${filter}`)
    }

    inputOffset += stride
    outputOffset += stride
  }

  return output
}

function filterNone(pixels, width, height) {
  const stride = width * 4
  const output = Buffer.alloc(height * (stride + 1))

  for (let y = 0; y < height; y += 1) {
    const inputStart = y * stride
    const outputStart = y * (stride + 1)
    output[outputStart] = 0
    pixels.copy(output, outputStart + 1, inputStart, inputStart + stride)
  }

  return output
}

function rgbToHsl(r, g, b) {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const lightness = (max + min) / 2

  if (max === min) {
    return { hue: 0, lightness, saturation: 0 }
  }

  const delta = max - min
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  let hue

  if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0)
  else if (max === green) hue = (blue - red) / delta + 2
  else hue = (red - green) / delta + 4

  return { hue: hue * 60, lightness, saturation }
}

function mix(a, b, amount) {
  return Math.round(a + (b - a) * amount)
}

function mixRgb(from, to, amount) {
  return [
    mix(from[0], to[0], amount),
    mix(from[1], to[1], amount),
    mix(from[2], to[2], amount),
  ]
}

function recolorPixel(r, g, b, a) {
  if (a === 0) {
    return [r, g, b]
  }

  const { hue, lightness, saturation } = rgbToHsl(r, g, b)
  const isPurple = hue >= 245 && hue <= 292 && saturation > 0.06

  if (!isPurple) {
    return [r, g, b]
  }

  const purpleBase = [138, 37, 255]
  const purpleSoft = [241, 228, 255]
  const solidBackground = ILLUSTRATION_BACKGROUND

  if (lightness > 0.93 && saturation < 0.35) {
    return mixRgb([r, g, b], solidBackground, 0.9)
  }

  if (lightness > 0.78 || saturation < 0.42) {
    const amount = Math.min(0.9, 0.35 + lightness * 0.45)
    return mixRgb(purpleBase, purpleSoft, amount)
  }

  const amount = Math.min(0.86, 0.2 + lightness * 0.62)
  return mixRgb(purpleBase, purpleSoft, amount)
}

function recolorFile(filePath) {
  const source = readFileSync(filePath)
  const png = parsePng(source)
  const pixels = unfilter(inflateSync(png.idat), png.width, png.height)

  for (let offset = 0; offset < pixels.length; offset += 4) {
    const [r, g, b] = recolorPixel(
      pixels[offset],
      pixels[offset + 1],
      pixels[offset + 2],
      pixels[offset + 3]
    )
    pixels[offset] = r
    pixels[offset + 1] = g
    pixels[offset + 2] = b
  }

  normalizeBackground(pixels, png.width, png.height)
  recolorSecondaryPatterns(pixels)
  recolorBlueToPurple(pixels)
  recolorGreenToPurple(pixels)

  const chunks = [
    PNG_SIGNATURE,
    chunk('IHDR', png.ihdr),
    ...png.passthrough.map(({ type, data }) => chunk(type, data)),
    chunk('IDAT', deflateSync(filterNone(pixels, png.width, png.height), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]

  writeFileSync(filePath, Buffer.concat(chunks))
}

function recolorSecondaryPatterns(pixels) {
  const background = ILLUSTRATION_BACKGROUND
  const purpleSoft = [241, 228, 255]
  const purpleMid = [221, 192, 255]

  for (let offset = 0; offset < pixels.length; offset += 4) {
    if (pixels[offset + 3] === 0) {
      continue
    }

    const distanceFromBackground = colorDistance(
      pixels[offset],
      pixels[offset + 1],
      pixels[offset + 2],
      background[0],
      background[1],
      background[2]
    )

    if (distanceFromBackground < 8) {
      continue
    }

    const { hue, lightness, saturation } = rgbToHsl(
      pixels[offset],
      pixels[offset + 1],
      pixels[offset + 2]
    )
    const isBlueDetail = hue >= 205 && hue <= 230 && saturation > 0.06

    if (!isBlueDetail || lightness < 0.78) {
      continue
    }

    const amount = Math.min(0.9, Math.max(0.45, lightness))
    const [r, g, b] = mixRgb(purpleMid, purpleSoft, amount)
    pixels[offset] = r
    pixels[offset + 1] = g
    pixels[offset + 2] = b
  }
}

function recolorBlueToPurple(pixels) {
  const purpleBase = [138, 37, 255]
  const purpleSoft = [184, 139, 235]

  for (let offset = 0; offset < pixels.length; offset += 4) {
    if (pixels[offset + 3] === 0) {
      continue
    }

    const { hue, lightness, saturation } = rgbToHsl(
      pixels[offset],
      pixels[offset + 1],
      pixels[offset + 2]
    )
    const isPrimaryBlue = hue >= 208 && hue <= 226 && saturation > 0.28 && lightness < 0.76

    if (!isPrimaryBlue) {
      continue
    }

    const amount = Math.min(0.58, Math.max(0.18, lightness * 0.48))
    const [r, g, b] = mixRgb(purpleBase, purpleSoft, amount)
    pixels[offset] = r
    pixels[offset + 1] = g
    pixels[offset + 2] = b
  }
}

function recolorGreenToPurple(pixels) {
  const purpleBase = [138, 37, 255]
  const purpleSoft = [184, 139, 235]

  for (let offset = 0; offset < pixels.length; offset += 4) {
    if (pixels[offset + 3] === 0) {
      continue
    }

    const { hue, lightness, saturation } = rgbToHsl(
      pixels[offset],
      pixels[offset + 1],
      pixels[offset + 2]
    )
    const isGreen = hue >= 135 && hue <= 170 && saturation > 0.18

    if (!isGreen) {
      continue
    }

    const amount = Math.min(0.74, Math.max(0.18, lightness * 0.58))
    const [r, g, b] = mixRgb(purpleBase, purpleSoft, amount)
    pixels[offset] = r
    pixels[offset + 1] = g
    pixels[offset + 2] = b
  }
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2)
}

function normalizeBackground(pixels, width, height) {
  const background = ILLUSTRATION_BACKGROUND
  const sampleOffset = (Math.floor(height * 0.04) * width + Math.floor(width * 0.04)) * 4
  const sample = [
    pixels[sampleOffset],
    pixels[sampleOffset + 1],
    pixels[sampleOffset + 2],
  ]

  for (let offset = 0; offset < pixels.length; offset += 4) {
    const distance = colorDistance(
      pixels[offset],
      pixels[offset + 1],
      pixels[offset + 2],
      sample[0],
      sample[1],
      sample[2]
    )

    if (distance < 12 && pixels[offset + 3] > 0) {
      pixels[offset] = background[0]
      pixels[offset + 1] = background[1]
      pixels[offset + 2] = background[2]
    }
  }
}

for (const fileName of readdirSync(ASSET_DIR)) {
  if (fileName.endsWith('.png')) {
    recolorFile(join(ASSET_DIR, fileName))
    console.log(`recolored ${fileName}`)
  }
}
