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

- Route local:
  - Landing: `#landing`
  - Our team here: `#our-team-overview`
  - UI Team: `#introduction`, `#principles`, `#clear-hierarchy`
  - UX Team overview: `#ux-team-overview`
  - UX Design: `#ux-team-ux-design--ux-principle`, `#ux-team-ux-design--ux-pattern--overview`, `#ux-team-ux-design--workflow--overview`
  - UX Research principle: `#ux-team-ux-research--principle`
  - UX Research methods: `#docs-uxr-methods-survey`, `#ux-team-ux-research--methods--in-depth-interview`, `#ux-team-ux-research--methods--focus-group`, `#ux-team-ux-research--methods--usability-testing`, `#ux-team-ux-research--methods--unmoderated-ut`, `#ux-team-ux-research--methods--biweekly-interview`
  - UX Research workflow: `#ux-team-ux-research--workflow--overview`, `#ux-team-ux-research--workflow--method-picker-matrix`, `#ux-team-ux-research--workflow--order-research`
  - UX Writing: `#ux-team-ux-writing--principles`, `#ux-team-ux-writing--workflow`, `#ux-team-ux-writing--glossary`
  - Motion Hub: `#motion-hub`
- File chính: `src/pages/IntroductionPage.tsx`
- CSS chính của page/cursor/landing/motion: `src/index.css`
- Sidebar/header behavior hiện tại: xem mục `Current Introduction Structure` và `Sidebar`
- Card spec theo Figma node: `1397:11356`
- Graphic palette tím theo Figma node: `1393:8574`
- Landing H1 và dot background theo Figma node: `1422:22893`
- UX Research Methods theo Figma node: `1423:6206`; Biweekly detail theo subnode `1423:5379`
- Asset images: `public/principles/`
- UX Research workflow map asset: `public/ux-research-workflow-map.svg`
- Script recolor: `scripts/recolor-principle-assets.mjs`
- Verify:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`

Route local sau khi login:

```text
http://127.0.0.1:5173/#landing
http://127.0.0.1:5173/#introduction
http://127.0.0.1:5173/#docs-uxr-methods-survey
http://127.0.0.1:5173/#ux-team-ux-research--methods--biweekly-interview
```

Nếu dev server/build preview đang chạy port khác, dùng đúng port Terminal hiển thị. Bản build static gần nhất có thể serve bằng:

```bash
npm run build
ruby -run -e httpd dist -p 4173 -b 127.0.0.1
```

Review build:

```text
http://127.0.0.1:4173/#landing
http://127.0.0.1:4173/#ux-team-ux-research--methods--biweekly-interview
```

### Current Introduction Structure

- Header fixed, không scroll theo nội dung.
- Header có logo Zalopay và search icon.
- Header shadow/border chỉ hiện sau khi scroll xuống hơn `4px`; ở top page header phẳng, không shadow.
- Header nav gồm:
  - `Our team here`
  - `UI Team`
  - `UX Team`
  - `Motion Hub`
- Khi chọn một tab trên header nav, page sẽ chọn trang con đầu tiên của tab main đó nếu tab có children.
- Reload giữ đúng tab/hash hiện tại. Chỉ khi bấm logo Zalopay mới quay về landing.
- `UI Team`, `UX Team` và `Motion Hub` đang có sidebar/content.
- `Motion Hub` hiện có preview page riêng, dẫn ra Motion Hub external.
- Page content dùng 2 cấp label pill:
  - label trên H1 là tab cấp 1/main section hiện tại, ví dụ `UI Team`, `UX Design`, `UX Research`, `UX Writing`, `Motion Hub`.
  - label bên trong article/content là tab cấp 2 hiện tại, ví dụ `Workflow`, `Methods`, `UX Pattern`, `UX Principle`.
  - nếu title trong content bị trùng với H1 phía trên thì bỏ title dưới, chỉ giữ label cấp 2 và mô tả/body.
  - shared class: `pageLabelPillClassName` cho label trên H1, `contentLabelPillClassName` cho label trong article.
- Header nav dùng pill animation kiểu React Bits `PillNav`:
  - hover có nền tròn trượt lên
  - text trượt đổi màu
  - active tab nền blue brand, chữ trắng
  - active tab không bounce, không slide text khi click từ hover state
  - hover animation chỉ áp dụng cho tab chưa active qua selector `:not(.is-active)`
  - không có active dot
  - không có stroke nav container
- Header nav text size hiện là `16px`.
- Search icon dùng icon button style để đồng bộ màu nền, màu icon và hover state.
- Search icon vẫn hiển thị cursor pill `You` khi landing active vì cursor tracking chạy ở window level và portal lên body.
- Search mở command modal:
  - click search icon hoặc dùng `Cmd/Ctrl + K`
  - `Esc` đóng modal
  - arrow up/down đổi result
  - `Enter` mở result đang active
  - search normalize tiếng Việt bằng `normalizeSearchText`, hỗ trợ tìm không dấu
  - result index gồm landing, Our Team, UI Team, UI Principles, từng principle, UX Team, UX Research workflow/methods và Motion Hub.

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
  - `childGapClass`: `space-y-[8px]`
  - `childIndentClass`: `pl-[16px]`
  - `childListTopGapClass`: `pt-[8px]`
  - `childLevelGapClass`: `pt-[8px]`
  - `mainGroupGapClass`: `space-y-[8px]`
  - `primaryChildHeightClass`: `h-[44px]`
- CSS override riêng cho Introduction line sidebar nằm trong `src/index.css`:
  - `.hub-intro-sidebar-line .line-sidebar__list { padding: 0; }`
  - `.hub-intro-sidebar-line .line-sidebar__item { min-height: 44px; }`
  - `.hub-intro-sidebar-line .line-sidebar__label { font-weight: 400; }`

Sidebar spacing thực tế:

| Quan hệ | Spacing |
| --- | --- |
| Giữa các main group | `8px` |
| Main tới child cấp 1 đầu tiên | `8px` |
| Giữa các child cấp 1 | `8px` |
| Child cấp 1 tới child cấp 2 | `8px` |
| Giữa các child cấp 2 | `8px` |

Landing page rule:

- Khi vào trang Introduction hoặc reload page, mặc định hiển thị landing trước.
- Landing page là trang overview của Design Hub, chứa entry point tới các main tab chính.
- Landing hero dùng full-bleed background `100vw`, không bị padding/max-width hai bên.
- Landing hero cao gần full viewport; cụm text align left nhưng nằm giữa vùng hero, không dính bottom.
- Landing hero dùng animated DotGrid trên nền trắng:
  - component: `src/components/DotGrid.tsx`
  - wrapper CSS: `.hub-landing-dot-background`, `.hub-landing-dot-grid`
  - base dot: `#eff6ff`
  - active dot: `#00CF6A`
  - dot size: `4px`
  - gap: `28px`
