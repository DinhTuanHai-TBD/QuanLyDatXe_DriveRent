# HƯỚNG DẪN BACKEND DRIVERENT (.NET 8 CLEAN ARCHITECTURE)

Dự án Backend cho Hệ thống Quản lý Cho thuê Xe máy & Ô tô Tự lái (DriveRent) được xây dựng theo chuẩn **Clean Architecture (Onion Architecture)** kết hợp với **RESTful Web API** trên nền tảng **.NET 8 LTS**.

---

## 1. CẤU TRÚC KIẾN TRÚC SẠCH (CLEAN ARCHITECTURE)

```
DriveRent.sln
 │
 ├── 1. DriveRent.Domain (Lõi trung tâm - Core Domain)
 │    ├── Entities/               # Vehicle, Customer, RentalContract, MaintenanceTask, OnlineBooking, User
 │    └── Enums/                  # VehicleStatus, ContractStatus, PricingType, MaintenanceStatus, BookingStatus
 │
 ├── 2. DriveRent.Application (Tầng Nghiệp vụ - Use Cases)
 │    ├── DTOs/                   # Request / Response DTOs
 │    ├── Interfaces/             # IApplicationDbContext
 │    └── Services/               # VehicleService, ContractService, MaintenanceService, BookingService
 │
 ├── 3. DriveRent.Infrastructure (Tầng Hạ tầng & CSDL)
 │    └── Data/
 │         ├── ApplicationDbContext.cs  # Entity Framework Core DbContext
 │         └── DbInitializer.cs         # Khởi tạo hạt giống (Seed Data) chuẩn thực tế
 │
 └── 4. DriveRent.WebApi (Tầng Trình diễn & RESTful API)
      ├── Controllers/            # Vehicles, Contracts, Maintenance, Bookings, Dashboard
      └── Program.cs              # Dependency Injection, Swagger OpenAPI, CORS, HTTP Pipeline
```

---

## 2. HƯỚNG DẪN MỞ BẰNG VISUAL STUDIO (VS 2022)

1. Mở phần mềm **Visual Studio 2022**.
2. Chọn **Open a project or solution**.
3. Điều hướng tới thư mục:
   `c:\Users\ASUS\source\repos\QuanLyDatXe_DriveRent\backend\DriveRent.sln`
4. Đặt dự án **`DriveRent.WebApi`** làm **Startup Project** (chuột phải vào `DriveRent.WebApi` -> chọn *Set as Startup Project*).
5. Nhấn phím **F5** (Debug) hoặc **Ctrl + F5** (Run without debugging).
6. Trình duyệt sẽ tự động mở giao diện tài liệu tương tác **Swagger UI** tại:
   `http://localhost:5075/swagger`

---

## 3. DANH SÁCH RESTFUL WEB API ENDPOINTS

### 3.1. Quản lý đội xe (`/api/vehicles`)
* `GET /api/vehicles`: Lấy danh sách toàn bộ xe (hỗ trợ lọc theo `type`, `status`).
* `GET /api/vehicles/{id}`: Xem chi tiết xe.
* `POST /api/vehicles`: Thêm xe mới vào đội xe.
* `POST /api/vehicles/{id}/check-availability`: Kiểm tra xe có bị trùng lịch thuê trong khoảng ngày giờ nhận/trả hay không.
* `PATCH /api/vehicles/{id}/status`: Cập nhật trạng thái xe (`Available`, `Rented`, `Maintenance`).

### 3.2. Quản lý hợp đồng & Bàn giao (`/api/contracts`)
* `GET /api/contracts`: Lấy danh sách hợp đồng thuê xe.
* `GET /api/contracts/{id}`: Xem chi tiết hợp đồng, biên bản giao nhận và quyết toán.
* `POST /api/contracts`: Lập hợp đồng mới (tự động tính thời gian theo giờ/ngày, cách ly tiền cọc).
* `POST /api/contracts/{id}/handover`: Bàn giao xe (ghi nhận ODO xuất phát, vạch xăng, phụ kiện, ảnh bàn giao).
* `POST /api/contracts/{id}/return`: Thu hồi nhận lại xe (kiểm tra checklist 6 hạng mục, ghi nhận trầy xước & phí phạt).
* `POST /api/contracts/{id}/settle`: Quyết toán thanh lý (tự động tính giờ thực tế, khấu trừ cọc, tính số tiền hoàn cọc).

### 3.3. Bảo dưỡng & Thay dầu nhớt (`/api/maintenance`)
* `GET /api/maintenance`: Lấy danh sách nhiệm vụ bảo dưỡng (hỗ trợ lọc theo `status`).
* `POST /api/maintenance`: Lập lịch bảo dưỡng mới (theo km hoặc ngày).
* `PUT /api/maintenance/{id}/start`: Bắt đầu bảo dưỡng (tự động chuyển xe sang trạng thái `Maintenance`).
* `PUT /api/maintenance/{id}/complete`: Nghiệm thu bảo dưỡng (nhập chi phí, tự động sinh mốc km tiếp theo và đưa xe về `Available`).

### 3.4. Đặt xe trực tuyến du khách (`/api/bookings`)
* `POST /api/bookings`: Khách đặt giữ chỗ trực tuyến (tự động khóa giữ xe 10 phút).
* `GET /api/bookings/lookup?phone={sđt}`: Tra cứu lịch sử và tình trạng đơn đặt xe của du khách.
* `PUT /api/bookings/{id}/confirm-payment`: Xác nhận đã thanh toán cọc giữ chỗ 20%.

### 3.5. Bảng điều khiển kinh doanh (`/api/dashboard`)
* `GET /api/dashboard/summary`: Thống kê tổng hợp: Số xe sẵn sàng, đang thuê, đang bảo dưỡng, tiền cọc đang giữ, doanh thu.
