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

Khi cần đổi cách hiển thị tên brand trong các nội dung chính, ưu tiên cập nhật constant thay vì hardcode nhiều nơi. Không gõ hardcode các biến thể sai casing hoặc tách chữ trong text hiển thị. Lowercase chỉ dùng cho technical namespace/key, ví dụ localStorage key.

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

## Introduction Page Continuation Notes

Trang đang build tiếp cho UI Team nằm tại:

```text
src/pages/IntroductionPage.tsx
```

### Quick Handoff

- Route local: `#introduction`, `#principles`, `#clear-hierarchy`
- File chính: `src/pages/IntroductionPage.tsx`
- Sidebar/header behavior hiện tại: xem mục `Current Introduction Structure` và `Sidebar`
- Card spec theo Figma node: `1397:11356`
- Graphic palette tím theo Figma node: `1393:8574`
- Asset images: `public/principles/`
- Script recolor: `scripts/recolor-principle-assets.mjs`
- Verify:
  - `npm run typecheck`
  - `npm run build`

Route local sau khi login:

```text
http://127.0.0.1:5174/#introduction
http://127.0.0.1:5174/#principles
http://127.0.0.1:5174/#clear-hierarchy
```

Nếu dev server đang chạy port khác, dùng đúng port Terminal hiển thị, ví dụ `5173`.

### Current Introduction Structure

- Header fixed, không scroll theo nội dung.
- Header có logo Zalopay, search icon, dark mode toggle.
- Header nav gồm:
  - `Our team here`
  - `UI Team`
  - `UX Team`
  - `Motion Hub`
- Khi chọn một tab trên header nav, page sẽ chọn trang con đầu tiên của tab main đó.
- `UI Team` đang là tab chính có sidebar/content.
- Các tab header khác mở trang riêng với nội dung `To be updated`.
- Header nav dùng pill animation kiểu React Bits `PillNav`:
  - hover có nền tròn trượt lên
  - text trượt đổi màu
  - active tab nền blue brand, chữ trắng
  - active tab không bounce, không slide text khi click từ hover state
  - hover animation chỉ áp dụng cho tab chưa active qua selector `:not(.is-active)`
  - không có active dot
  - không có stroke nav container
- Header nav text size hiện là `16px`.
- Search icon và dark mode toggle dùng chung style icon button để đồng bộ màu nền, màu icon và hover state.

### Sidebar

Sidebar nằm trong `IntroductionPage.tsx`, dùng thêm component:

```text
src/components/hub/LineSidebar.tsx
src/components/hub/LineSidebar.css
```

Trạng thái hiện tại:

- Desktop sidebar fixed dưới header, không scroll theo page content.
- Top của sidebar và content bằng nhau, hiện dùng `top-[180px]` và content `lg:pt-[180px]`.
- Content desktop offset hiện dùng `lg:ml-[19rem]` để giảm khoảng trống giữa sidebar và main content, trừ landing page.
- Sidebar vẫn tự scroll bên trong nếu danh sách dài hơn viewport.
- Font sidebar hiện inherit từ `IntroductionPage`: `SF Pro Display`, fallback `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`.
- Sidebar spacing được gom trong `sidebarSpacing` tại `src/pages/IntroductionPage.tsx` để tránh phải đọc class kiểu `pt-1`, `pt-2`:
  - `childIndentClass`: `pl-[16px]`
  - `childLevelGapClass`: `pt-[8px]`
  - `mainGroupGapClass`: `space-y-[8px]`
  - `primaryChildHeightClass`: `h-[44px]`
- CSS override riêng cho Introduction line sidebar nằm trong `src/index.css`:
  - `.hub-intro-sidebar-line .line-sidebar__list { padding: 0; }`
  - `.hub-intro-sidebar-line .line-sidebar__item { min-height: 44px; }`
  - `.hub-intro-sidebar-line .line-sidebar__label { font-weight: 400; }`

Landing page rule:

- Khi vào trang Introduction hoặc reload page, mặc định hiển thị landing trước.
- Landing page hiện text lớn `To be update`.
- Landing page có animation nhẹ bằng CSS tại `.hub-landing-empty`.
- Khi bấm logo Zalopay trên desktop hoặc mobile header, mở lại landing page.
- Logo Zalopay dùng `TargetCursor` từ React Bits cho hover/click quanh logo:
  - Component nằm tại `src/components/hub/TargetCursor.tsx`.
  - CSS nằm tại `src/components/hub/TargetCursor.css`.
  - Logo target dùng class `.zalopay-logo-target`.
  - Vùng click/hover quanh logo được nới bằng `margin: -0.75rem` và `padding: 0.75rem`.
  - Cursor custom ẩn mặc định, chỉ fade in khi chuột vào vùng `.zalopay-logo-target`, rời vùng logo thì fade out.
  - `TargetCursor` tự không render trên mobile/touch device; mobile vẫn dùng click logo bình thường.
  - Khi click logo, logo zoom in/out nhẹ bằng GSAP qua helper `animateLogoClick` trong `src/pages/IntroductionPage.tsx`.
  - Không dùng logic `prefers-reduced-motion` riêng cho logo.