- Landing H1 theo Figma node `1422:22893`:
  - text: `Cùng thiết kế trải nghiệm tốt hơn cùng Product Design team`
  - text chính: `#001f3e`
  - `Product Design`: `#0033c9`
  - `team`: `#00cf6a`
  - desktop size/line-height: `84px / 96px`
  - tablet breakpoint size/line-height: `64px / 74px`
  - mobile size/line-height: `3.5rem / 3.85rem`
  - hero heading không dùng text animation.
- Landing hero hiện không render 2 CTA trong hero; các entry point nằm ở card/news bên dưới.
- Landing news strip:
  - class: `.hub-landing-news`
  - mỗi item là card riêng nền trắng, radius `0.875rem`, border `var(--ds-border-stroke2)`
  - layout `label pill + nội dung + arrow`
  - label pill không bold (`font-weight: 500`)
  - hover/focus: nền `#fbfdff`, border xanh nhẹ, lift `-2px`
  - mobile tự stack 1 cột, không dùng divider dài giữa các item.
- Landing main cards:
  - class: `.hub-landing-card`
  - radius `0.875rem`, nền trắng, border nhẹ, không shadow khi chọn/hover
  - min height desktop khoảng `15.5rem`
  - top line gồm dot màu + label + arrow, dot/text align center theo hàng
  - label không dùng Black/bold nặng; card title mới là phần nhấn chính
  - hover/focus: nền rất nhẹ `#fbfdff`, border xanh nhẹ, lift nhẹ
  - `Motion Hub` đã có nội dung nên không còn label `Soon`
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
- `TargetCursor` có prop `showDot?: boolean`.
  - Logo dùng mặc định `showDot={true}`, nên có dot xanh ở giữa khung.
  - Landing click targets dùng `showDot={false}`, nên chỉ còn 4 góc target, không có dot giữa.
