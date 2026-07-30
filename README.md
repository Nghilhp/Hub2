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

Link local:

```text
http://127.0.0.1:5173/
```

Trang login:

```text
http://127.0.0.1:5173/login
```

Landing / Introduction:

```text
http://127.0.0.1:5173/#introduction
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
- Password bắt buộc nhập.
- Password phải đúng mật khẩu chung `designhub`.
- Sai password sẽ báo lỗi ngay tại field mật khẩu.
- Submit hợp lệ vào UI Hub ngay, không có bước "đang đăng nhập".

Pass chung để test:

```text
Email domain: domain
Full email: domain@vng.com.vn
Password: designhub
```

Ghi nhớ đăng nhập:

- Input không prefill mặc định khi mới vào login.
- Chỉ prefill nếu lần đăng nhập trước user tick `Ghi nhớ cho lần đăng nhập sau`.
- Thông tin remembered login lưu bằng `localStorage` key:

```text
zalopay-ui-hub-remembered-login
```

File chính:

```text
src/pages/LoginPage.tsx
src/components/hub/LoginForm.tsx
src/App.tsx
src/index.css
```

Visual chính:

- Desktop login dùng full-page DotGrid background; logo/copy trái và form panel phải nằm trong cùng `login-layout-shell`.
- Shell desktop dùng `width: min(calc(100vw - 104px), 1360px)`, `height: clamp(560px, calc(100svh - 106px), 720px)`, canh giữa viewport.
- Shell chia 2 cột: copy trái flexible, form phải `640px`; gap dùng `clamp(56px, 5.6vw, 96px)` để màn lớn không bị kéo quá xa.
- Form panel nền trắng, size theo shell height, width `640px`, padding `40px`, radius `48px`; form content bên trong rộng `560px`.
- Mobile ẩn panel DotGrid/copy trái và chỉ hiển thị form trên nền trắng.
- DotGrid hiện tại: `dotSize={5}`, `gap={20}`, `baseColor="#354154"`, `activeColor="#3dff1e"`.
- Background có overlay cân contrast: giảm vignette trái và thêm global overlay nhẹ để dot hai bên đều hơn nhưng text vẫn đọc tốt.
- Copy panel trái: `Internal workspace`, `Một ngôn ngữ chung cho trải nghiệm nhất quán`, `Design System - UI Principles - Knowledge Hub dành cho đội ngũ sản phẩm Zalopay`.
- Custom collab cursor theo cảm hứng Atlassian Design: arrow + pill `You`, màu `#00CF6A`, text trắng, nằm trên toàn login page nhưng `pointer-events: none`.
- Khi collab cursor bật, native browser cursor trong login page được ẩn bằng `cursor: none`; effect chỉ bật trên desktop fine pointer và tắt trên touch/mobile hoặc `prefers-reduced-motion`.
- Toàn app dùng `SF Pro Display`; riêng headline form login và copy panel trái dùng `Aeonik Pro` với fallback SF Pro Display.
- Headline: `Chào Mừng tới` màu V2 Blue `#0033C9`, `Design Hub` màu green `#00A655`.
- Input completed giữ fill trắng, text V2 Dark `#001F3E`, stroke đổi sang V2 Blue `#0033C9`.
- Input hover zoom-out nhẹ `scale(0.985)` và đổi border xanh nhạt; focus ring dùng `focus-visible:ring-inset` để không bị clip ở hai mép.
- Error state clear khi click ngoài field, kể cả ngoài form; click CTA không clear lỗi trước submit nên validation vẫn giữ khi submit liên tục.
- Checkbox dùng spec Design Systems Zalopay 2.0: size `24px`, border `#99A5B2`, checked fill `#0033C9`, label `14px/18px`.
- CTA hover giữ nền blue và chỉ có highlight fade/scale tại chỗ, không sweep ngang.

## Loading Page

Loading page dùng cho intro motion trước khi vào login.

Route hiện có:

```text
/loading?loop=true
/loading
```

Behavior:

