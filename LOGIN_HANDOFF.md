# Zalopay UI Hub Login Handoff

## Current State

`/login` is a mock-auth login page for the Zalopay UI Hub.

When an unauthenticated user opens `/` or `/login`, the app shows the loading intro once per browser tab, then reveals the login form underneath the fading loading screen.

Standalone loading review routes still exist:

```text
/loading
/loading?loop=true
```

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui

## Main Files

```text
src/App.tsx
src/pages/LoginPage.tsx
src/components/hub/LoginForm.tsx
src/pages/LoadingPage.tsx
src/components/hub/LoginLoadingScreen.tsx
src/index.css
```

## Routing And State

- Mock auth key: `zalopay-ui-hub-authenticated`
- Login intro key: `zalopay-ui-hub-login-intro-shown`
- Remembered login key: `zalopay-ui-hub-remembered-login`

`src/App.tsx` controls the login intro handoff:

- `shouldShowLoginIntro` renders login beneath loading.
- `onExitStart` starts the login form reveal.
- `onComplete` stores the intro key in `sessionStorage` and lands on `/login`.

## Login Page

`src/pages/LoginPage.tsx`

- Uses `login-gradient-panel`.
- Centers the login card.
- Login wrapper max width is `560px`.
- Passes `entrance` state to `LoginPage` so the form can be hidden before intro reveal.

## Login Form

`src/components/hub/LoginForm.tsx`

Current copy:

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

Validation:

- Empty email: `Vui lòng nhập email VNG`
- Wrong email domain: `Vui lòng sử dụng email VNG có đuôi @vng.com.vn`
- Empty password: `Vui lòng nhập mật khẩu`

Submit:

- Valid submit calls `onLogin()` immediately.
- There is no "Đang đăng nhập" intermediate state.
- Password only needs to be non-empty because auth is mocked.

Test account:

```text
Email: domain@vng.com.vn
Password: designhub
```

## Remember Login

- Inputs are empty by default.
- Prefill happens only after a previous valid submit with `Ghi nhớ cho lần đăng nhập sau` checked.
- Unchecking the checkbox removes the remembered login immediately.
- Submitting while unchecked also removes the remembered login.

## Visual Direction

Brand name in UI copy is **Zalopay**.

Colors:

```text
V2 Blue: #0033C9
V2 Green: #00CF6A
V2 Dark: #001F3E
V2 White: #FFFFFF
V2 Background: #F5F9FF
V2 Stroke: #F2F6F7
Required Red: #E3173C
Headline Green: #00A655
```

Background:

- Base gradient: `#FFFFFF -> #F5F9FF`.
- Soft radial glows use V2 Blue and V2 Green.
- No dot texture.

Card:

- White card.
- Radius `32px`.
- No stroke/ring.
- Soft card shadow.

Typography:

- Global app font: `SF Pro Display`.
- Headline `Chào Mừng tới Design Hub`: `Aeonik Pro`, fallback `SF Pro Display`.
- Input and remember text use regular weight.

Input states:

- Default fill: white.
- Completed fill: white.
- Completed stroke/text: V2 Dark `#001F3E`.
- Browser autofill is forced back to white fill and dark text.

CTA:

- Base fill: V2 Blue `#0033C9`.
- No shadow.
- Hover keeps blue and uses a centered highlight fade/scale.
- Hover does not sweep left-to-right and does not switch to dark.

## Loading Intro

`src/pages/LoadingPage.tsx`

```ts
LOADING_DURATION = 1500
EXIT_START = 1500
COMPLETE_DURATION = 2240
```

`src/components/hub/LoginLoadingScreen.tsx`

- Uses `public/zalopay-design-hub-logo-color.svg`.
- Loading background is white.
- Logo/text colors follow Zalopay brand.

## Useful Commands

```bash
npm run dev -- --host 127.0.0.1
npm run typecheck
npm run build
```

Last known verification:

```text
npm run typecheck: passed
npm run build: passed
```