- Landing dùng custom cursor pill `You` giống login:
  - DOM reuse class `.login-you-cursor`, `.login-you-cursor-arrow`, `.login-you-cursor-pill`.
  - Render bằng `createPortal(..., document.body)` để luôn nằm trên header/nav.
  - Cursor dùng `position: fixed` qua `.hub-landing-you-cursor`.
  - Cursor pill nằm trên header/nav/search bằng z-index cao; không bị header đè.
  - Khi landing active, body có class `.hub-landing-cursor-active` để tắt cursor mặc định toàn document.
  - Cursor position đọc từ CSS vars trên `document.documentElement`: `--login-you-cursor-x`, `--login-you-cursor-y`, `--login-you-cursor-opacity`.
  - Cursor vẫn hiện khi rê lên header/search icon vì tracking dùng `window.pointermove`.
  - Text `You` align center trong pill và không có shadow.
  - Không gắn `onPointerLeave` để tắt cursor ở `.hub-landing`; nếu tắt tại landing boundary thì rê lên header/nav sẽ làm pill `You` biến mất.
  - Chỉ tắt cursor khi pointer rời khỏi window hoặc khi landing unmount/không active.
- Landing interactive targets:
  - Các card/news/click target dưới landing vẫn dùng custom cursor/target affordance, không hiện cursor mặc định.
  - Logo giữ target dot ở giữa.
  - Các card/click target bên dưới dùng target frame nhưng bỏ dot giữa (`showDot={false}`).
- Khi landing active:
  - Không hiển thị desktop sidebar.
  - Main content không dùng offset `lg:ml-[19rem]`.
  - Header nav không đánh dấu active tab nào.
- Khi chọn bất kỳ tab main/child từ header hoặc sidebar, thoát landing và hiển thị page tương ứng.
- Khi đổi tab/view, content wrapper remount theo `contentAnimationKey` và chạy `.hub-page-fade-in`:
  - duration `320ms`
  - opacity `0 -> 1`
  - translateY `10px -> 0`
  - respect `prefers-reduced-motion`.

Motion Hub preview:

- Route/hash: `#motion-hub`.
- Không còn badge `Soon` ở main tab Motion Hub.
- `Motion Hub` là main tab độc lập, có content preview riêng trong Introduction Page.
- Hero preview lấy tagline từ Motion Hub external:
  - headline: `Make every interaction go cha-ching`
  - body: `Motion là cách sản phẩm phản hồi người dùng và thể hiện cá tính thương hiệu. Khám phá nguyên tắc đằng sau từng chuyển động, lấy code và asset của chung biến thành của riêng.`
- Cụm tagline không dùng background card; nằm trực tiếp trên page để nhẹ hơn.
- Không render eyebrow `Interaction Hub` trong tagline card vì đã có page label `Motion Hub` phía trên.
- Từ `cha-ching` dùng crystal hover animation giống Motion Hub:
  - hover vào headline mới chạy animation
  - accent depth màu xanh `#00CF6A`
  - blink/sparkle màu xanh `#00CF6A`
  - glare quét chữ dùng cùng xanh brand
  - respect `prefers-reduced-motion`
- CTA chỉ có một nút `Mở MotionHub`, dẫn tới:

```text
https://zlp-motionhub.netlify.app/
```

- CTA hover/focus chỉ zoom nhẹ cả nút, không slide text/icon:
  - selector: `.motion-hub-open-cta`
  - hover/focus: `scale(1.025)`
- Preview bên dưới có các card nhanh tới `Principles`, `Motions`, `Assets`, `Glossary` và nhóm asset sample.

Sidebar structure hiện tại:

