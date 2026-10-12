using DriveRent.Domain.Enums;

namespace DriveRent.Domain.Entities;

public class RentalContract
{
    public string Id { get; set; } = string.Empty; // e.g. "HD-2026-001"
    public string VehicleId { get; set; } = string.Empty;
    public string CustomerId { get; set; } = string.Empty;
    public PricingType PricingType { get; set; } = PricingType.Daily;
    public ContractStatus Status { get; set; } = ContractStatus.Confirmed;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Rate { get; set; }
    public decimal Units { get; set; }
    public decimal BaseRentalFee { get; set; }
    public decimal Deposit { get; set; } // Tiền cọc - strictly isolated
    public decimal Discount { get; set; }
    public decimal SurchargesTotal { get; set; }
    public decimal TotalServiceFee { get; set; }
    public decimal AmountPaid { get; set; }
    public string? Note { get; set; }

    public HandoverRecord? HandoverRecord { get; set; }
    public ReturnRecord? ReturnRecord { get; set; }
    public FinalSettlement? FinalSettlement { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = "Hệ thống";

    // Navigation properties (optional for EF)
    public Vehicle? Vehicle { get; set; }
    public Customer? Customer { get; set; }
}
