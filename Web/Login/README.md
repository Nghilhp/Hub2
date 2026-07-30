# Login

Folder này dùng để quản lý ghi chú, task, node id, và review liên quan đến **Login page**.

## Link View Local

```text
http://127.0.0.1:5173/login
```

Nếu Vite chạy port khác, dùng đúng port Terminal hiển thị.

## Current Spec

- `/login` là mock authentication, chưa có backend thật.
- Nếu user chưa authenticated và mở `/` hoặc `/login`, loading intro hiển thị một lần trong browser tab trước khi reveal login.
- `/loading` dùng cùng intro stack với login: Login render sẵn bên dưới, Loading phủ lên trên rồi dissolve ra để tránh bị nhảy 2 lần.
- Loading intro state lưu bằng `sessionStorage` key `zalopay-ui-hub-login-intro-shown`.
- Sau intro, vào lại `/login` trong cùng tab sẽ hiện form ngay.
- Submit hợp lệ vào thẳng UI Hub, không có bước "Đang đăng nhập".
- Auth mock lưu bằng `localStorage` key `zalopay-ui-hub-authenticated`.

## Test Account

```text
Email: domain@vng.com.vn
Password: designhub
```

Password chỉ cần không rỗng. Email phải có đuôi `@vng.com.vn`.

## Form Copy

```text
Chào Mừng tới Design Hub
Dùng tài khoản VNG của bạn để tiếp tục vào Zalopay UI Hub.
Email VNG *
domain@vng.com.vn
Mật khẩu *
Nhập mật khẩu
Ghi nhớ cho lần đăng nhập sau
Đăng nhập
Chỉ email có đuôi @vng.com.vn được phép truy cập
```

## Validation

- Empty email: `Vui lòng nhập email VNG`
- Wrong email domain: `Vui lòng sử dụng email VNG có đuôi @vng.com.vn`
- Empty password: `Vui lòng nhập mật khẩu`

## Remember Login

- Input không prefill mặc định khi mới vào login.
- Chỉ prefill nếu lần đăng nhập trước user tick `Ghi nhớ cho lần đăng nhập sau` rồi submit hợp lệ.
- Nếu user bỏ tick checkbox hoặc submit không tick, remembered login sẽ bị xóa.
- Remembered login lưu bằng `localStorage` key `zalopay-ui-hub-remembered-login`.

## Visual Spec

- Desktop login dùng full-page DotGrid background; logo/copy trái và form panel phải nằm trong cùng `login-layout-shell`.
- Panel trái dùng DotGrid từ React Bits, thêm bằng `npx shadcn@latest add @react-bits/DotGrid-JS-CSS`.
- DotGrid hiện tại: `dotSize={5}`, `gap={20}`, `baseColor="#354154"`, `activeColor="#3dff1e"`.
- Shell desktop dùng `width: min(calc(100vw - 104px), 1360px)`, `height: clamp(560px, calc(100svh - 106px), 720px)`, canh giữa viewport.
- Shell chia 2 cột: copy trái flexible, form phải `640px`; gap dùng `clamp(56px, 5.6vw, 96px)`.
- Background có overlay cân contrast: giảm vignette trái và thêm global overlay nhẹ để dot hai bên đều hơn nhưng text vẫn đọc tốt.
- Panel phải nền trắng, width `640px`, padding `40px`, radius `48px`, height theo shell.
- Custom collab cursor theo cảm hứng Atlassian Design: arrow + pill `You`, màu nền `#00CF6A`, text trắng.
- Custom cursor nằm trên toàn login page nhưng `pointer-events: none`, không chặn input, focus, typing hoặc submit.
- Khi custom cursor bật, native browser cursor trong login page được ẩn bằng `cursor: none`.
- Cursor effect chỉ bật trên desktop fine pointer, tắt trên touch/mobile và `prefers-reduced-motion`.
- Form dùng card flat: bỏ background, shadow, radius và padding ngoài của card; content width là `560px`.
- Mobile ẩn panel trái và chỉ hiển thị form trên nền trắng.
- Toàn app dùng `SF Pro Display`.
- Riêng headline `Chào Mừng tới Design Hub` và copy panel trái dùng `Aeonik Pro`, fallback `SF Pro Display`.
- Copy panel trái:

```text
Internal workspace
Một ngôn ngữ chung cho trải nghiệm nhất quán
Design System - UI Principles - Knowledge Hub dành cho đội ngũ sản phẩm Zalopay
```

- `Chào Mừng tới` màu V2 Blue `#0033C9`.
- `Design Hub` màu green `#00A655`.
- Label required dùng `*` đỏ `#E3173C`.
- Input text/placeholder regular weight.
- Input completed không fill background; text màu V2 Dark `#001F3E`, stroke màu V2 Blue `#0033C9`.
- Input hover zoom-out nhẹ `scale(0.985)` và đổi border xanh nhạt; focus ring dùng `focus-visible:ring-inset` để không bị clip ở hai mép.
- Error state clear khi click ngoài field, kể cả ngoài form; click CTA không clear lỗi trước submit nên validation vẫn giữ khi submit liên tục.
- Checkbox dùng spec Design Systems Zalopay 2.0: size `24px`, border `#99A5B2`, checked fill `#0033C9`, label `14px/18px`.
- CTA dùng V2 Blue `#0033C9`, không shadow.
- CTA hover không đổi sang dark và không sweep ngang; chỉ có highlight fade/scale tại chỗ.
- Login entrance motion lấy cảm hứng từ Atlassian Design: card/form reveal bằng fade + slight upward slide + subtle scale theo stagger ngắn.

## Files

```text
src/App.tsx
src/pages/LoginPage.tsx
src/components/hub/LoginForm.tsx
src/pages/LoadingPage.tsx
src/components/hub/LoginLoadingScreen.tsx
src/components/DotGrid.tsx
src/components/DotGrid.css
src/index.css
```

## Gợi Ý File Có Thể Tạo Thêm

```text
login-layout.md
login-copy.md
login-mobile-review.md
<node-id>-login-page.md
```
