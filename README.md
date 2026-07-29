# Zalopay UI Hub

Website MVP để xem và tra cứu UI Principles cho Zalopay UI Hub / Design Hub.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
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

Validation hiện có:

- Email bắt buộc nhập.
- Password bắt buộc nhập.
- Email phải kết thúc bằng `@vng.com.vn`.
- Submit hợp lệ sẽ loading ngắn rồi vào UI Hub.

File chính:

```text
src/pages/LoginPage.tsx
src/components/hub/LoginForm.tsx
```

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
