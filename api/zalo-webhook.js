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

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  const webhookSecret = process.env.ZALO_WEBHOOK_SECRET
  const requestSecret = request.headers['x-bot-api-secret-token']

  if (webhookSecret && requestSecret !== webhookSecret) {
    sendJson(response, 401, { error: 'Unauthorized' })
    return
  }

  try {
    const payload = await readJsonBody(request)
    const chat = payload?.message?.chat || payload?.edited_message?.chat

    if (chat?.chat_type === 'GROUP' && chat?.id) {
      console.log(`ZALO_GROUP_CHAT_ID=${chat.id}`)
    } else {
      console.log('ZALO_WEBHOOK_EVENT_RECEIVED')
    }

    sendJson(response, 200, { ok: true })
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error',
    })
  }
}
