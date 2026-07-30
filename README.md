# Zalopay Design Hub

Web nội bộ để quản lý nội dung Design Hub, UI Principle, guideline và các luồng
review UI cho Zalopay Product Design.

## Chạy local

```bash
npm install
npm run dev -- --host 127.0.0.1
```

Link local:

```text
http://127.0.0.1:5173/
```

Landing / Introduction:

```text
http://127.0.0.1:5173/#introduction
```

## Agentation

Project đã cài `agentation` để hỗ trợ feedback trực tiếp trên UI khi chạy local.
Tool này chỉ bật trong môi trường dev qua `import.meta.env.DEV`, nên không ảnh
hưởng production build.

Cách dùng:

1. Chạy web local bằng `npm run dev -- --host 127.0.0.1`.
2. Mở `http://127.0.0.1:5173/#introduction`.
3. Bấm toolbar Agentation ở góc dưới bên phải.
4. Click vào element cần góp ý.
5. Nhập note, sau đó copy/send feedback.
6. Gửi feedback đó cho coding agent để agent biết đúng selector/context cần sửa.

## Zalo Bot feedback

Form `Góp ý cải thiện` gửi dữ liệu tới endpoint nội bộ:

```text
POST /api/feedback
```

Thông báo mỗi lần Design Hub có cập nhật mới có thể gửi qua endpoint:

```text
POST /api/update
```

Endpoint này chạy ở server runtime và gửi message sang Zalo Bot, nên token không
được đặt trong frontend source. Cấu hình biến môi trường:

```bash
ZALO_BOT_TOKEN=...
ZALO_BOT_CHAT_ID=...
ZALO_NOTIFY_SECRET=...
ZALO_WEBHOOK_SECRET=...
```

Sau khi thêm bot vào group, gửi hoặc mention bot một tin nhắn trong group rồi
xem webhook/log bot. Dùng `chat.id` của event có `chat_type` là `GROUP` làm
`ZALO_BOT_CHAT_ID`.

Nếu chưa có webhook để xem event group, có thể trỏ webhook của Zalo Bot tới:

```text
https://your-domain.example/api/zalo-webhook
```

Khi set webhook, dùng `ZALO_WEBHOOK_SECRET` làm secret token. Sau đó mention bot
trong group một lần và xem server log; log sẽ in `ZALO_GROUP_CHAT_ID=...`.

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

Local có thể copy `.env.example` thành `.env.local` rồi điền giá trị thật. Khi
deploy Vercel, set các biến Zalo này trong Project Settings → Environment Variables.
Sau khi thêm hoặc đổi env ở local, cần restart `npm run dev` để Vite nạp lại
biến môi trường.

## Brand constants

Tên brand dùng trong UI Principle page được quản lý tại:

```text
src/data/brand.ts
```

```ts
export const BRAND_NAME = 'Zalopay'
```

Khi cần đổi cách hiển thị tên brand trong các nội dung chính, ưu tiên cập nhật
constant này thay vì hardcode nhiều nơi.

## Brand color notes

Web dùng palette Zalopay theo hướng clean UI: màu chính nhận diện rõ ở trạng
thái active, icon, marker và CTA; nền nội dung dùng tint nhạt để không gây nặng
trang.

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

- Không dùng stroke cho card mục tiêu; dùng nền tint nhạt và icon block màu đậm
  hơn.
- Dùng `#0033C9` cho trạng thái active, tiêu đề hoặc nhấn điều hướng.
- Dùng `#00CF6A` hoặc biến thể đậm hơn cho marker/check/status tích cực.
- Tránh đưa tím làm màu chủ đạo trong light UI, trừ khi có task riêng cho màu
  phụ tím.

## UI Principle layout notes

Trang Introduction hiện dùng layout kiểu documentation:

- Header fixed top, brand hiển thị logo ngang Zalopay tại
  `public/zalopay-logo-horizontal.png` kèm nhãn `Design Hub`.
- Header có profile menu với user `Trinhnnt2`, email
  `trinhnnt2@vng.com.vn`, vai trò `Editor`, toggle Light/Dark mode, version và
  đăng xuất. Avatar mặc định dùng chữ cái đầu của tên user trên nền xanh lá.
- Header search mở modal khi focus vào ô tìm kiếm. Modal chỉ trả gợi ý tới các
  nội dung thật trong UI Principle, không hiển thị 3 tab đang `soon`.
- Search modal debounce 1 giây sau khi user dừng typing, giới hạn tối đa 5 kết
  quả, highlight phần text match và có các chip gợi ý nhanh trỏ tới section thật
  như `Mục tiêu`, `Priority`, `Framework`, `Checklist review`.
- Sidebar trái sticky khi scroll, có scrollbar riêng mảnh màu xám nhạt.
- Sidebar chia 3 nhóm dạng expand/collapse: `Tổng quan`, `8 UI Principles`,
  `Khác`.
- `Tổng quan` gồm `Giới thiệu`, `Mục tiêu`, `Định nghĩa và phạm vi`,
  `Phân loại mức độ ưu tiên thông tin`, `Cách sử dụng framework này`.
- `8 UI Principles` gồm 8 tab riêng: `Clear Hierarchy`,
  `Structured Simplicity`, `Consistent Experience`, `Action Clarity`,
  `Feedback & System Status`, `ZaloPay Identity in Utility`,
  `Accessibility & Adaptability`, `Trust & Safety`.
- Không còn section tổng `#ui-principles`; user đi thẳng vào từng principle qua
  các anchor `#principle-1` đến `#principle-8`.
- `Khác` gồm `Guideline liên quan` và `Checklist review thiết kế`.
- Sidebar chỉ đổi tab khi click. Right anchor nav bên phải đang được ẩn để giữ
  layout gọn hơn.
- Sidebar item dùng truncate cho label dài, active state nền xanh nhạt và text
  xanh brand.
- Floating action bên phải có entry `Hỏi Bot` mở Zalo Bot UI team tại
  `https://zalo.me/21271472240833679`, đặt phía trên nút `Góp ý`.
- Article content nằm trong `src/pages/UIPrinciplePage.tsx`.
- Section `#introduction` không dùng badge, có H1 `Giới thiệu`, description,
  divider và ảnh minh hoạ lớn tại `public/intro-design-hub-illustration.png`.
- Section `#goal` hiển thị 4 card dạng 2x2, dùng bộ màu phụ ở trên.
- Section `#information-priority-levels` dùng bảng 4 cột:
  `Priority`, `Meaning`, `Examples in Zalopay`, `UI Rule`.
- Principle tabs render từng tab riêng. Phần `Nguyên tắc áp dụng` hiển thị
  card guideline dạng 2x2; hiện tạm dùng chung placeholder:
  `public/clear-hierarchy-placeholder.svg`.
- Font toàn app dùng stack `SF Pro Display`, fallback qua system font.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Branch workflow

- Mỗi task nên có một branch riêng.
- Không sửa trực tiếp branch `main` nếu chưa review.
- Branch hiện tại cho phần Introduction/Landing: `Web/Introduction`.
