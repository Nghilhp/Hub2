# Zalopay UI Hub

Website MVP để xem và tra cứu UI Principles cho Zalopay UI Hub / Design Hub.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- DotGrid từ React Bits, thêm qua `npx shadcn@latest add @react-bits/DotGrid-JS-CSS`
- Agentation, chỉ bật khi chạy local dev

## Setup Lần Đầu

Clone repo bằng GitHub Desktop, sau đó mở Terminal tại folder project và chạy:

```bash
npm install
```

Chạy website local:

```bash
npm run dev
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
npm run typecheck
npm run build
npm run lint
```

## Branding

Tên thương hiệu chuẩn là **Zalopay**.

Khi viết UI copy hoặc data trong code, ưu tiên dùng file:

```text
src/data/brand.ts
```

Các constant hiện có:

```ts
BRAND_NAME = 'Zalopay'
HUB_NAME = 'Zalopay UI Hub'
HUB_DESCRIPTION = 'Design Hub'
INTERNAL_EMAIL_DOMAIN = '@vng.com.vn'
```

Không gõ hardcode các biến thể như `ZaloPay`, `Zalo Pay`, hoặc `zaloPay` trong text hiển thị. Lowercase chỉ dùng cho technical namespace/key, ví dụ localStorage key.

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
- Password bắt buộc nhập.
- Email phải kết thúc bằng `@vng.com.vn`.
- Submit hợp lệ vào UI Hub ngay, không có bước "đang đăng nhập".

Pass chung để test:

```text
Email: domain@vng.com.vn
Password: designhub
```

Password chỉ cần không rỗng vì đây là mock login.

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

## Agentation

Agentation là tool feedback visual để click vào UI, ghi chú, rồi copy selector/context cho người build.

Nó chỉ hiện khi chạy local dev:

```tsx
{import.meta.env.DEV && <Agentation />}
```

Khi mở web bằng `npm run dev`, toolbar sẽ nằm ở góc dưới phải.

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
