# Loading

Folder này dùng để quản lý ghi chú, task, node id, và review liên quan đến **Loading page**.

## Link View Local

```text
http://127.0.0.1:5173/loading?loop=true
http://127.0.0.1:5173/loading
```

Nếu Vite chạy port khác, dùng đúng port Terminal hiển thị.

## Current Spec

- `/loading?loop=true`: chạy loop loading để review motion, chưa vào login.
- `/loading`: chạy cùng transition stack với login; Login nằm dưới, Loading phủ lên trên rồi dissolve ra. Kết thúc flow app điều hướng về `/login`.
- Timeline logo/text reveal: `1.45s`.
- Exit bắt đầu tại `1.5s`.
- Complete flow tại `2.38s`.
- Background chính: trắng `#ffffff`.
- Logo/text: `Zalopay | Design Hub`, dùng màu từ Figma node `1332:759`.
- Logo/text colors: blue `#0033C9`, green `#00CF6A`.
- Logo/text scale: desktop `min(28rem, 78vw)`, mobile `min(22rem, 86vw)`.
- Không còn progress bar hoặc orb/chấm loader.
- Logo/text motion hiện tại: reveal bằng fade/blur/scale nhẹ, giữ opacity ở cuối để tránh nháy, rồi exit bằng fade/blur/slide lên.
- Transition qua login lấy cảm hứng từ Atlassian Design: restrained, calm, stagger nhẹ, không có logo fly-out mạnh.

## Timing

```ts
LOGO_REVEAL_DURATION = 1450
LOOP_DURATION = 1500
EXIT_START = 1500
COMPLETE_DURATION = 2380
```

## Files

```text
src/pages/LoadingPage.tsx
src/components/hub/LoginLoadingScreen.tsx
src/index.css
public/zalopay-design-hub-logo-color.svg
```

## Figma / Asset Notes

- Figma logo node: https://www.figma.com/design/0P0SrXQUWoJT6YlFntA2N3/Chin---Working-file?node-id=1332-759
- Logo color dùng cho nền trắng.
- Wording trong logo cần giữ là `Design Hub`.
- Nếu thay asset từ Figma, kiểm tra lại SVG không có background rect nội bộ.

## Gợi Ý File Có Thể Tạo Thêm

```text
loading-layout.md
loading-copy.md
loading-mobile-review.md
```
