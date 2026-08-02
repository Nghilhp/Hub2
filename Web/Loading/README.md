# Loading

Folder này dùng để quản lý ghi chú, task, node id, và review liên quan đến **Loading page**.

## Link View Local

```text
http://127.0.0.1:5173/loading
http://127.0.0.1:5173/
```

Nếu Vite chạy port khác, dùng đúng port Terminal hiển thị.

## Current Spec

- `/loading`: trang loading riêng để review/chỉnh motion, chạy loop và không tự chuyển vào landing.
- `/`: khi vào landing mặc định, app render landing bên dưới và Loading phủ lên trên rồi dissolve ra.
- Deep link có hash như `#introduction`, `#motion-hub`, `#docs-uxr-methods-survey` vào thẳng nội dung, không chạy intro loading.
- Timeline logo assembly/reveal: `2.4s`.
- Exit bắt đầu tại `2.6s`.
- Complete flow tại `3.4s`.
- Background chính: trắng `#ffffff`.
- Logo: `Z | Zalo pay`, dùng material từ Figma node `1423:6448`.
- Logo/text colors: blue `#0033C9`, green `#00CF6A`.
- Logo/text scale: desktop `min(61.7rem, 86vw)`, mobile `min(31rem, 88vw)`.
- Không còn progress bar hoặc orb/chấm loader.
- Logo motion hiện tại: Z mark vào trước, divider draw theo trục dọc, wordmark reveal theo clip/shared-axis, rồi exit bằng fade/blur/slide lên.
- Transition qua landing: restrained, calm, không có logo fly-out mạnh.

## Timing

```ts
LOGO_REVEAL_DURATION = 2400
LOOP_DURATION = 2800
EXIT_START = 2600
COMPLETE_DURATION = 3400
```

## Files

```text
src/pages/LoadingPage.tsx
src/components/hub/LoginLoadingScreen.tsx
src/index.css
public/zalopay-design-hub-logo-color.svg
public/loading-zmark.svg
public/loading-divider.svg
public/loading-zalopay-wordmark.svg
```

## Figma / Asset Notes

- Figma loading node: https://www.figma.com/design/0P0SrXQUWoJT6YlFntA2N3/Chin---Working-file?node-id=1423-6448
- Logo color dùng cho nền trắng.
- Asset đã được tải local để tránh phụ thuộc URL Figma MCP hết hạn.
- Nếu thay asset từ Figma, kiểm tra lại SVG không có background rect nội bộ.

## Gợi Ý File Có Thể Tạo Thêm

```text
loading-layout.md
loading-copy.md
loading-mobile-review.md
```
