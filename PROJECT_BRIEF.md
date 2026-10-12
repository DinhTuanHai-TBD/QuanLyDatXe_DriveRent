# TÀI LIỆU BRIEF DỰ ÁN (PROJECT BRIEF)
## HỆ THỐNG QUẢN LÝ DỊCH VỤ CHO THUÊ XE MÁY & Ô TÔ TỰ LÁI (DRIVERENT)

* **Tên dự án:** DriveRent - Smart Car & Motorbike Rental Management System
* **Mã dự án:** `DRV-RENT-2026`
* **Kho mã nguồn (GitHub):** [https://github.com/DinhTuanHai-TBD/QuanLyDatXe_DriveRent](https://github.com/DinhTuanHai-TBD/QuanLyDatXe_DriveRent)
* **Phiên bản:** 1.0.0
* **Ngày lập brief:** 11/10/2026

---

## 1. TỔNG QUAN DỰ ÁN & BÀI TOÁN THỰC TẾ (PROBLEM STATEMENT)

### 1.1. Bối cảnh thị trường
Tại các thành phố du lịch trọng điểm như Đà Nẵng, Nha Trang, Phú Quốc, Đà Lạt, Quy Nhơn,... nhu cầu thuê xe máy và ô tô tự lái của du khách trong và ngoài nước luôn duy trì ở mức cao. Các nhà xe, cửa hàng tư nhân thường sở hữu quy mô từ 15 – 80 đầu xe hỗn hợp (bao gồm xe tay ga, xe số, sedan 4 chỗ, SUV/MPV 7 chỗ).

### 1.2. Các "nỗi đau" (Pain Points) thực tế của các chủ cửa hàng
1. **Mất kiểm soát trạng thái phương tiện thời gian thực:** Quản lý thủ công qua sổ viết tay hoặc nhóm chat Zalo khiến nhân viên không nắm rõ xe nào đang rảnh tại bãi, xe nào đang phục vụ khách, xe nào quá hạn trả và xe nào đang hỏng hóc hoặc cần bảo dưỡng. Hậu quả là trùng lịch cho thuê (overbooking) hoặc bỏ lỡ cơ hội tiếp nhận khách.
2. **Thất lạc hồ sơ & Tranh chấp trầy xước lúc nhận/trả:** Thiếu quy trình số hóa giấy tờ tùy thân (CCCD, Giấy phép lái xe) và ảnh chụp đối chiếu hiện trạng xe lúc bàn giao và nhận lại. Khi xảy ra va quẹt, hư hỏng hoặc vi phạm giao thông (phạt nguội), nhà xe gặp khó khăn trong việc quy trách nhiệm.
3. **Tính toán chi phí thủ công, dễ nhầm lẫn tiền cọc:** Khách thuê xe du lịch phát sinh nhiều yếu tố linh động: thuê thêm giờ, trả lệch giờ, thiếu hụt xăng/dầu, phụ phí giao nhận xe tận khách sạn/sân bay. Việc tính tiền bằng tay dễ dẫn đến sai sót, gây tranh cãi gay gắt khi hoàn trả cọc (Security Deposit).
4. **Bỏ quên lịch thay nhớt và bảo dưỡng định kỳ:** Xe cho thuê hoạt động cường độ cao. Việc quên thay nhớt, quên kiểm tra phanh và lốp xe theo định mức km lăn bánh khiến xe mau xuống cấp, tăng nguy cơ sự cố gây mất an toàn cho du khách trên các cung đường đèo dốc.

### 1.3. Mục tiêu giải pháp DriveRent
Xây dựng một hệ thống phần mềm quản trị tập trung (All-in-one Management Platform) chuyên biệt cho ngành cho thuê xe du lịch, bao gồm:
* Giao diện quản trị nội bộ trực quan cho quản lý, nhân viên tiếp tân và thợ kỹ thuật.
* Cổng đặt xe trực tuyến (Customer Booking Portal) hỗ trợ khách hàng tìm kiếm xe, xem giá minh bạch và đặt cọc trực tuyến.

---

## 2. ĐỐI TƯỢNG SỬ DỤNG (TARGET PERSONAS)

| Vai trò | Người dùng đại diện | Nhu cầu & Hành vi cốt lõi |
| :--- | :--- | :--- |
| **Chủ cửa hàng / Quản lý** | Nguyễn Văn Minh | Giám sát toàn bộ đội xe, theo dõi doanh thu, công nợ, tiền cọc đang nắm giữ và hiệu suất kinh doanh qua Dashboard thời gian thực. |
| **Nhân viên cho thuê (Sales/Staff)** | Trần Thị Thu Thảo | Tra cứu xe trống, lập hợp đồng thuê xe chỉ trong 2 phút, chụp hồ sơ CCCD/GPLX, thực hiện biên bản bàn giao xe và quyết toán chi phí. |
| **Kỹ thuật viên / Thợ bảo dưỡng** | Lê Hoàng Dũng | Tiếp nhận cảnh báo xe đến hạn thay nhớt/bảo dưỡng (theo km hoặc ngày), cập nhật tiến độ sửa chữa, ghi nhận chi phí phụ tùng. |
| **Khách hàng / Du khách** | Khách du lịch cá nhân & gia đình | Xem danh mục xe, đặt giữ chỗ online, quét mã QR thanh toán đặt cọc nhanh, nhận thông báo mã hợp đồng. |

---

## 3. CÁC TÍNH NĂNG CỐT LÕI (CORE FEATURES)

### 3.1. Sơ đồ trạng thái xe trực quan (Visual Fleet Status Board)
* **Tệp mã nguồn đại diện:** [`src/views/FleetView.tsx`](file:///c:/Users/ASUS/source/repos/QuanLyDatXe_DriveRent/src/views/FleetView.tsx), [`src/views/DashboardView.tsx`](file:///c:/Users/ASUS/source/repos/QuanLyDatXe_DriveRent/src/views/DashboardView.tsx)
* **Phân loại trạng thái 3 cấp độ:**
  * 🟢 **Sẵn sàng (Available):** Xe đang ở bãi đỗ, đã vệ sinh sạch sẽ, đầy đủ giấy tờ, sẵn sàng giao khách ngay lập tức.
  * 🔵 **Đang cho thuê (Rented):** Xe đang lăn bánh phục vụ khách. Hiển thị thông tin khách thuê, giờ nhận - trả dự kiến, cờ báo động nếu quá giờ hẹn trả (Overdue indicator).
  * 🟠 **Đang bảo dưỡng (Maintenance):** Xe đang trong xưởng thay nhớt, sửa chữa hoặc bảo dưỡng định kỳ. Tự động vô hiệu hóa trên hệ thống đặt xe.
* **Bộ lọc và Chế độ hiển thị:**
  * Lọc đa chiều: Theo loại xe (*Tất cả / Ô tô / Xe máy*), theo trạng thái phương tiện, theo từ khóa biển số/dòng xe.
  * Bộ lọc khả dụng theo khoảng thời gian (*Check Date Availability*): Chọn ngày nhận - ngày trả để hệ thống tự động loại trừ các xe đã có lịch đặt trước.
  * Hỗ trợ 2 chế độ hiển thị: Dạng thẻ lưới trực quan (**Grid View**) kèm ảnh thật, mức nhiên liệu (vạch xăng 1-8/8), số ODO; và Dạng bảng tổng hợp (**Table View**) phục vụ kiểm kê nhanh.

### 3.2. Quản lý hợp đồng & Lưu trữ hồ sơ giao/nhận (Contract & Digital Handover)
* **Tệp mã nguồn đại diện:** [`src/views/CreateContractWizard.tsx`](file:///c:/Users/ASUS/source/repos/QuanLyDatXe_DriveRent/src/views/CreateContractWizard.tsx), [`src/views/HandoverReturnModal.tsx`](file:///c:/Users/ASUS/source/repos/QuanLyDatXe_DriveRent/src/views/HandoverReturnModal.tsx), [`src/views/PrintContractModal.tsx`](file:///c:/Users/ASUS/source/repos/QuanLyDatXe_DriveRent/src/views/PrintContractModal.tsx)
* **Quy trình Wizard 4 bước khởi tạo hợp đồng:**
  1. *Bước 1 - Chọn xe & Khung giờ thuê:* Hỗ trợ chọn phương thức tính giá (theo Giờ hoặc theo Ngày), kiểm tra xung đột lịch trình trước khi xác nhận.
  2. *Bước 2 - Thông tin khách thuê:* Chọn khách cũ từ danh bạ hoặc tạo mới (Họ tên, SĐT, Địa chỉ tạm trú).
  3. *Bước 3 - Lưu trữ giấy tờ tùy thân:* Upload và lưu trữ ảnh chụp thực tế CCCD/Hộ chiếu mặt trước/sau và Giấy phép lái xe (GPLX) phù hợp hạng xe.
  4. *Bước 4 - Thiết lập chi phí & Tiền cọc:* Nhập tiền cọc (Cách ly bảo vệ tài sản: 5.000.000đ với ô tô, 1.000.000đ với xe máy), các phụ phí thỏa thuận (giao xe sân bay, mũ bảo hiểm bổ sung) và giảm giá.
* **Biên bản số hóa bàn giao xe (Handover Record):**
  * Ghi nhận chính xác thời điểm giao xe thực tế, số km đồng hồ ODO lúc xuất bãi, mức vạch xăng.
  * Checklist bàn giao phụ kiện: Đăng ký xe/Cavet photo công chứng, bảo hiểm TNDS, mũ bảo hiểm, áo mưa, bộ kích lốp/lốp dự phòng ô tô.
  * Chụp ảnh hiện trạng 4 mặt xe lúc giao khách để làm căn cứ đối chiếu.
* **Biên bản kiểm tra hoàn trả xe (Return Inspection):**
  * Checklist 6 hạng mục kiểm tra: Thân vỏ dàn áo, Lốp xe, Đèn còi xi-nhan, Gương chiếu hậu, Mức nhiên liệu, Phụ kiện đi kèm.
  * Ghi nhận hư hỏng/vết trầy xước phát sinh kèm ảnh chụp thực tế và nhập mức phí phạt bồi thường (Damage Fee).
* **In hợp đồng & Biên bản bàn giao:** Mẫu in chuẩn khổ A4 đầy đủ Quốc hiệu Tiêu ngữ, điều khoản bảo vệ tài sản, chữ ký hai bên phục vụ ký kết trực tiếp.

### 3.3. Tính tiền tự động & Quyết toán phân định tiền cọc (Auto-Billing & Smart Settlement)
* **Tệp mã nguồn đại diện:** [`src/views/SettlementModal.tsx`](file:///c:/Users/ASUS/source/repos/QuanLyDatXe_DriveRent/src/views/SettlementModal.tsx), [`src/utils/formatters.ts`](file:///c:/Users/ASUS/source/repos/QuanLyDatXe_DriveRent/src/utils/formatters.ts)
* **Quy chuẩn tính thời gian thuê thực tế:**
  * **Thuê theo giờ:** Làm tròn lên theo giờ nguyên (*Ceil to full hour*), tối thiểu 1 giờ.
  * **Thuê theo ngày:** Tính theo chu kỳ 24 giờ bắt đầu từ thời điểm bàn giao thực tế (*Handover actual time*). Không tự ý làm tròn sai lệch đơn vị đã thỏa thuận.
* **Công thức quyết toán tổng chi phí dịch vụ:**
  $$\text{Tổng tiền dịch vụ} = (\text{Số đơn vị thực tế} \times \text{Đơn giá}) + \text{Tổng phụ phí} + \text{Phí phạt hư hỏng} - \text{Giảm giá}$$
* **Cơ chế tách bạch tiền cọc (Security Deposit Isolation):**
  * Tiền cọc của khách được lưu trữ riêng biệt, không tính gộp vào doanh thu dịch vụ ban đầu.
  * Nhân viên có thể linh hoạt chọn:
    1. *Khấu trừ cọc vào phần tiền dịch vụ còn thiếu:* Cọc tự động bù trừ tiền thuê, tính ra khoản phải thu thêm hoặc khoản cọc thừa cần hoàn lại cho khách.
    2. *Tách rời hoàn cọc:* Khách thanh toán riêng toàn bộ tiền dịch vụ và nhận lại 100% tiền cọc ban đầu.
  * Hỗ trợ thanh toán: Tiền mặt, Chuyển khoản ngân hàng VietQR, Ví điện tử.

### 3.4. Quản lý lịch bảo trì & Nhắc thay nhớt định kỳ (Fleet Maintenance & Oil Tracking)
* **Tệp mã nguồn đại diện:** [`src/views/MaintenanceView.tsx`](file:///c:/Users/ASUS/source/repos/QuanLyDatXe_DriveRent/src/views/MaintenanceView.tsx)
* **Phân loại nghiệp vụ kỹ thuật:**
  * Thay dầu nhớt động cơ & lọc nhớt.
  * Bảo dưỡng định kỳ (cấp 5.000km, 10.000km, 20.000km).
  * Thay lốp xe, má phanh và nhông xích xe máy.
  * Sửa chữa sự cố/hỏng hóc đột xuất phát sinh sau khi nhận xe từ khách.
* **Cơ chế cảnh báo kép (Dual-trigger Alerts):**
  * *Theo đồng hồ ODO:* Tự động cảnh báo khi xe chạy đạt ngưỡng định mức (Xe máy: mỗi 3.000 km; Ô tô: mỗi 5.000 km kể từ lần bảo dưỡng trước).
  * *Theo mốc thời gian:* Cảnh báo khi vượt quá ngưỡng ngày quy định (ví dụ 90 ngày chưa bảo dưỡng).
* **Vòng đời bảo dưỡng:**
  * `Sắp đến hạn (Upcoming)` $\rightarrow$ `Đang thực hiện (In Progress)` $\rightarrow$ `Hoàn thành (Completed)` / `Quá hạn (Overdue)`.
  * Sau khi hoàn thành: Nhập chi phí thực tế, ghi chú kiểm định, hệ thống tự động sinh mốc bảo dưỡng tiếp theo (Target Km & Target Date) và chuyển xe về trạng thái "Sẵn sàng".

---

## 4. TÍNH NĂNG MỞ RỘNG CÓ SẴN: CỔNG KHÁCH HÀNG (CUSTOMER PORTAL)

Hệ thống được tích hợp sẵn phân hệ dành riêng cho du khách tại [`src/views/customer/`](file:///c:/Users/ASUS/source/repos/QuanLyDatXe_DriveRent/src/views/customer/):
* **Trang chủ & Catalogue xe trực tuyến:** Du khách xem ảnh thật, tính năng, hộp số, dung tích bình xăng, giá thuê theo giờ và theo ngày.
* **Đặt cọc giữ chỗ 10 phút (10-minute Lock Reservation):** Đặt giữ xe trong 10 phút với mã QR chuyển khoản 20% tiền giữ chỗ, có đồng hồ đếm ngược thời gian thực.
* **Tra cứu hợp đồng & Mã đơn thuê:** Khách chỉ cần nhập số điện thoại hoặc mã Booking để kiểm tra trạng thái phê duyệt và lịch nhận xe.

---

## 5. THIẾT KẾ GIAO DIỆN MẪU (UI/UX MOCKUPS & ARCHITECTURE)

Dưới đây là sơ đồ mô phỏng các màn hình giao diện chính có sẵn trong mã nguồn:

### 5.1. Sơ đồ điều hướng hệ thống (Site Map)
```
[ DriveRent System ]
 │
 ├── [ Customer Portal Mode ] (Dành cho Du khách)
 │    ├── Trang chủ & Banner khuyến mãi (/home)
 │    ├── Danh mục tìm kiếm & Lọc xe máy / ô tô (/vehicles)
 │    ├── Chi tiết phương tiện & Thông số (/vehicle_detail)
 │    ├── Modal Đặt xe & Thanh toán QR giữ cọc (/checkout)
 │    ├── Tra cứu đơn đặt xe theo SĐT (/lookup)
 │    └── Hướng dẫn thủ tục & Liên hệ cứu hộ (/guide, /contact)
 │
 └── [ Admin Operations Mode ] (Dành cho Cửa hàng)
      ├── 1. Tổng quan Dashboard: KPI, Cọc đang giữ, Xe quá hạn, Lịch nhận/trả hôm nay
      ├── 2. Quản lý đội xe (Fleet): Sơ đồ trạng thái trực quan (Available / Rented / Maintenance)
      ├── 3. Lịch trình xe (Schedule): Lịch biểu trực quan phân bổ phương tiện theo ngày
      ├── 4. Hợp đồng (Contracts): Wizard 4 bước, Quản lý trạng thái, In hợp đồng PDF
      ├── 5. Bàn giao & Thu hồi xe: Modal kiểm tra 6 hạng mục, chụp ảnh CCCD & hiện trạng
      ├── 6. Quyết toán chi phí: Modal tính giờ thực tế, khấu trừ cọc, xuất hóa đơn
      ├── 7. Bảo trì & Thay nhớt: Bảng theo dõi số Km ODO, nhắc thay nhớt định kỳ
      ├── 8. Quản lý khách hàng: Hồ sơ, lịch sử thuê, đánh giá độ tin cậy
      ├── 9. Báo cáo tài chính: Doanh thu thực tế, chi phí bảo trì, công nợ
      └── 10. Cài đặt cửa hàng: Tỷ giá phạt trễ giờ, ngưỡng bảo dưỡng, tài khoản ngân hàng
```

### 5.2. Mockup Giao diện Sơ đồ trạng thái xe (Fleet Board)
```
+---------------------------------------------------------------------------------------------------------+
| [DriveRent Logo]   [Dashboard]  [Đội xe]*  [Lịch trình]  [Hợp đồng]  [Bảo dưỡng]  [Tài chính]   (Admin) v |
+---------------------------------------------------------------------------------------------------------+
|  QUẢN LÝ ĐỘI XE                                                   [ + Thêm xe mới ]  [ Lọc khả dụng ]   |
|  [ Ô tô (5) ]  [ Xe máy (7) ]   |   [ Tất cả ] [ Sẵn sàng: 8 ] [ Đang thuê: 3 ] [ Bảo dưỡng: 1 ]        |
+---------------------------------------------------------------------------------------------------------+
| +-------------------------+ +-------------------------+ +-------------------------+ +-----------------+ |
| | [ẢNH XE TOYOTA VIOS]    | | [ẢNH XPANDER 7 CHỖ]     | | [ẢNH HONDA VISION]      | | [HONDA AIRBLADE]| |
| | 43A-582.19              | | 43A-629.41              | | 43-D1 882.19            | | 43-K2 918.42    | |
| | Trạng thái: [ SẴN SÀNG ]| | Trạng thái: [ĐANG THUÊ] | | Trạng thái: [ SẴN SÀNG ]| | [BẢO DƯỠNG]     | |
| | Giá: 750k/ngày | 90k/h  | | Khách: Trần Văn Nam     | | Giá: 130k/ngày | 20k/h  | | Quá hạn thay dầu| |
| | Xăng: [■■■■■■■■] 8/8    | | Trả: 18:00 Hôm nay      | | Xăng: [■■■■■■■□] 7/8    | | ODO: 28.450 km  | |
| | ODO: 32.450 km          | | Cảnh báo: Đúng hạn      | | ODO: 14.200 km          | | [Thực hiện ngay]| |
| | [Tạo HĐ] [Chi tiết]     | | [Thu hồi xe] [Chi tiết] | | [Tạo HĐ] [Chi tiết]     | | [Chi tiết]      | |
| +-------------------------+ +-------------------------+ +-------------------------+ +-----------------+ |
+---------------------------------------------------------------------------------------------------------+
```

### 5.3. Mockup Giao diện Lập hợp đồng & Hồ sơ giấy tờ (Create Wizard)
```
+---------------------------------------------------------------------------------------------------------+
| TẠO HỢP ĐỒNG THUÊ XE MỚI                                                                            [X] |
| Bước: (1) Chọn xe & Thời gian -> (2) Khách hàng -> (3) Giấy tờ CCCD/GPLX* -> (4) Tiền cọc & Chi phí     |
+---------------------------------------------------------------------------------------------------------+
|  HỒ SƠ GIẤY TỜ TÙY THÂN KHÁCH HÀNG                                                                      |
|                                                                                                         |
|  +-------------------------------------+   +-------------------------------------+                      |
|  | [ẢNH CCCD MẶT TRƯỚC]                |   | [ẢNH GIẤY PHÉP LÁI XE GỐC]          |                      |
|  | Số: 048095001234                    |   | Hạng: B2 - Số: 790123456789         |                      |
|  | Họ tên: Nguyễn Hoàng Long           |   | Hạn dùng: 2032                      |                      |
|  | [Tải lại ảnh khác]                  |   | [Tải lại ảnh khác]                  |                      |
|  +-------------------------------------+   +-------------------------------------+                      |
|                                                                                                         |
|  Ghi chú đối chiếu giấy tờ: [ Đã kiểm tra đối chiếu CCCD & Bằng lái gốc, trùng khớp khuôn mặt ]          |
|  Nhân viên thực hiện: Trần Thị Thu Thảo (Sales)                                                         |
|                                                                                                         |
|  [ Quay lại ]                                                                  [ Tiếp tục bước 4 -> ]   |
+---------------------------------------------------------------------------------------------------------+
```

### 5.4. Mockup Giao diện Bàn giao & Thu hồi xe (Handover & Return Modal)
```
+---------------------------------------------------------------------------------------------------------+
| BIÊN BẢN HOÀN TRẢ XE - HỢP ĐỒNG #HD-2026-002                                                        [X] |
+---------------------------------------------------------------------------------------------------------+
| Xe: Mitsubishi Xpander (43A-629.41) | Khách hàng: Trần Văn Nam (0912 345 678)                           |
| Giờ nhận thực tế: 11/10/2026 17:45 | ODO trả: 49.180 km (Chạy 260 km) | Nhiên liệu trả: 7/8 vạch        |
+---------------------------------------------------------------------------------------------------------+
| CHECKLIST KIỂM TRA TÌNH TRẠNG LÚC TRẢ:                                                                  |
|   [v] Thân vỏ / Dàn áo        [v] Hệ thống lốp xe       [v] Đèn & Xi-nhan                               |
|   [v] Gương chiếu hậu         [v] Mức nhiên liệu        [v] Phụ kiện (Giấy tờ, mũ bảo hiểm, kích lốp)   |
|                                                                                                         |
| Hiện trạng hư hại: [ Trầy xước nhẹ góc cản sau bên phụ do quẹt vỉa hè                                 ] |
| Phí bồi thường hư hỏng (Damage Fee): [ 300.000 đ ]                                                      |
| Ảnh chụp hiện trạng trả xe: [ Xem 2 ảnh thực tế đã tải lên ]                                            |
| Chuyển trạng thái xe sau khi trả: (•) Sẵn sàng cho thuê tiếp    ( ) Đưa vào bảo dưỡng                   |
|                                                                                                         |
|                                                     [ Lưu biên bản & Chuyển sang Quyết toán chi phí -> ] |
+---------------------------------------------------------------------------------------------------------+
```

### 5.5. Mockup Giao diện Quyết toán & Phân định tiền cọc (Settlement Modal)
```
+---------------------------------------------------------------------------------------------------------+
| QUYẾT TOÁN THANH LÝ HỢP ĐỒNG #HD-2026-002                                                           [X] |
+---------------------------------------------------------------------------------------------------------+
| 1. CHI PHÍ DỊCH VỤ THỰC TẾ:                                                                             |
|    - Thời gian thuê thực tế: 2 ngày 3 giờ -> Tính 3 ngày x 950.000 đ = 2.850.000 đ                      |
|    - Phụ phí phát sinh (Giao xe tận khách sạn):                           100.000 đ                      |
|    - Phí bồi thường trầy xước:                                            300.000 đ                      |
|    - Giảm giá khuyến mãi:                                                -100.000 đ                      |
|    => TỔNG CƯỚC DỊCH VỤ:                                                3.150.000 đ                      |
|    - Đã thanh toán trước:                                              -1.000.000 đ                      |
|    => CÒN CẦN THANH TOÁN:                                               2.150.000 đ                      |
|                                                                                                         |
| 2. QUẢN LÝ TIỀN CỌC (DEPOSIT):                                                                          |
|    - Tiền cọc đang giữ của khách:                                       5.000.000 đ                      |
|    [v] Khấu trừ tiền dịch vụ trực tiếp vào tiền cọc                                                      |
|    - Cọc khấu trừ dịch vụ:                                              2.150.000 đ                      |
|    => SỐ TIỀN HOÀN LẠI CHO KHÁCH (REFUND):                              2.850.000 đ                      |
|                                                                                                         |
| Hình thức hoàn trả: (•) Chuyển khoản VietQR    ( ) Tiền mặt                                             |
|                                                                 [ In hóa đơn thanh lý ]  [ HOÀN TẤT ]   |
+---------------------------------------------------------------------------------------------------------+
```

### 5.6. Mockup Giao diện Quản lý bảo trì & Nhắc thay nhớt (Maintenance View)
```
+---------------------------------------------------------------------------------------------------------+
| QUẢN LÝ LỊCH BẢO DƯỠNG & THAY DẦU NHỚT                                       [ + Lên lịch bảo trì ]     |
| Bộ lọc: [ Tất cả (8) ]  [ Sắp đến hạn (3) ]  [ Đang sửa chữa (1) ]  [ Quá hạn (1) ]  [ Hoàn thành (3) ] |
+---------------------------------------------------------------------------------------------------------+
| TIÊU ĐỀ BẢO DƯỠNG          | XE ÁP DỤNG       | HẠN ĐỊNH BẢO TRÌ   | TRẠNG THÁI     | CHI PHÍ  | THAO TÁC   |
|----------------------------+------------------+--------------------+----------------+----------+------------|
| Thay dầu nhớt máy & lọc    | 43-K2 918.42     | Quá 450 km (28.450)| [ ĐỎ: QUÁ HẠN ]| 150.000đ | [Bảo trì]  |
| Thay dầu động cơ 5.000 km  | 43A-629.41 (MPV) | 50.000 km (Còn 820)| [ VÀNG: SẮP TỚI]| 950.000đ | [Chi tiết] |
| Bảo dưỡng phanh & lốp      | 43A-582.19 (Vios)| 10/11/2026         | [ VÀNG: SẮP TỚI]| 1.200.000| [Chi tiết] |
| Kiểm tra bình & bugi       | 43-D1 882.19     | Đang thực hiện     | [ XANH: ĐANG SỬA]| 350.000đ | [Nghiệm thu]|
+---------------------------------------------------------------------------------------------------------+
```

---

## 6. MÔ HÌNH DỮ LIỆU CỐT LÕI (CORE DATA MODELS)

Mã nguồn được cấu trúc hóa chặt chẽ theo TypeScript tại [`src/types/index.ts`](file:///c:/Users/ASUS/source/repos/QuanLyDatXe_DriveRent/src/types/index.ts):

```typescript
// 1. Quản lý Phương tiện (Vehicle)
export interface Vehicle {
  id: string;                    // e.g. 'V-01'
  name: string;                  // 'Toyota Vios 1.5G'
  plateNumber: string;           // '43A-582.19'
  type: 'motorbike' | 'car';     // Xe máy hoặc Ô tô
  category: string;              // 'Sedan 5 chỗ', 'Xe ga 125cc'
  status: 'available' | 'rented' | 'maintenance';
  hourlyPrice: number;           // Đơn giá thuê theo giờ
  dailyPrice: number;            // Đơn giá thuê theo ngày
  currentOdometer: number;       // Số ODO hiện tại (km)
  fuelLevel: number;             // Vạch xăng (1-8/8)
  image: string;                 // Đường dẫn ảnh
  year: number;                  // Năm sản xuất
  transmission: string;          // Số tự động, Số sàn, Tay ga
  insuranceExpiry: string;       // Ngày hết hạn bảo hiểm
  registrationExpiry: string;    // Ngày hết hạn đăng kiểm
  lastMaintenanceKm: number;     // Km bảo dưỡng lần trước
  nextMaintenanceKm: number;     // Mốc Km cần bảo dưỡng tiếp theo
}

// 2. Quản lý Khách hàng & Hồ sơ Giấy tờ (Customer)
export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  identityNumber: string;        // Số CCCD
  driverLicense: string;         // Số GPLX
  address: string;
  rentalCount: number;           // Số lần thuê xe
  rating: number;                // Điểm uy tín (1-5 sao)
  idCardFrontImage?: string;     // Ảnh CCCD
  driverLicenseImage?: string;   // Ảnh GPLX
}

// 3. Quản lý Hợp đồng & Bàn giao (RentalContract)
export interface RentalContract {
  id: string;                    // 'HD-2026-001'
  vehicleId: string;
  customerId: string;
  pricingType: 'hourly' | 'daily';
  status: 'draft' | 'confirmed' | 'rented' | 'pending_settlement' | 'completed' | 'cancelled';
  startDate: string;             // ISO datetime
  endDate: string;               // ISO datetime
  rate: number;
  units: number;
  deposit: number;               // Tiền cọc cách ly (VND)
  surcharges: { id: string; reason: string; amount: number }[];
  handoverRecord?: {             // Biên bản giao xe
    actualTime: string;
    odometer: number;
    fuelLevel: number;
    accessories: string[];
    photos: string[];
  };
  returnRecord?: {               // Biên bản nhận lại xe
    actualTime: string;
    odometer: number;
    fuelLevel: number;
    checklist: { body: boolean; tires: boolean; lights: boolean; mirrors: boolean; fuel: boolean; accessories: boolean };
    damageFee: number;
    photos: string[];
  };
  finalSettlement?: {            // Quyết toán cuối cùng
    actualUnitsBilled: number;
    actualRentalFee: number;
    damageFee: number;
    totalServiceFee: number;
    depositHeld: number;
    depositDeducted: number;
    refundAmount: number;
    additionalDue: number;
  };
}

// 4. Quản lý Lịch bảo trì & Thay nhớt (MaintenanceTask)
export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  title: string;                 // 'Thay dầu nhớt & lọc'
  type: 'Bảo dưỡng định kỳ' | 'Sửa chữa hỏng hóc' | 'Thay dầu nhớt & lọc' | 'Thay lốp & má phanh';
  status: 'upcoming' | 'overdue' | 'in_progress' | 'completed';
  dueDate: string;
  dueKm: number;                 // Số km tới hạn
  cost: number;
  assignedTo: string;
  nextTargetKm?: number;
  nextTargetDate?: string;
}
```

---

## 7. CÔNG NGHỆ & CẤU TRÚC MÃ NGUỒN (TECH STACK & ARCHITECTURE)

### 7.1. Công nghệ sử dụng
* **Frontend Framework:** React 19, TypeScript
* **Build Tool:** Vite 8 (Hỗ trợ HMR siêu tốc)
* **Styling & UI:** Tailwind CSS v4, Lucide React (bộ icon đồng bộ, sắc nét)
* **Animation & Modal:** Motion (Framer Motion v12)
* **State Management:** React Context API (`AppContext.tsx`) mô phỏng hệ cơ sở dữ liệu quan hệ hoàn chỉnh có đầy đủ tính năng CRUD và logic kiểm tra nghiệp vụ tự động.

### 7.2. Cấu trúc thư mục dự án
```
QuanLyDatXe_DriveRent/
├── src/
│   ├── assets/images/           # Ảnh phương tiện mẫu (Vios, Xpander, Vision, AirBlade)
│   ├── components/
│   │   ├── common/              # ToastContainer, TrialBanner
│   │   ├── customer/            # BookingCheckoutModal, AdminLoginModal, Header/Footer khách
│   │   └── layout/              # Header, Sidebar thanh điều hướng nội bộ
│   ├── context/
│   │   └── AppContext.tsx       # Toàn bộ State toàn cục & Nghiệp vụ tính tiền, giao nhận
│   ├── data/
│   │   └── initialData.ts       # Dữ liệu hạt giống (Seed Data) chuẩn thực tế
│   ├── types/
│   │   └── index.ts             # Định nghĩa Type/Interface TypeScript
│   ├── utils/
│   │   └── formatters.ts        # Tiện ích format VND, tính thời gian làm tròn, kiểm tra ODO
│   └── views/
│       ├── customer/            # Phân hệ khách du lịch (Home, Vehicles, Guide, Lookup)
│       ├── DashboardView.tsx    # Bảng điều khiển kinh doanh tổng thể
│       ├── FleetView.tsx        # Sơ đồ trạng thái xe trực quan
│       ├── ScheduleView.tsx     # Lịch biểu điều phối phương tiện
│       ├── ContractsView.tsx    # Danh sách hợp đồng
│       ├── CreateContractWizard.tsx # Wizard tạo hợp đồng 4 bước
│       ├── HandoverReturnModal.tsx  # Modal bàn giao & nhận lại xe số hóa
│       ├── SettlementModal.tsx  # Modal thanh lý & quyết toán cọc
│       ├── MaintenanceView.tsx  # Quản lý bảo trì & nhắc thay nhớt
│       ├── CustomersView.tsx    # Quản lý danh bạ khách hàng
│       ├── FinanceReportView.tsx# Báo cáo doanh thu & dòng tiền
│       ├── PrintContractModal.tsx # Bản in hợp đồng chuẩn A4
│       └── SettingsView.tsx     # Cài đặt cửa hàng & tham số nghiệp vụ
├── package.json                 # Cấu hình phụ thuộc dự án
└── vite.config.ts               # Cấu hình Vite build
```

---

## 8. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

Để trải nghiệm giao diện và toàn bộ nghiệp vụ trên máy cục bộ:

```bash
# 1. Di chuyển vào thư mục dự án
cd QuanLyDatXe_DriveRent

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi động môi trường phát triển Vite
npm run dev
```

Hệ thống sẽ chạy tại địa chỉ: `http://localhost:3000` (hoặc port được Vite hiển thị).
* Người dùng có thể chuyển đổi linh hoạt giữa **Giao diện Khách thuê xe (Customer Portal)** và **Hệ thống Quản lý Nội bộ (Admin Dashboard)** bằng nút chuyển đổi trên thanh Header.

---

## 9. KẾ HOẠCH PHÁT TRIỂN TIẾP THEO (ROADMAP)

1. **Giai đoạn 1 (Hiện tại - Đã hoàn thành):** Hoàn thiện trọn vẹn UI/UX mô phỏng, logic tính tiền giờ/ngày, lưu ảnh CCCD/hiện trạng xe, sơ đồ trạng thái và nhắc thay nhớt.
2. **Giai đoạn 2 (Backend Integration):** Kết nối RESTful API với CSDL PostgreSQL / Supabase, tích hợp dịch vụ lưu trữ ảnh đám mây Cloudinary/S3 cho ảnh CCCD và hiện trạng xe.
3. **Giai đoạn 3 (Smart Hardware & GPS Integration):** Kết nối thiết bị định vị GPS hành trình lắp trên xe để tự động đồng bộ số ODO thực tế và vị trí hiện tại lên sơ đồ bãi xe.
4. **Giai đoạn 4 (Payment Gateway & eKYC):** Tích hợp cổng thanh toán trực tuyến tự động xác nhận chuyển khoản ngân hàng (SeAPay/VietQR Webhook) và OCR đọc thông tin từ ảnh chụp CCCD/GPLX.
