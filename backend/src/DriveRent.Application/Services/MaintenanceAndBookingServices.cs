using DriveRent.Application.DTOs;
using DriveRent.Application.Interfaces;
using DriveRent.Domain.Entities;
using DriveRent.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace DriveRent.Application.Services;

public interface IMaintenanceService
{
    Task<List<MaintenanceTask>> GetAllAsync(MaintenanceStatus? status = null);
    Task<MaintenanceTask> CreateAsync(CreateMaintenanceRequest request);
    Task<MaintenanceTask> StartAsync(string id);
    Task<MaintenanceTask> CompleteAsync(string id, CompleteMaintenanceRequest request);
}

public class MaintenanceService : IMaintenanceService
{
    private readonly IApplicationDbContext _context;

    public MaintenanceService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<MaintenanceTask>> GetAllAsync(MaintenanceStatus? status = null)
    {
        var query = _context.MaintenanceTasks.AsQueryable();
        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        return await query.OrderByDescending(t => t.DueDate).ToListAsync();
    }

    public async Task<MaintenanceTask> CreateAsync(CreateMaintenanceRequest request)
    {
        var task = new MaintenanceTask
        {
            Id = $"MT-{DateTime.UtcNow.Ticks % 10000:D4}",
            VehicleId = request.VehicleId,
            Title = request.Title,
            Type = request.Type,
            Status = MaintenanceStatus.Upcoming,
            DueDate = request.DueDate,
            DueKm = request.DueKm,
            Cost = request.EstimatedCost,
            AssignedTo = request.AssignedTo,
            Notes = request.Notes
        };

        _context.MaintenanceTasks.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<MaintenanceTask> StartAsync(string id)
    {
        var task = await _context.MaintenanceTasks.FirstOrDefaultAsync(t => t.Id == id)
            ?? throw new ArgumentException("Nhiệm vụ không tồn tại");

        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == task.VehicleId);
        if (vehicle != null)
        {
            vehicle.Status = VehicleStatus.Maintenance;
        }

        task.Status = MaintenanceStatus.InProgress;
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<MaintenanceTask> CompleteAsync(string id, CompleteMaintenanceRequest request)
    {
        var task = await _context.MaintenanceTasks.FirstOrDefaultAsync(t => t.Id == id)
            ?? throw new ArgumentException("Nhiệm vụ không tồn tại");

        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == task.VehicleId);

        task.Status = MaintenanceStatus.Completed;
        task.Cost = request.ActualCost;
        task.Result = request.ResultNotes;
        task.CompletedAt = DateTime.UtcNow;
        task.NextTargetKm = request.NextTargetKm;
        task.NextTargetDate = request.NextTargetDate;

        if (vehicle != null)
        {
            vehicle.Status = VehicleStatus.Available;
            vehicle.LastMaintenanceDate = DateTime.UtcNow;
            vehicle.LastMaintenanceKm = vehicle.CurrentOdometer;
            vehicle.NextMaintenanceDate = request.NextTargetDate;
            vehicle.NextMaintenanceKm = request.NextTargetKm;
        }

        await _context.SaveChangesAsync();
        return task;
    }
}

public interface IBookingService
{
    Task<List<OnlineBooking>> GetAllAsync(BookingStatus? status = null);
    Task<OnlineBooking> CreateAsync(CreateBookingRequest request);
    Task<List<OnlineBooking>> LookupByPhoneAsync(string phone);
    Task<OnlineBooking> ConfirmPaymentAsync(string bookingId);
}

public class BookingService : IBookingService
{
    private readonly IApplicationDbContext _context;

    public BookingService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<OnlineBooking>> GetAllAsync(BookingStatus? status = null)
    {
        var query = _context.OnlineBookings.AsQueryable();
        if (status.HasValue)
            query = query.Where(b => b.Status == status.Value);

        return await query.OrderByDescending(b => b.CreatedAt).ToListAsync();
    }

    public async Task<OnlineBooking> CreateAsync(CreateBookingRequest request)
    {
        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == request.VehicleId)
            ?? throw new ArgumentException("Xe không tồn tại");

        var duration = request.EndDate - request.StartDate;
        decimal units;
        decimal rate;
        if (request.PricingType == PricingType.Hourly)
        {
            units = Math.Max(1, Math.Ceiling((decimal)duration.TotalHours));
            rate = vehicle.HourlyPrice;
        }
        else
        {
            units = Math.Max(1, Math.Ceiling((decimal)duration.TotalHours / 24m));
            rate = vehicle.DailyPrice;
        }

        var rentalFee = units * rate;
        var totalAmount = rentalFee + request.DeliveryFee;
        var depositReq = Math.Round(totalAmount * 0.20m); // 20% online deposit
        var securityDeposit = vehicle.Type == VehicleType.Car ? 5000000m : 1000000m;

        var booking = new OnlineBooking
        {
            Id = $"BK-{DateTime.UtcNow:yyyy}-{DateTime.UtcNow.Ticks % 10000:D4}",
            VehicleId = request.VehicleId,
            CustomerName = request.CustomerName,
            CustomerPhone = request.CustomerPhone,
            CustomerEmail = request.CustomerEmail,
            PickupLocation = request.PickupLocation,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            PricingType = request.PricingType,
            Units = units,
            Rate = rate,
            RentalFee = rentalFee,
            DeliveryFee = request.DeliveryFee,
            TotalEstimatedAmount = totalAmount,
            BookingDepositRequired = depositReq,
            BookingDepositPaid = 0,
            RemainingAmountDue = totalAmount - depositReq,
            SecurityDepositOnPickup = securityDeposit,
            Status = BookingStatus.PendingPayment,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10), // 10 minutes hold
            Notes = request.Notes
        };

        _context.OnlineBookings.Add(booking);
        await _context.SaveChangesAsync();
        return booking;
    }

    public async Task<List<OnlineBooking>> LookupByPhoneAsync(string phone)
    {
        return await _context.OnlineBookings
            .Where(b => b.CustomerPhone.Contains(phone))
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<OnlineBooking> ConfirmPaymentAsync(string bookingId)
    {
        var booking = await _context.OnlineBookings.FirstOrDefaultAsync(b => b.Id == bookingId)
            ?? throw new ArgumentException("Đơn đặt xe không tồn tại");

        booking.Status = BookingStatus.Confirmed;
        booking.BookingDepositPaid = booking.BookingDepositRequired;
        booking.VerifiedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return booking;
    }
}
