using DriveRent.Domain.Entities;
using DriveRent.Domain.Enums;

namespace DriveRent.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (context.Vehicles.Any())
            return; // Already seeded

        // 1. Seed Vehicles
        var vehicles = new List<Vehicle>
        {
            new Vehicle
            {
                Id = "V-01",
                Name = "Toyota Vios 1.5G",
                PlateNumber = "43A-582.19",
                Type = VehicleType.Car,
                Category = "Sedan 5 chỗ",
                Status = VehicleStatus.Available,
                HourlyPrice = 90000,
                DailyPrice = 750000,
                CurrentOdometer = 32450,
                FuelLevel = 8,
                Image = "/src/assets/images/car_toyota_vios_1791537588925.jpg",
                Year = 2023,
                Color = "Trắng ngọc trai",
                Transmission = "Tự động (CVT)",
                Features = "Màn hình Android, Camera hành trình, Cảm biến lùi, Apple CarPlay, Điều hòa tự động",
                InsuranceExpiry = new DateTime(2027, 4, 15),
                RegistrationExpiry = new DateTime(2027, 8, 20),
                LastMaintenanceDate = new DateTime(2026, 8, 10),
                LastMaintenanceKm = 30000,
                NextMaintenanceDate = new DateTime(2026, 11, 10),
                NextMaintenanceKm = 35000,
                Notes = "Xe chạy êm ái, bảo dưỡng định kỳ đầy đủ"
            },
            new Vehicle
            {
                Id = "V-02",
                Name = "Mitsubishi Xpander",
                PlateNumber = "43A-629.41",
                Type = VehicleType.Car,
                Category = "MPV 7 chỗ",
                Status = VehicleStatus.Rented,
                HourlyPrice = 120000,
                DailyPrice = 950000,
                CurrentOdometer = 48920,
                FuelLevel = 7,
                Image = "/src/assets/images/car_mitsubishi_xpander_1791537608474.jpg",
                Year = 2023,
                Color = "Bạc ánh kim",
                Transmission = "Tự động",
                Features = "7 chỗ rộng rãi, Cốp để hành lý lớn, Camera 360, Cruise Control, Cửa gió trần",
                InsuranceExpiry = new DateTime(2027, 2, 18),
                RegistrationExpiry = new DateTime(2027, 6, 12),
                LastMaintenanceDate = new DateTime(2026, 7, 22),
                LastMaintenanceKm = 45000,
                NextMaintenanceDate = new DateTime(2026, 10, 22),
                NextMaintenanceKm = 50000,
                Notes = "Gia đình du lịch chuộng thuê nhất"
            },
            new Vehicle
            {
                Id = "V-03",
                Name = "Honda Vision Smartkey",
                PlateNumber = "43-D1 882.19",
                Type = VehicleType.Motorbike,
                Category = "Xe ga 110cc",
                Status = VehicleStatus.Available,
                HourlyPrice = 20000,
                DailyPrice = 130000,
                CurrentOdometer = 14200,
                FuelLevel = 7,
                Image = "/src/assets/images/scooter_honda_vision_1791537620987.jpg",
                Year = 2023,
                Color = "Xanh đen",
                Transmission = "Tay ga",
                Features = "Khóa thông minh Smartkey, Cốp đựng đồ rộng, Cổng sạc USB, Tiết kiệm xăng",
                InsuranceExpiry = new DateTime(2027, 5, 20),
                RegistrationExpiry = new DateTime(2027, 5, 20),
                LastMaintenanceDate = new DateTime(2026, 9, 1),
                LastMaintenanceKm = 12000,
                NextMaintenanceDate = new DateTime(2026, 12, 1),
                NextMaintenanceKm = 15000,
                Notes = "Khách nữ rất thích thuê dạo biển"
            },
            new Vehicle
            {
                Id = "V-04",
                Name = "Honda Air Blade 125",
                PlateNumber = "43-K2 918.42",
                Type = VehicleType.Motorbike,
                Category = "Xe ga 125cc",
                Status = VehicleStatus.Maintenance,
                HourlyPrice = 25000,
                DailyPrice = 150000,
                CurrentOdometer = 28450,
                FuelLevel = 6,
                Image = "/src/assets/images/scooter_honda_airblade_1791537634617.jpg",
                Year = 2022,
                Color = "Đỏ đen thể thao",
                Transmission = "Tay ga",
                Features = "Động cơ eSP+ 125cc khỏe khoắn, Phanh CBS an toàn, Đèn pha LED đôi",
                InsuranceExpiry = new DateTime(2027, 1, 10),
                RegistrationExpiry = new DateTime(2027, 1, 10),
                LastMaintenanceDate = new DateTime(2026, 6, 15),
                LastMaintenanceKm = 25000,
                NextMaintenanceDate = new DateTime(2026, 9, 15),
                NextMaintenanceKm = 28000,
                Notes = "Đang thay nhớt và kiểm tra má phanh"
            }
        };
        context.Vehicles.AddRange(vehicles);

        // 2. Seed Customers
        var customers = new List<Customer>
        {
            new Customer
            {
                Id = "CUST-01",
                FullName = "Nguyễn Hoàng Long",
                Phone = "0988 123 456",
                IdentityNumber = "048095001234",
                DriverLicense = "790123456789",
                Address = "Số 45 Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng",
                RentalCount = 3,
                Rating = 5,
                Notes = "Khách quen đi công tác thường xuyên, giữ xe rất sạch sẽ"
            },
            new Customer
            {
                Id = "CUST-02",
                FullName = "Trần Văn Nam",
                Phone = "0912 345 678",
                IdentityNumber = "001092008899",
                DriverLicense = "010998877665",
                Address = "Khách sạn Sơn Trà, TP. Đà Nẵng",
                RentalCount = 1,
                Rating = 5,
                Notes = "Du khách từ Hà Nội đi cùng gia đình"
            }
        };
        context.Customers.AddRange(customers);

        // 3. Seed Maintenance Tasks
        var maintenanceTasks = new List<MaintenanceTask>
        {
            new MaintenanceTask
            {
                Id = "MT-01",
                VehicleId = "V-04",
                Title = "Thay dầu nhớt máy & lọc dầu",
                Type = "Thay dầu nhớt & lọc",
                Status = MaintenanceStatus.InProgress,
                DueDate = DateTime.UtcNow.AddDays(-2),
                DueKm = 28000,
                Cost = 150000,
                AssignedTo = "Lê Hoàng Dũng",
                Notes = "Đã quá hạn 450 km cần thay nhớt ngay để tránh xước xi-lanh"
            },
            new MaintenanceTask
            {
                Id = "MT-02",
                VehicleId = "V-02",
                Title = "Bảo dưỡng động cơ mốc 50.000 km",
                Type = "Bảo dưỡng định kỳ",
                Status = MaintenanceStatus.Upcoming,
                DueDate = DateTime.UtcNow.AddDays(10),
                DueKm = 50000,
                Cost = 950000,
                AssignedTo = "Lê Hoàng Dũng",
                Notes = "Còn 1.080 km đến mốc kiểm tra bugi và nước làm mát"
            }
        };
        context.MaintenanceTasks.AddRange(maintenanceTasks);

        // 4. Seed Users
        var users = new List<User>
        {
            new User
            {
                Id = "user-1",
                Username = "admin",
                Name = "Nguyễn Văn Minh",
                Role = UserRole.Admin,
                RoleTitle = "Chủ cửa hàng / Quản lý",
                Phone = "0905 123 456"
            },
            new User
            {
                Id = "user-2",
                Username = "sales",
                Name = "Trần Thị Thu Thảo",
                Role = UserRole.Staff,
                RoleTitle = "Nhân viên cho thuê",
                Phone = "0905 789 123"
            }
        };
        context.Users.AddRange(users);

        await context.SaveChangesAsync();
    }
}
