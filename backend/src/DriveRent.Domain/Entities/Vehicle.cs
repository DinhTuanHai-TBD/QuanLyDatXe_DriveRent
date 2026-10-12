using DriveRent.Domain.Enums;

namespace DriveRent.Domain.Entities;

public class Vehicle
{
    public string Id { get; set; } = string.Empty; // e.g. "V-01"
    public string Name { get; set; } = string.Empty;
    public string PlateNumber { get; set; } = string.Empty;
    public VehicleType Type { get; set; }
    public string Category { get; set; } = string.Empty;
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
    public decimal HourlyPrice { get; set; }
    public decimal DailyPrice { get; set; }
    public int CurrentOdometer { get; set; }
    public int FuelLevel { get; set; } = 8; // out of 8 (e.g. 8/8)
    public string Image { get; set; } = string.Empty;
    public int Year { get; set; } = 2023;
    public string Color { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public string Features { get; set; } = string.Empty; // Comma or JSON
    public DateTime? InsuranceExpiry { get; set; }
    public DateTime? RegistrationExpiry { get; set; }
    public DateTime? LastMaintenanceDate { get; set; }
    public int LastMaintenanceKm { get; set; }
    public DateTime? NextMaintenanceDate { get; set; }
    public int NextMaintenanceKm { get; set; }
    public string? Notes { get; set; }
}
