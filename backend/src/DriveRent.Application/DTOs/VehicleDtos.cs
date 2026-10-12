using DriveRent.Domain.Enums;

namespace DriveRent.Application.DTOs;

public class VehicleDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string PlateNumber { get; set; } = string.Empty;
    public VehicleType Type { get; set; }
    public string Category { get; set; } = string.Empty;
    public VehicleStatus Status { get; set; }
    public decimal HourlyPrice { get; set; }
    public decimal DailyPrice { get; set; }
    public int CurrentOdometer { get; set; }
    public int FuelLevel { get; set; }
    public string Image { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Color { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public string Features { get; set; } = string.Empty;
    public DateTime? InsuranceExpiry { get; set; }
    public DateTime? RegistrationExpiry { get; set; }
    public DateTime? LastMaintenanceDate { get; set; }
    public int LastMaintenanceKm { get; set; }
    public DateTime? NextMaintenanceDate { get; set; }
    public int NextMaintenanceKm { get; set; }
    public string? Notes { get; set; }
}

public class CreateVehicleRequest
{
    public string? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PlateNumber { get; set; } = string.Empty;
    public VehicleType Type { get; set; }
    public string Category { get; set; } = string.Empty;
    public decimal HourlyPrice { get; set; }
    public decimal DailyPrice { get; set; }
    public int CurrentOdometer { get; set; }
    public int FuelLevel { get; set; } = 8;
    public string Image { get; set; } = string.Empty;
    public int Year { get; set; } = 2023;
    public string Color { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public string Features { get; set; } = string.Empty;
}

public class CheckAvailabilityRequest
{
    public string VehicleId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class AvailabilityResponse
{
    public bool Available { get; set; }
    public string? ConflictReason { get; set; }
}