- `/loading?loop=true`: chỉ chạy loading loop, không tự vào login.
- `/loading`: chạy cùng transition stack với login; Login nằm dưới, Loading phủ lên trên rồi dissolve ra. Kết thúc flow app điều hướng về `/login`.
- Logo/text reveal một lần trong khoảng `1.45s`, sau đó giữ trạng thái ổn định trước khi exit.
- Sau khi đủ `1.5s`, page bắt đầu exit; hoàn tất flow ở `2.38s`.
- Transition lấy cảm hứng từ Atlassian Design: restrained fade/blur/slide, login form reveal nhẹ theo stagger.
- Không còn thanh progress hoặc orb/chấm loader.

Thông số chính nằm trong:

```text
src/pages/LoadingPage.tsx
src/components/hub/LoginLoadingScreen.tsx
src/index.css
public/zalopay-design-hub-logo-color.svg
```

Timing hiện tại:

```ts
LOGO_REVEAL_DURATION = 1450
LOOP_DURATION = 1500
EXIT_START = 1500
COMPLETE_DURATION = 2380
```

Visual hiện tại:

- Background chính: trắng `#ffffff`.
- Logo/text dùng asset `zalopay-design-hub-logo-color.svg`.
- Màu logo/text theo Figma node `1332:759`: blue `#0033C9`, green `#00CF6A`.
- Wording trong logo: `Zalopay | Design Hub`.
- Logo/text canh giữa, size desktop `min(28rem, 78vw)`, mobile `min(22rem, 86vw)`.
- Logo/text motion: reveal bằng fade/blur/scale nhẹ, giữ opacity ở cuối để tránh nháy, rồi exit bằng fade/blur/slide lên.
- Login form motion: các phần tử stagger từ dưới lên nhẹ với easing `cubic-bezier(0.16, 1, 0.3, 1)`.

## UI Principle Layout Notes

Trang Introduction hiện dùng layout kiểu documentation:

- Header fixed top, brand hiển thị logo ngang Zalopay tại `public/zalopay-logo-horizontal.png` kèm nhãn `Design Hub`.
- Header có profile menu với user `Trinhnnt2`, email `trinhnnt2@vng.com.vn`, vai trò `Editor`, toggle Light/Dark mode, version và đăng xuất. Avatar mặc định dùng chữ cái đầu của tên user trên nền xanh lá.
- Header search mở modal khi focus vào ô tìm kiếm. Modal chỉ trả gợi ý tới các nội dung thật trong UI Principle, không hiển thị 3 tab đang `soon`.
- Search modal debounce 1 giây sau khi user dừng typing, giới hạn tối đa 5 kết quả, highlight phần text match và có các chip gợi ý nhanh trỏ tới section thật như `Mục tiêu`, `Priority`, `Framework`, `Checklist review`.
- Sidebar trái sticky khi scroll, có scrollbar riêng mảnh màu xám nhạt.
- Sidebar chia 3 nhóm dạng expand/collapse: `Tổng quan`, `8 UI Principles`, `Khác`.
- `Tổng quan` gồm `Giới thiệu`, `Mục tiêu`, `Định nghĩa và phạm vi`, `Phân loại mức độ ưu tiên thông tin`, `Cách sử dụng framework này`.
- `8 UI Principles` gồm 8 tab riêng: `Clear Hierarchy`, `Structured Simplicity`, `Consistent Experience`, `Action Clarity`, `Feedback & System Status`, `ZaloPay Identity in Utility`, `Accessibility & Adaptability`, `Trust & Safety`.
- Không còn section tổng `#ui-principles`; user đi thẳng vào từng principle qua các anchor `#principle-1` đến `#principle-8`.
- `Khác` gồm `Guideline liên quan` và `Checklist review thiết kế`.
- Sidebar chỉ đổi tab khi click. Right anchor nav bên phải đang được ẩn để giữ layout gọn hơn.
- Sidebar item dùng truncate cho label dài, active state nền xanh nhạt và text xanh brand.
- Floating action bên phải có entry `Hỏi Bot` mở Zalo Bot UI team tại `https://zalo.me/21271472240833679`, đặt phía trên nút `Góp ý`.
- Article content nằm trong `src/pages/UIPrinciplePage.tsx`.
- Section `#introduction` không dùng badge, có H1 `Giới thiệu`, description, divider và ảnh minh hoạ lớn tại `public/intro-design-hub-illustration.png`.
- Section `#goal` hiển thị 4 card dạng 2x2, dùng bộ màu phụ ở trên.
- Section `#information-priority-levels` dùng bảng 4 cột: `Priority`, `Meaning`, `Examples in Zalopay`, `UI Rule`.
- Principle tabs render từng tab riêng. Phần `Nguyên tắc áp dụng` hiển thị card guideline dạng 2x2; hiện tạm dùng chung placeholder: `public/clear-hierarchy-placeholder.svg`.
- Font toàn app dùng stack `SF Pro Display`, fallback qua system font.