```text
Our team here
  Tổng quan

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
  Tổng quan
  UX Design
    UX Principle
    UX Pattern
      Tổng quan
      Onboarding task list
    Workflow
      Tổng quan
      Order Ticket
  UX Research
    Principle
    Methods
      Survey
      In-depth Interview
      Focus Group
      Usability Testing
      Unmoderated UT
      Biweekly Interview
    Workflow
      Tổng quan
      Method Picker Matrix
      Order Research
  UX Writing
    Principles
    Workflow
    Glossary

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
- Main selected đổi weight/text.
- Main có child không dùng selected background khi đang chọn child bên trong; background selected chỉ nằm ở child active.
- Main không có child vẫn dùng selected background nhẹ `#FAFCFF`.
- Nếu main có children thì click main expand/collapse group con.
- Nếu chọn main từ header nav thì tự chọn child cấp 1 đầu tiên của main đó.
- Nếu click parent có children trong UX Team, `normalizeUXTeamView` tự mở trang con đầu tiên:
  - `UX Design` -> `UX Principle`
  - `UX Research` -> `Principle`
  - `UX Writing` -> `Principles`
  - child có cấp 3 như `Methods`, `Workflow`, `UX Pattern` -> `Tổng quan` hoặc item đầu tiên.
- Main không có children không render child placeholder như `Overview` hoặc `To be updated`.
- `Our team here` và `UI Team` hiện có child cấp 1.
- `UX Team` hiện có child cấp 1/cấp 2/cấp 3.
- `Motion Hub` hiện là main item độc lập, không có badge `Soon`.
- Main item hiện render qua helper `renderMainTab`.

Child cấp 1 rule:

- Child cấp 1 nằm ngay dưới main item chứa nó.
- Gap từ main tới child cấp 1 đầu tiên là `8px`.
- Gap giữa các child cấp 1 là `8px`.
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
- Các mục chưa có content gắn badge `Soon`: `UI Pattern`, `Design System`, `Illus System`, `UX Writing`.
- Các trang con của `UX Writing` render body `To be updated`.

Mobile hamburger menu:

- Mobile header dùng component `MobileCardNav` trong `src/pages/IntroductionPage.tsx`.
- Khi mở menu, nav dùng height `calc(100vh - 2rem)`.
- `.mobile-card-nav-content` scroll độc lập bằng `overflow-y: auto`, `overscroll-behavior: contain`, `-webkit-overflow-scrolling: touch`.
- Từng card main tab dùng `flex: 0 0 auto` để không bị shrink khi nội dung dài.
- Mobile link có `key` unique theo path để tránh React reconcile nhầm các label trùng như `Tổng quan` hoặc `Workflow`.
- Mobile link phân cấp bằng `level`:
  - `level 1`: tab cấp 1/main section trong card
  - `level 2`: child của section
  - `level 3`: grandchild, indent sâu hơn

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
- `Our team here` hiện chỉ có một child cấp 1 là `Tổng quan`.
- `Mảng trọng tâm` không còn là child cấp 1 riêng; nội dung được gom vào `Tổng quan`.
- `Tổng quan` giữ hero, Product Design, Disciplines, section `Những việc chúng tôi tập trung làm tốt`, các detail blocks tương ứng, sau đó tới `Design System là nền tảng...` và `Thông điệp của chúng tôi`.
- Section `Design System là nền tảng...` và `Thông điệp của chúng tôi` phải tách riêng sau các detail blocks, không dính vào mục số 6.
- `Mảng trọng tâm` không dùng card grid jump/animate; chỉ giữ detail blocks để tránh duplicate nội dung.
- Focus detail blocks dùng cùng data `productDesignFocusAreas` với card grid cũ, nên nội dung card đã được giữ lại trong block tương ứng.

UX Team content notes:

- Label trên H1 của UX Team luôn là cấp 1:
  - `UX Team` cho overview.
  - `UX Design`, `UX Research`, `UX Writing` cho các nhóm con.
- Label trong article là cấp 2 tương ứng:
  - `UX Principle`, `UX Pattern`, `Workflow`, `Principle`, `Methods`.
