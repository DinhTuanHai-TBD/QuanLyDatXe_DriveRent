using DriveRent.Application.DTOs;
using DriveRent.Application.Interfaces;
using DriveRent.Application.Services;
using DriveRent.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DriveRent.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaintenanceController : ControllerBase
{
    private readonly IMaintenanceService _maintenanceService;

    public MaintenanceController(IMaintenanceService maintenanceService)
    {
        _maintenanceService = maintenanceService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] MaintenanceStatus? status)
    {
        var tasks = await _maintenanceService.GetAllAsync(status);
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMaintenanceRequest request)
    {
        var task = await _maintenanceService.CreateAsync(request);
        return Ok(task);
    }

    [HttpPut("{id}/start")]
    public async Task<IActionResult> Start(string id)
    {
        var task = await _maintenanceService.StartAsync(id);
        return Ok(task);
    }

    [HttpPut("{id}/complete")]
    public async Task<IActionResult> Complete(string id, [FromBody] CompleteMaintenanceRequest request)
    {
        var task = await _maintenanceService.CompleteAsync(id, request);
        return Ok(task);
    }
}

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] BookingStatus? status)
    {
        var bookings = await _bookingService.GetAllAsync(status);
        return Ok(bookings);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest request)
    {
        var booking = await _bookingService.CreateAsync(request);
        return Ok(booking);
    }

    [HttpGet("lookup")]
    public async Task<IActionResult> Lookup([FromQuery] string phone)
    {
        if (string.IsNullOrWhiteSpace(phone)) return BadRequest(new { message = "Vui lòng nhập số điện thoại" });
        var bookings = await _bookingService.LookupByPhoneAsync(phone);
        return Ok(bookings);
    }

    [HttpPut("{id}/confirm-payment")]
    public async Task<IActionResult> ConfirmPayment(string id)
    {
        var booking = await _bookingService.ConfirmPaymentAsync(id);
        return Ok(booking);
    }
}

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public DashboardController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var totalVehicles = await _context.Vehicles.CountAsync();
        var availableVehicles = await _context.Vehicles.CountAsync(v => v.Status == VehicleStatus.Available);
        var rentedVehicles = await _context.Vehicles.CountAsync(v => v.Status == VehicleStatus.Rented);
        var maintenanceVehicles = await _context.Vehicles.CountAsync(v => v.Status == VehicleStatus.Maintenance);

        var activeContracts = await _context.RentalContracts
            .Where(c => c.Status != ContractStatus.Cancelled)
            .ToListAsync();

        var totalRevenue = activeContracts.Sum(c => c.FinalSettlement != null ? c.FinalSettlement.TotalServiceFee : c.TotalServiceFee);
        var depositsHeld = activeContracts
            .Where(c => c.Status == ContractStatus.Confirmed || c.Status == ContractStatus.Rented || c.Status == ContractStatus.PendingSettlement)
            .Sum(c => c.Deposit);

        var urgentMaintenanceCount = await _context.MaintenanceTasks
            .CountAsync(m => m.Status == MaintenanceStatus.Overdue || m.Status == MaintenanceStatus.InProgress);

        var summary = new DashboardSummaryDto
        {
            TotalVehicles = totalVehicles,
            AvailableVehicles = availableVehicles,
            RentedVehicles = rentedVehicles,
            MaintenanceVehicles = maintenanceVehicles,
            TotalRevenue = totalRevenue,
            DepositsHeld = depositsHeld,
            UrgentMaintenanceCount = urgentMaintenanceCount,
            TodayPickupsCount = 2,
            TodayReturnsCount = 1
        };

        return Ok(summary);
    }
}
