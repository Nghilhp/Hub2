const ZALO_BOT_API_BASE = 'https://bot-api.zaloplatforms.com'

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

async function readJsonBody(request) {
  if (request.body && typeof request.body === 'object') {
    return request.body
  }

  const chunks = []

  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk))
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')

  if (!rawBody) {
    return {}
  }

  return JSON.parse(rawBody)
}

function formatUpdateMessage(payload) {
  const title = payload.title || 'Design Hub có cập nhật mới'
  const description = payload.description || 'Nội dung Design Hub vừa được cập nhật.'
  const pageUrl = payload.pageUrl || ''
  const author = payload.author || ''

  return [
    'Design Hub - Cập nhật mới',
    '',
    `Tiêu đề: ${title}`,
    '',
    'Nội dung:',
    description,
    author ? '' : null,
    author ? `Người cập nhật: ${author}` : null,
    pageUrl ? '' : null,
    pageUrl ? `Xem chi tiết: ${pageUrl}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  const notifySecret = process.env.ZALO_NOTIFY_SECRET
  const requestSecret = request.headers['x-zalo-notify-secret']

  if (!notifySecret || requestSecret !== notifySecret) {
    sendJson(response, 401, { error: 'Unauthorized' })
    return
  }

  const botToken = process.env.ZALO_BOT_TOKEN
  const chatId = process.env.ZALO_BOT_CHAT_ID || process.env.ZALO_BOT_GROUP_ID

  if (!botToken || !chatId) {
    sendJson(response, 500, {
      error: 'Chưa cấu hình ZALO_BOT_TOKEN hoặc ZALO_BOT_CHAT_ID trong env.',
    })
    return
  }

  try {
    const payload = await readJsonBody(request)

    const zaloResponse = await fetch(
      `${ZALO_BOT_API_BASE}/bot${botToken}/sendMessage`,
      {
        body: JSON.stringify({
          chat_id: chatId,
          text: formatUpdateMessage(payload),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    )

    const zaloPayload = await zaloResponse
      .json()
      .catch(() => ({ message: 'Unable to parse Zalo response' }))

    if (!zaloResponse.ok) {
      sendJson(response, 502, {
        error: 'Không thể gửi thông báo cập nhật đến Zalo Bot.',
        detail: zaloPayload,
      })
      return
    }

    sendJson(response, 200, { ok: true })
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error',
    })
  }
}