- Các page bị trùng title giữa H1 và H2 dưới đã bỏ H2 dưới, ví dụ `Overall`, `Order Ticket`, `Survey`, `Method Picker Matrix`, `Onboarding Task List`.
- `Tổng quan` đã fill introduction từ Figma working file và được cấu trúc lại thành article sections.
- `UX Design / UX Principle` đã fill nội dung principle, có block click tới từng principle detail và Do/Don't card có màu/icon theo trạng thái.
- `UX Design / UX Pattern / Tổng quan` và `Onboarding task list` đã có nội dung theo Figma.
- `UX Design / Workflow / Tổng quan` đã có process map native theo UI web; card trong flow là static, không shadow/click affordance.
- `UX Research / Principle` đã fill nội dung, có table principle và block click tới từng principle detail.
- `UX Research / Methods` hiện đã fill đủ 6 method và mỗi method quan trọng dùng layout riêng để dễ đọc hơn thay vì renderer generic:
  - `Survey`: card định nghĩa, do/don't, material, process, loại câu hỏi, lỗi cần tránh, output, case study. Hash survey vẫn map về `#docs-uxr-methods-survey`.
  - `In-depth Interview`: card định nghĩa, khi nào dùng/không dùng, material, process, kỹ thuật phỏng vấn, output, so sánh với method gần kề, case study.
  - `Focus Group`: card định nghĩa, khi nào dùng/không dùng, material, process, vai trò moderator, output, bảng `FGD vs IDI`, case study.
  - `Usability Testing`: card định nghĩa, khi nào dùng/không dùng, material, process, kỹ thuật điều phối, mức độ nghiêm trọng xếp dọc theo `Nghiêm trọng -> Trung bình -> Nhỏ`, output, so sánh method, case study.
  - `Unmoderated UT`: card định nghĩa, khi nào dùng/không dùng, material, process, hướng dẫn viết task, output, bảng `Moderated vs Unmoderated UT`, case study.
  - `Biweekly Interview`: card định nghĩa, bảng so sánh với research truyền thống, vai trò, cấu trúc buổi, tuyển user, trước/trong/sau buổi, lưu ý vận hành, case study.
- UX Research Methods route/component map:

| Method | Hash | Component |
| --- | --- | --- |
| Survey | `#docs-uxr-methods-survey` | `UXResearchSurveyContent` |
| In-depth Interview | `#ux-team-ux-research--methods--in-depth-interview` | `UXResearchInDepthInterviewContent` |
| Focus Group | `#ux-team-ux-research--methods--focus-group` | `UXResearchFocusGroupContent` |
| Usability Testing | `#ux-team-ux-research--methods--usability-testing` | `UXResearchUsabilityTestingContent` |
| Unmoderated UT | `#ux-team-ux-research--methods--unmoderated-ut` | `UXResearchUnmoderatedUTContent` |
| Biweekly Interview | `#ux-team-ux-research--methods--biweekly-interview` | `UXResearchBiweeklyInterviewContent` |

- Các method trên không còn dùng `UXResearchMethodArticle` generic, trừ khi có method mới chưa tách layout riêng.
- Content `UX Research / Methods` lấy từ Figma node `1423:6206`; riêng `Biweekly Interview` dùng content chi tiết từ subnode `1423:5379`.
- `Biweekly Interview` notes mới nhất:
  - Section `Đây là gì` dùng card full width theo container, không bọc thêm grid làm card bị bó.
  - Recruit không siết screener chặt theo từng product vì user được chia sẻ chung cho cả 3 PO trong buổi.
  - Trước buổi tách rõ `Chuẩn bị context`, `Setup ngữ cảnh thực tế`, và `Chuẩn bị ghi âm/note-taking`.
  - `Chuẩn bị ghi âm/note-taking`: UXR chuẩn bị ghi âm/note-taking, cần ít nhất 1 người observe riêng để hỗ trợ PO.
- `UX Research / Workflow / Tổng quan` dùng exported SVG từ Figma node `1422:22757`, lưu tại `public/ux-research-workflow-map.svg`.
- `UX Research / Workflow / Method Picker Matrix` có decision wizard ở đầu, matrix đầy đủ, `Bốn loại câu hỏi`, `Out-of-scope`, và `Downgrade Table`.
- `UX Research / Workflow / Order Research` đã có content theo workflow order research.
- `UX Writing / Principles`, `UX Writing / Workflow`, `UX Writing / Glossary` hiện render `To be updated`.

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
npm run lint
npm run build
```

Lần verify gần nhất: `npm run build` pass, `npm run lint` pass với các warning cũ không liên quan.

Review local hiện tại:

```text
http://127.0.0.1:5174/#principles
```

Nếu dev server đang chạy port khác, dùng đúng port Terminal hiển thị.

## Login MVP

Login page đang được tắt tạm bằng `LOGIN_ENABLED = false` trong `src/App.tsx`.
Khi flag này tắt, `/`, `/login` và `/loading` đều đi thẳng vào `IntroductionPage`; code login vẫn được giữ lại để bật lại sau.

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
