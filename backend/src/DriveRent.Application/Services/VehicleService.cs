using DriveRent.Application.DTOs;
using DriveRent.Application.Interfaces;
using DriveRent.Domain.Entities;
using DriveRent.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace DriveRent.Application.Services;

public interface IVehicleService
{
    Task<List<Vehicle>> GetAllAsync(VehicleType? type = null, VehicleStatus? status = null);
    Task<Vehicle?> GetByIdAsync(string id);
    Task<Vehicle> CreateAsync(CreateVehicleRequest request);
    Task<AvailabilityResponse> CheckAvailabilityAsync(string vehicleId, DateTime startDate, DateTime endDate);
    Task<bool> UpdateStatusAsync(string id, VehicleStatus status);
}

public class VehicleService : IVehicleService
{
    private readonly IApplicationDbContext _context;

    public VehicleService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Vehicle>> GetAllAsync(VehicleType? type = null, VehicleStatus? status = null)
    {
        var query = _context.Vehicles.AsQueryable();

        if (type.HasValue)
            query = query.Where(v => v.Type == type.Value);

        if (status.HasValue)
            query = query.Where(v => v.Status == status.Value);

        return await query.ToListAsync();
    }

    public async Task<Vehicle?> GetByIdAsync(string id)
    {
        return await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<Vehicle> CreateAsync(CreateVehicleRequest request)
    {
        var id = string.IsNullOrWhiteSpace(request.Id) 
            ? $"V-{DateTime.UtcNow.Ticks % 10000:D4}" 
            : request.Id;

        var vehicle = new Vehicle
        {
            Id = id,
            Name = request.Name,
            PlateNumber = request.PlateNumber,
            Type = request.Type,
            Category = request.Category,
            Status = VehicleStatus.Available,
            HourlyPrice = request.HourlyPrice,
            DailyPrice = request.DailyPrice,
            CurrentOdometer = request.CurrentOdometer,
            FuelLevel = request.FuelLevel,
            Image = request.Image,
            Year = request.Year,
            Color = request.Color,
            Transmission = request.Transmission,
            Features = request.Features
        };

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync();
        return vehicle;
    }

    public async Task<AvailabilityResponse> CheckAvailabilityAsync(string vehicleId, DateTime startDate, DateTime endDate)
    {
        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == vehicleId);
        if (vehicle == null)
        {
            return new AvailabilityResponse { Available = false, ConflictReason = "Phương tiện không tồn tại" };
        }

        if (vehicle.Status == VehicleStatus.Maintenance)
        {
            return new AvailabilityResponse { Available = false, ConflictReason = "Xe hiện đang trong xưởng bảo dưỡng" };
        }

        // Buffer: 2 hours between rentals for cleaning and inspection
        var buffer = TimeSpan.FromHours(2);
        var searchStartWithBuffer = startDate.Subtract(buffer);
        var searchEndWithBuffer = endDate.Add(buffer);

        // Check overlapping active contracts
        var conflict = await _context.RentalContracts
            .Where(c => c.VehicleId == vehicleId && 
                       (c.Status == ContractStatus.Confirmed || c.Status == ContractStatus.Rented || c.Status == ContractStatus.PendingSettlement))
            .Where(c => c.StartDate < searchEndWithBuffer && c.EndDate > searchStartWithBuffer)
            .FirstOrDefaultAsync();

        if (conflict != null)
        {
            return new AvailabilityResponse
            {
                Available = false,
                ConflictReason = $"Xe đã có hợp đồng thuê ({conflict.Id}) từ {conflict.StartDate:dd/MM HH:mm} đến {conflict.EndDate:dd/MM HH:mm}"
            };
        }

        return new AvailabilityResponse { Available = true };
    }

    public async Task<bool> UpdateStatusAsync(string id, VehicleStatus status)
    {
        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == id);
        if (vehicle == null) return false;

        vehicle.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }
}
