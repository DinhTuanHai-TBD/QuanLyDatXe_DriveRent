using DriveRent.Domain.Enums;

namespace DriveRent.Application.DTOs;

public class CreateMaintenanceRequest
{
    public string VehicleId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = "Bảo dưỡng định kỳ";
    public DateTime DueDate { get; set; }
    public int DueKm { get; set; }
    public decimal EstimatedCost { get; set; }
    public string AssignedTo { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class CompleteMaintenanceRequest
{
    public string ResultNotes { get; set; } = string.Empty;
    public decimal ActualCost { get; set; }
    public int NextTargetKm { get; set; }
    public DateTime NextTargetDate { get; set; }
}

public class CreateBookingRequest
{
    public string VehicleId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public string PickupLocation { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public PricingType PricingType { get; set; } = PricingType.Daily;
    public decimal DeliveryFee { get; set; }
    public string? Notes { get; set; }
}

public class DashboardSummaryDto
{
    public int TotalVehicles { get; set; }
    public int AvailableVehicles { get; set; }
    public int RentedVehicles { get; set; }
    public int MaintenanceVehicles { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal DepositsHeld { get; set; }
    public int UrgentMaintenanceCount { get; set; }
    public int TodayPickupsCount { get; set; }
    public int TodayReturnsCount { get; set; }
}