## Agentation

Agentation là tool feedback visual để click vào UI, ghi chú, rồi copy selector/context cho người build.

Nó chỉ hiện khi chạy local dev:

```tsx
{import.meta.env.DEV && <Agentation />}
```

Cách dùng:

1. Chạy web local bằng `npm run dev -- --host 127.0.0.1`.
2. Mở `http://127.0.0.1:5173/#introduction`.
3. Bấm toolbar Agentation ở góc dưới bên phải.
4. Click vào element cần góp ý.
5. Nhập note, sau đó copy/send feedback.
6. Gửi feedback đó cho coding agent để agent biết đúng selector/context cần sửa.

## Zalo Bot Feedback

Form `Góp ý cải thiện` gửi dữ liệu tới endpoint nội bộ:

```text
POST /api/feedback
```

Thông báo mỗi lần Design Hub có cập nhật mới có thể gửi qua endpoint:

```text
POST /api/update
```

Endpoint này chạy ở server runtime và gửi message sang Zalo Bot, nên token không được đặt trong frontend source. Cấu hình biến môi trường:

```bash
ZALO_BOT_TOKEN=...
ZALO_BOT_CHAT_ID=...
ZALO_NOTIFY_SECRET=...
ZALO_WEBHOOK_SECRET=...
```

Sau khi thêm bot vào group, gửi hoặc mention bot một tin nhắn trong group rồi xem webhook/log bot. Dùng `chat.id` của event có `chat_type` là `GROUP` làm `ZALO_BOT_CHAT_ID`.

Nếu chưa có webhook để xem event group, có thể trỏ webhook của Zalo Bot tới:

```text
https://your-domain.example/api/zalo-webhook
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

Local có thể copy `.env.example` thành `.env.local` rồi điền giá trị thật. Khi deploy Vercel, set các biến Zalo này trong Project Settings -> Environment Variables. Sau khi thêm hoặc đổi env ở local, cần restart `npm run dev` để Vite nạp lại biến môi trường.

## Workflow Làm Chung

Không làm trực tiếp trên `main`.

Mỗi task tạo một branch riêng:

```text
feature/login-page
feature/ui-principle-page
fix/mobile-sidebar
```

Luồng làm việc:

1. Chọn `main`.
2. Bấm `Fetch origin` / `Pull origin`.
3. Tạo branch mới cho task.
4. Làm thay đổi.
5. Commit.
6. Push branch.
7. Create Pull Request.
8. Reviewer review và merge vào `main`.

Branch hiện tại cho phần Introduction/Landing: `Web/Introduction`.

## Người Mới Pull Update

Khi có update trên `main`, người cộng tác làm:

1. Chọn branch `main` trong GitHub Desktop.
2. Bấm `Fetch origin`.
3. Bấm `Pull origin` nếu có.
4. Chạy lại:

```bash
npm install
npm run dev
```

`npm install` cần chạy lại khi project có thêm package mới.

## Folder Ghi Chú

Folder `Web` dùng để quản lý ghi chú theo từng phần của website.

Ví dụ:

```text
Web/Login/
```

Nếu cần thêm khu vực mới, có thể tạo:

```text
Web/UI-Principle/
Web/Header/
Web/Sidebar/
```
