using DriveRent.Domain.Enums;

namespace DriveRent.Domain.Entities;

public class MaintenanceTask
{
    public string Id { get; set; } = string.Empty; // e.g. "MT-01"
    public string VehicleId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = "Bảo dưỡng định kỳ";
    public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Upcoming;
    public DateTime DueDate { get; set; }
    public int DueKm { get; set; }
    public decimal Cost { get; set; }
    public string AssignedTo { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string? Result { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int? NextTargetKm { get; set; }
    public DateTime? NextTargetDate { get; set; }

    public Vehicle? Vehicle { get; set; }
}

public class OnlineBooking
{
    public string Id { get; set; } = string.Empty; // e.g. "BK-2026-8812"
    public string VehicleId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public string PickupLocation { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public PricingType PricingType { get; set; } = PricingType.Daily;
    public decimal Units { get; set; }
    public decimal Rate { get; set; }
    public decimal RentalFee { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal TotalEstimatedAmount { get; set; }
    public decimal BookingDepositRequired { get; set; }
    public decimal BookingDepositPaid { get; set; }
    public decimal RemainingAmountDue { get; set; }
    public decimal SecurityDepositOnPickup { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.PendingPayment;
    public string? PaymentMethod { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } // 10 minutes lock
    public DateTime? VerifiedAt { get; set; }
    public string? ContractId { get; set; }
}

public class User
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Staff;
    public string RoleTitle { get; set; } = "Nhân viên";
    public string Phone { get; set; } = string.Empty;
}

public class StoreSettings
{
    public string StoreName { get; set; } = "DriveRent Đà Nẵng - Cho thuê Xe Tự Lái";
    public string BrandTitle { get; set; } = "DriveRent";
    public string Address { get; set; } = "Số 182 Đường Võ Nguyên Giáp, Sơn Trà, TP. Đà Nẵng";
    public string Hotline { get; set; } = "0905 888 999";
    public string Email { get; set; } = "hotro@driverent.vn";
    public string City { get; set; } = "Đà Nẵng";
    public string BankName { get; set; } = "Ngân hàng TMCP Quân Đội (MB Bank)";
    public string BankAccount { get; set; } = "0905888999888";
    public string BankAccountName { get; set; } = "NGUYEN VAN MINH - DRIVERENT";
    public int BufferHours { get; set; } = 2;
    public decimal HourlyOverdueRateCar { get; set; } = 100000;
    public decimal HourlyOverdueRateBike { get; set; } = 30000;
    public int MaintenanceKmThreshold { get; set; } = 3000;
    public int MaintenanceDaysThreshold { get; set; } = 90;
}
