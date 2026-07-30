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

function formatFeedbackMessage(payload) {
  const identity =
    payload.identity === 'domain' && payload.domain
      ? payload.domain
      : 'Ẩn danh'

  return [
    'Design Hub - Góp ý mới',
    '',
    `Danh tính: ${identity}`,
    `Loại đóng góp: ${payload.typeLabel || 'Chưa phân loại'}`,
    `Tiêu đề: ${payload.title}`,
    '',
    'Nội dung:',
    payload.description,
    '',
    `Tab: ${payload.activeTab || 'N/A'}`,
    `Section: ${payload.activeSection || 'N/A'}`,
    `Trang: ${payload.pageUrl || 'N/A'}`,
  ].join('\n')
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, { error: 'Method not allowed' })
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

    if (!payload.title || !payload.description) {
      sendJson(response, 400, {
        error: 'Thiếu tiêu đề hoặc nội dung góp ý.',
      })
      return
    }

    const zaloResponse = await fetch(
      `${ZALO_BOT_API_BASE}/bot${botToken}/sendMessage`,
      {
        body: JSON.stringify({
          chat_id: chatId,
          text: formatFeedbackMessage(payload),
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

    if (!zaloResponse.ok || zaloPayload?.ok === false) {
      sendJson(response, 502, {
        error: 'Không thể gửi góp ý đến Zalo Bot.',
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
