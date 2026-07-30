import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'

const ZALO_BOT_API_BASE = 'https://bot-api.zaloplatforms.com'

function sendJson(
  response: ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>
) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

async function readJsonBody(request: IncomingMessage) {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk))
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')

  if (!rawBody) {
    return {}
  }

  return JSON.parse(rawBody) as Record<string, unknown>
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function isFailedZaloPayload(value: unknown) {
  return (
    typeof value === 'object' &&
    value !== null &&
    'ok' in value &&
    (value as { ok?: unknown }).ok === false
  )
}

function formatFeedbackMessage(payload: Record<string, unknown>) {
  const identity =
    payload.identity === 'domain' && payload.domain
      ? getString(payload.domain)
      : 'Ẩn danh'

  return [
    'Design Hub - Góp ý mới',
    '',
    `Danh tính: ${identity}`,
    `Loại đóng góp: ${getString(payload.typeLabel) || 'Chưa phân loại'}`,
    `Tiêu đề: ${getString(payload.title)}`,
    '',
    'Nội dung:',
    getString(payload.description),
    '',
    `Tab: ${getString(payload.activeTab) || 'N/A'}`,
    `Section: ${getString(payload.activeSection) || 'N/A'}`,
    `Trang: ${getString(payload.pageUrl) || 'N/A'}`,
  ].join('\n')
}

function getWebhookChat(payload: Record<string, unknown>) {
  const message =
    typeof payload.message === 'object' && payload.message !== null
      ? (payload.message as Record<string, unknown>)
      : null
  const editedMessage =
    typeof payload.edited_message === 'object' && payload.edited_message !== null
      ? (payload.edited_message as Record<string, unknown>)
      : null
  const chat =
    typeof message?.chat === 'object' && message.chat !== null
      ? (message.chat as Record<string, unknown>)
      : typeof editedMessage?.chat === 'object' && editedMessage.chat !== null
        ? (editedMessage.chat as Record<string, unknown>)
        : null

  return chat
}

function feedbackApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'local-feedback-api',
    configureServer(server) {
      server.middlewares.use('/api/zalo-webhook', async (request, response) => {
        if (request.method !== 'POST') {
          response.setHeader('Allow', 'POST')
          sendJson(response, 405, { error: 'Method not allowed' })
          return
        }

        const webhookSecret = env.ZALO_WEBHOOK_SECRET
        const requestSecret = request.headers['x-bot-api-secret-token']

        if (webhookSecret && requestSecret !== webhookSecret) {
          sendJson(response, 401, { error: 'Unauthorized' })
          return
        }

        try {
          const payload = await readJsonBody(request)
          const chat = getWebhookChat(payload)
          const chatType = getString(chat?.chat_type)
          const chatId = getString(chat?.id)

          if (chatType === 'GROUP' && chatId) {
            console.log(`ZALO_GROUP_CHAT_ID=${chatId}`)
          } else {
            console.log('ZALO_WEBHOOK_EVENT_RECEIVED')
          }

          sendJson(response, 200, { ok: true })
        } catch (error) {
          sendJson(response, 500, {
            error:
              error instanceof Error ? error.message : 'Unexpected server error',
          })
        }
      })

      server.middlewares.use('/api/update', async (request, response) => {
        if (request.method !== 'POST') {
          response.setHeader('Allow', 'POST')
          sendJson(response, 405, { error: 'Method not allowed' })
          return
        }

        const notifySecret = env.ZALO_NOTIFY_SECRET
        const requestSecret = request.headers['x-zalo-notify-secret']

        if (!notifySecret || requestSecret !== notifySecret) {
          sendJson(response, 401, { error: 'Unauthorized' })
          return
        }

        const botToken = env.ZALO_BOT_TOKEN
        const chatId = env.ZALO_BOT_CHAT_ID || env.ZALO_BOT_GROUP_ID

        if (!botToken || !chatId) {
          sendJson(response, 500, {
            error:
              'Chưa cấu hình ZALO_BOT_TOKEN hoặc ZALO_BOT_CHAT_ID trong env.',
          })
          return
        }

        try {
          const payload = await readJsonBody(request)
          const title = getString(payload.title) || 'Design Hub có cập nhật mới'
          const description =
            getString(payload.description) ||
            'Nội dung Design Hub vừa được cập nhật.'
          const pageUrl = getString(payload.pageUrl)
          const author = getString(payload.author)
          const text = [
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

          const zaloResponse = await fetch(
            `${ZALO_BOT_API_BASE}/bot${botToken}/sendMessage`,
            {
              body: JSON.stringify({
                chat_id: chatId,
                text,
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

          if (!zaloResponse.ok || isFailedZaloPayload(zaloPayload)) {
            sendJson(response, 502, {
              error: 'Không thể gửi thông báo cập nhật đến Zalo Bot.',
              detail: zaloPayload,
            })
            return
          }

          sendJson(response, 200, { ok: true })
        } catch (error) {
          sendJson(response, 500, {
            error:
              error instanceof Error
                ? error.message
                : 'Không thể gửi thông báo cập nhật đến Zalo Bot.',
          })
        }
      })

      server.middlewares.use('/api/feedback', async (request, response) => {
        if (request.method !== 'POST') {
          response.setHeader('Allow', 'POST')
          sendJson(response, 405, { error: 'Method not allowed' })
          return
        }

        const botToken = env.ZALO_BOT_TOKEN
        const chatId = env.ZALO_BOT_CHAT_ID || env.ZALO_BOT_GROUP_ID

        if (!botToken || !chatId) {
          sendJson(response, 500, {
            error:
              'Chưa cấu hình ZALO_BOT_TOKEN hoặc ZALO_BOT_CHAT_ID trong env.',
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

          if (!zaloResponse.ok || isFailedZaloPayload(zaloPayload)) {
            sendJson(response, 502, {
              error: 'Không thể gửi góp ý đến Zalo Bot.',
              detail: zaloPayload,
            })
            return
          }

          sendJson(response, 200, { ok: true })
        } catch (error) {
          sendJson(response, 500, {
            error:
              error instanceof Error
                ? error.message
                : 'Không thể gửi góp ý đến Zalo Bot.',
          })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [feedbackApiPlugin(env), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
