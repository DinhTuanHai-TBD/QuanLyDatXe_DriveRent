# DESIGN.md - Design System & Visual Guidelines

## 1. Visual Direction & Brand Identity
- **Theme:** Seaside Coastal Breeze / Vịnh Biển Nha Trang Hiện Đại.
- **Tone:** Trong lành, hiện đại, tin cậy, tràn đầy năng lượng du lịch biển.
- **Anti-Patterns (Nghiêm cấm theo Impeccable & UI/UX Pro Max):**
  - Không dùng gradient màu tím - xanh neon mặc định của AI (AI slop).
  - Không dùng chữ xám mờ trên nền xám gây khó đọc (độ tương phản phải đạt tối thiểu WCAG 4.5:1).
  - Không nhồi nhét hiệu ứng bóng đổ đen kịt; chỉ sử dụng bóng đổ nhẹ đa tầng (soft ambient shadows) hoặc viền mỏng tinh tế (`border-sky-100` / `border-sky-200`).
  - Nút bấm và vùng chạm phải đạt tối thiểu 44×44px trên thiết bị di động.

## 2. Color Palette (Semantic Tokens)
- **Primary Brand (Biển & Trời Nha Trang):**
  - Base: `#0284c7` (`sky-600`) / `#0ea5e9` (`sky-500`)
  - Accent / Hover: `#0369a1` (`sky-700`) / `#38bdf8` (`sky-400`)
  - Gradient phụ trợ: `from-sky-600 to-cyan-600` (dùng cho các banner kêu gọi hành động)
- **Backgrounds & Surfaces:**
  - Nền trang chính: `#f8fafc` (`slate-50`)
  - Nền thẻ / Card: `#ffffff` (`white`) có viền nhẹ `border-sky-200`
  - Nền bề mặt phụ: `bg-sky-50/70` hoặc `bg-sky-50/40`
- **Text & Hierarchy:**
  - Tiêu đề & Heading: `#0f172a` (`slate-900`), font-weight 800 - 900
  - Tiêu đề phụ / Subtitle: `#0369a1` (`sky-700`) hoặc `#0c4a6e` (`sky-900`)
  - Văn bản nội dung (Body): `#334155` (`slate-700`) hoặc `#475569` (`slate-600`)
  - Nhãn ghi chú / Meta: `#64748b` (`slate-500`)

## 3. Typography
- **Primary Font:** `Plus Jakarta Sans`, sans-serif (hiện đại, bo tròn nhẹ góc chữ, thanh lịch).
- **Numbers / Metrics / Dates:** `JetBrains Mono` hoặc `Plus Jakarta Sans` với `tabular-nums` để số liệu thẳng hàng.

## 4. Components & Elevation
- **Card:** Bo góc lớn mềm mại `rounded-3xl` (24px) hoặc `rounded-2xl` (16px), đường viền sắc nét `border-2 border-sky-100` hoặc `border-sky-200`, hiệu ứng nhấc thẻ khi hover: `hover:-translate-y-1 hover:shadow-lg hover:border-sky-400 transition-all duration-300`.
- **Buttons:**
  - Nút chính (CTA): `bg-sky-500 hover:bg-sky-600 text-white font-black rounded-2xl shadow-md shadow-sky-500/25 active:scale-[0.98]`.
  - Nút phụ: `bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-2xl border border-sky-200`.
- **Badges / Tags:** Bo tròn `rounded-full`, nền pastel nhẹ `bg-sky-100 text-sky-800 text-xs font-black px-3 py-1`.

## 5. Mobile & Responsive Standards
- Thiết kế ưu tiên Mobile First: thanh toán, form tìm kiếm, danh thiếp xe co giãn mượt mà từ 360px đến 1440px+.
- Cấm hiện thanh cuộn ngang ngoài ý muốn (`overflow-x-hidden`).