- Khi landing active:
  - Không hiển thị desktop sidebar.
  - Main content không dùng offset `lg:ml-[19rem]`.
  - Header nav không đánh dấu active tab nào.
- Khi chọn bất kỳ tab main/child từ header hoặc sidebar, thoát landing và hiển thị page tương ứng.

Sidebar structure hiện tại:

```text
Our team here
  Tổng quan
  Focus Areas
UI Team
  Tổng quan
  Principles
    1. Clear Hierarchy
    2. Structured Simplicity
    3. Consistent Experience
    4. Action Clarity
    5. Feedback & System Status
    6. Zalopay Identity in Utility
    7. Accessibility & Adaptability
    8. Trust & Safety
  UI Pattern
  Design System
  Illus System

UX Team
Motion Hub
```

Main item rule:

- Main item là cấp cao nhất.
- Main item hiện có 4 item: `Our team here`, `UI Team`, `UX Team`, `Motion Hub`.
- Main item dùng cùng kích thước `w-full h-12`.
- Spacing giữa các main group là `8px`.
- Main active dùng background `#FAFCFF`, nhẹ hơn child cấp 1 active.
- Main hover dùng background `#F7FBFF`, không đổi text.
- Main transition hiện dùng `transition-colors`; animation chỉ nhẹ ở màu nền/text state, không translate.
- Main selected đổi weight/text và dùng background nhẹ `#FAFCFF`.
- Nếu main có children thì click main expand/collapse group con.
- Nếu chọn main từ header nav thì tự chọn child cấp 1 đầu tiên của main đó.
- Main không có children không render child placeholder như `Overview` hoặc `To be updated`.
- `Our team here` và `UI Team` hiện có child cấp 1.
- `UX Team` và `Motion Hub` hiện là main item độc lập.
- Main item hiện render qua helper `renderMainTab`.

Child cấp 1 rule:

- Child cấp 1 nằm ngay dưới main item chứa nó.
- Child cấp 1 là static row/button, không dùng `LineSidebar` animation.
- Child cấp 1 height `44px`.
- Child cấp 1 selected theo Figma node `1413:12671`:
  - background `#F5F9FF`
  - radius `16px`
  - text `#001F3E`
  - font `16px/24px`
  - font-weight `400`
- Child cấp 1 hover:
  - background `#FAFCFF`
  - không đổi màu text
- Child cấp 1 transition hiện dùng `transition-colors`; không dùng text shift/marker animation.
- Child cấp 1 có thể có child cấp 2.
- Khi click child cấp 1 có child cấp 2:
  - chọn page của child cấp 1
  - expand/collapse child cấp 2 ngay bên dưới nó
- Child cấp 1 hiện render qua helper `renderPrimaryChildList`.

Child cấp 2 rule:

- Child cấp 2 nằm ngay dưới child cấp 1 cha.
- Chỉ child cấp 2 dùng `LineSidebar`.
- Child cấp 2 item height dùng `min-height: 44px`.
- Child cấp 2 font-weight `400`, không bold.
- Gap giữa child cấp 1 và child cấp 2 là `8px`.
- Gap giữa các child cấp 2 hiện dùng `LineSidebar` prop `itemGap`, default là `8`.
- Child cấp 2 text size hiện dùng `LineSidebar` prop `fontSize={0.875}` desktop và `0.8125` compact.
- Child cấp 2 dùng `LineSidebar` hover animation:
  - hover text dịch nhẹ
  - marker line animate nhẹ
  - line không kéo quá dài
- Child cấp 2 hiện render qua helper `renderSidebarLineList`.
- 8 tiêu chí principle phải nằm ngay sau tab con `Principles`, trước `UI Pattern`, `Design System`, `Illus System`.

Khi thêm item mới:

- Nếu thêm main không có child: render main item độc lập, không tạo child placeholder.
- Nếu thêm main có child cấp 1: tạo group riêng cho main đó.
- Nếu thêm child cấp 1 không có child cấp 2: render bằng static child row.
- Nếu thêm child cấp 1 có child cấp 2: render child cấp 1 bằng static row, sau đó render child cấp 2 bằng `LineSidebar` ngay bên dưới.
- Không render child cấp 1 bằng `LineSidebar`.

Our Team content notes:

- Our Team page vẫn dùng divider line dưới H1.
- Hero statement `Một đội ngũ cùng xây dựng...` không dùng line/border bên dưới.
- Cards trong section `Một đội ngũ, nhiều góc nhìn` là static cards, không hover translate/animation.
- `Focus Areas` đã được tách thành child cấp 1 dưới `Our team here`.
- `Tổng quan` giữ hero, Product Design và Disciplines.
- `Focus Areas` giữ section `Những việc chúng tôi tập trung làm tốt`, các detail blocks tương ứng, sau đó tới `Design System là nền tảng...` và `Thông điệp của chúng tôi`.
- Focus Areas không dùng card grid jump/animate; chỉ giữ detail blocks để tránh duplicate nội dung.
- Focus detail blocks dùng cùng data `productDesignFocusAreas` với card grid cũ, nên nội dung card đã được giữ lại trong block tương ứng.

### UI Principles Data

Dữ liệu 8 principles nằm tại:

```text
src/data/ui-team-principles.ts
```

Mỗi principle có:

- `id`
- `number`
- `title`
- `subtitle`
- `imageSrc`
- `intro`
- `applicationRules`
- `criteria`
- `reasons`

Detail page hiện **không hiển thị illustration/image** nữa. Detail chỉ gồm heading, divider và nội dung documentation.

### Principles Overview Cards

Card overview hiện build theo Figma node:

```text
Chin Working file
node-id=1397:11356
```

Thông số card hiện tại:

- Grid desktop: 3 cột
- Grid column gap: `32px`
- Grid row gap: `44px`
- Card width: `w-full`, fill toàn bộ cột grid
- Card radius: `16px`
- Card stroke: `1px #EEF4FE` qua token `--ds-border-stroke2`
- Image wrapper:
  - padding top/left/right `12px`
  - frame height `118px`
  - frame width `248px` với responsive fallback `max-width: 100%`
  - frame radius `8px`
- Content:
  - padding `16px`
  - title `16px / 24px`, semibold, black
  - subtitle `14px / 18px`, `#767676`

### Principle Graphics

Graphic PNG nằm tại:

```text
public/principles/
```

Các ảnh đang dùng:

```text
clear-hierarchy.png
structured-simplicity.png
consistent-experience.png
action-clarity.png
feedback-system-status.png
zalopay-identity-in-utility.png
accessibility-adaptability.png
trust-safety.png
```

Graphic source hiện là palette tím theo Figma node:

```text
Chin Working file
node-id=1393:8574
```

Trong web thumbnail, ảnh được filter nhẹ bằng CSS để nghiêng về Zalopay blue hơn:

```css
filter: hue-rotate(-38deg) saturate(1.12);
```

Palette container/graphic:

- Outer container background: `#E8DDFF`
- Inner image background: `#F7F3FF`
- Main purple accent: `#8A25FF`
- Secondary/stroke purple: `#D4AFFF`, `#DDC0FF`, `#F1E4FF`

CSS liên quan nằm ở:

```text
src/index.css
```

Các class chính:

```css
.principle-illustration
.principle-illustration__image
.principle-illustration--thumbnail
.principle-illustration--detail
```

Script recolor PNG nằm tại:

```text
scripts/recolor-principle-assets.mjs
```

Chạy lại recolor nếu cần:

```bash
node scripts/recolor-principle-assets.mjs
```

Lưu ý: script đang recolor asset PNG trực tiếp trong `public/principles`.

### Figma Image Container

8 ảnh principle đã được thay vào container card trong Figma:

```text
Chin Working file
https://www.figma.com/design/0P0SrXQUWoJT6YlFntA2N3/Chin---Working-file?node-id=1397-10551&t=20pDvvRfCfM6aMs5-4
```

Container:

```text
node-id=1397:10551
name=IMG
```

Mapping theo thứ tự:

- `IMG=1`: Clear Hierarchy
- `IMG=2`: Structured Simplicity
- `IMG=3`: Consistent Experience
- `IMG=4`: Action Clarity
- `IMG=5`: Feedback & System Status
- `IMG=6`: Zalopay Identity in Utility
- `IMG=7`: Accessibility & Adaptability
- `IMG=8`: Trust & Safety

Các image fill trong Figma đang dùng `scaleMode: FILL` để phủ kín container card, tránh lộ nền/hở màu do ảnh bị fit theo tỉ lệ.

### Verification

Sau mỗi lần chỉnh Introduction page, nên chạy:

```bash
npm run typecheck
npm run build
```

Lần verify gần nhất: `npm run typecheck` và `npm run build` đều pass.

Review local hiện tại:

```text
http://127.0.0.1:5174/#principles
```

Nếu dev server đang chạy port khác, dùng đúng port Terminal hiển thị.

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
