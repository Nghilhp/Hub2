# Zalopay Design Hub

Web nội bộ để quản lý nội dung Design Hub, UI Principle, guideline và các luồng review UI cho Zalopay Product Design.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- DotGrid từ React Bits, thêm qua `npx shadcn@latest add @react-bits/DotGrid-JS-CSS`
- Agentation, chỉ bật khi chạy local dev

## Chạy Local

Clone repo bằng GitHub Desktop, sau đó mở Terminal tại folder project và chạy:

```bash
npm install
npm run dev -- --host 127.0.0.1
```

Terminal sẽ hiện link dạng:

```text
http://127.0.0.1:5173/
```

Trang login:

```text
http://127.0.0.1:5173/login
```

Trang loading loop:

```text
http://127.0.0.1:5173/loading?loop=true
```

Trang loading rồi transition vào login:

```text
http://127.0.0.1:5173/loading
```

Nếu port khác, dùng đúng port Terminal hiển thị.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run preview
```

## Zalo Bot

Form `Góp ý cải thiện` gửi dữ liệu tới endpoint nội bộ:

```text
/api/feedback
```

Webhook nhận event từ Zalo:

```text
https://your-domain.example/api/zalo-webhook
```

Endpoint gửi thông báo cập nhật:

```text
/api/update
```

Khi set webhook, dùng `ZALO_WEBHOOK_SECRET` làm secret token. Sau đó mention bot trong group một lần và xem server log; log sẽ in `ZALO_GROUP_CHAT_ID=...`.

Gọi thử thông báo cập nhật:

```bash
curl -X POST http://127.0.0.1:5173/api/update \
  -H "Content-Type: application/json" \
  -H "X-Zalo-Notify-Secret: $ZALO_NOTIFY_SECRET" \
  -d '{
    "title": "Design Hub vừa cập nhật",
    "description": "Đã bổ sung nội dung mới cho UI Principles.",
    "pageUrl": "http://127.0.0.1:5173/#introduction",
    "author": "Design Hub"
  }'
```

Local có thể copy `.env.example` thành `.env.local` rồi điền giá trị thật. Khi deploy Vercel, set các biến Zalo này trong Project Settings > Environment Variables. Sau khi thêm hoặc đổi env ở local, cần restart `npm run dev` để Vite nạp lại biến môi trường.

## Branding

Tên thương hiệu chuẩn là **Zalopay**.

Brand constants nằm tại:

```text
src/data/brand.ts
```

Các constant chính:

```ts
export const BRAND_NAME = 'Zalopay'
export const HUB_NAME = 'Zalopay UI Hub'
export const HUB_DESCRIPTION = 'Design Hub'
export const INTERNAL_EMAIL_DOMAIN = '@vng.com.vn'
```

Khi cần đổi cách hiển thị tên brand trong các nội dung chính, ưu tiên cập nhật constant thay vì hardcode nhiều nơi. Không gõ hardcode các biến thể như `ZaloPay`, `Zalo Pay`, hoặc `zaloPay` trong text hiển thị. Lowercase chỉ dùng cho technical namespace/key, ví dụ localStorage key.

## Brand Color Notes

Web dùng palette Zalopay theo hướng clean UI: màu chính nhận diện rõ ở trạng thái active, icon, marker và CTA; nền nội dung dùng tint nhạt để không gây nặng trang.

Màu chính:

- Green: `#00CF6A`
- Blue: `#0033C9`

Tint chính đang dùng trong UI:

- Blue soft: `#F1F7FF`
- Green soft: `#ECFFF5`
- Blue border: `#E4EEFF`

Màu phụ dùng cho các card mục tiêu:

- Light blue: nền `#F2FBFF`, icon `#00B4FF`
- Neon green: nền `#FAFFE8`, icon `#A1FF00`
- Yellow: nền `#FFFBE8`, icon `#FFD729`
- Orange: nền `#FFF6EC`, icon `#FF8A00`

Nguyên tắc phối màu:

- Không dùng stroke cho card mục tiêu; dùng nền tint nhạt và icon block màu đậm hơn.
- Dùng `#0033C9` cho trạng thái active, tiêu đề hoặc nhấn điều hướng.
- Dùng `#00CF6A` hoặc biến thể đậm hơn cho marker/check/status tích cực.
- Tránh đưa tím làm màu chủ đạo trong light UI, trừ khi có task riêng cho màu phụ tím.

## Login MVP

Login hiện là mock authentication, không có backend thật.

Route:

```text
/login
```

Khi user chưa authenticated và vào `/` hoặc `/login`, app hiển thị loading intro một lần trong browser tab hiện tại rồi mới reveal login. Trạng thái đã xem intro lưu bằng `sessionStorage` key:

```text
zalopay-ui-hub-login-intro-shown
```

Validation hiện có:

- Email bắt buộc nhập.
- User chỉ cần nhập domain, UI tự ghép đuôi `@vng.com.vn`.
- Email hợp lệ phải kết thúc bằng `@vng.com.vn`.
