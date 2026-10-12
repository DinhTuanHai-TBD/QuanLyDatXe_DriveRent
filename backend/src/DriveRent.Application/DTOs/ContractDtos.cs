using DriveRent.Domain.Enums;
using DriveRent.Domain.Entities;

namespace DriveRent.Application.DTOs;

public class CreateContractRequest
{
    public string VehicleId { get; set; } = string.Empty;
    public string? CustomerId { get; set; }
    // Or new customer info
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    public string? IdentityNumber { get; set; }
    public string? DriverLicense { get; set; }
    public string? CustomerAddress { get; set; }

    public PricingType PricingType { get; set; } = PricingType.Daily;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Deposit { get; set; }
    public decimal Discount { get; set; }
    public decimal InitialAmountPaid { get; set; }
    public string? Note { get; set; }
}

public class HandoverRequest
{
    public DateTime ActualTime { get; set; } = DateTime.UtcNow;
    public int Odometer { get; set; }
    public int FuelLevel { get; set; }
    public string Accessories { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string Photos { get; set; } = string.Empty;
    public string PerformedBy { get; set; } = "Nhân viên";
}

public class ReturnRequest
{
    public DateTime ActualTime { get; set; } = DateTime.UtcNow;
    public int Odometer { get; set; }
    public int FuelLevel { get; set; }
    public ReturnInspectionChecklist Checklist { get; set; } = new();
    public string DamageNotes { get; set; } = string.Empty;
    public decimal DamageFee { get; set; }
    public string Photos { get; set; } = string.Empty;
    public VehicleStatus PostStatus { get; set; } = VehicleStatus.Available;
    public string PerformedBy { get; set; } = "Nhân viên";
}

public class SettlementRequest
{
    public bool DeductFromDeposit { get; set; } = true;
    public string PaymentMethod { get; set; } = "Tiền mặt";
    public string SettledBy { get; set; } = "Nhân viên";
}
