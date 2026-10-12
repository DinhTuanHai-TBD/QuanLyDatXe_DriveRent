using DriveRent.Domain.Enums;

namespace DriveRent.Domain.Entities;

public class SurchargeItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Reason { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}

public class HandoverRecord
{
    public DateTime ActualTime { get; set; }
    public int Odometer { get; set; }
    public int FuelLevel { get; set; }
    public string Accessories { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string Photos { get; set; } = string.Empty;
    public string PerformedBy { get; set; } = string.Empty;
}

public class ReturnInspectionChecklist
{
    public bool Body { get; set; } = true;
    public bool Tires { get; set; } = true;
    public bool Lights { get; set; } = true;
    public bool Mirrors { get; set; } = true;
    public bool Fuel { get; set; } = true;
    public bool Accessories { get; set; } = true;
}

public class ReturnRecord
{
    public DateTime ActualTime { get; set; }
    public int Odometer { get; set; }
    public int FuelLevel { get; set; }
    public ReturnInspectionChecklist Checklist { get; set; } = new();
    public string DamageNotes { get; set; } = string.Empty;
    public decimal DamageFee { get; set; }
    public string Photos { get; set; } = string.Empty;
    public VehicleStatus PostStatus { get; set; } = VehicleStatus.Available;
    public string PerformedBy { get; set; } = string.Empty;
}

public class FinalSettlement
{
    public decimal ActualUnitsBilled { get; set; }
    public PricingType PricingType { get; set; }
    public decimal UnitRate { get; set; }
    public decimal ActualRentalFee { get; set; }
    public decimal SurchargesTotal { get; set; }
    public decimal DamageFee { get; set; }
    public decimal Discount { get; set; }
    public decimal TotalServiceFee { get; set; }
    public decimal AmountPaid { get; set; }
    public decimal DepositHeld { get; set; }
    public decimal DepositDeducted { get; set; }
    public decimal AdditionalDue { get; set; }
    public decimal RefundAmount { get; set; }
    public DateTime SettledAt { get; set; }
    public string SettledBy { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = "Tiền mặt";
}
