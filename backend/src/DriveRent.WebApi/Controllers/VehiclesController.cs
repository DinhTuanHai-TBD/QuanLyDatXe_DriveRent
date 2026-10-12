using DriveRent.Application.DTOs;
using DriveRent.Application.Services;
using DriveRent.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace DriveRent.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] VehicleType? type, [FromQuery] VehicleStatus? status)
    {
        var vehicles = await _vehicleService.GetAllAsync(type, status);
        return Ok(vehicles);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var vehicle = await _vehicleService.GetByIdAsync(id);
        if (vehicle == null) return NotFound(new { message = "Không tìm thấy xe" });
        return Ok(vehicle);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVehicleRequest request)
    {
        var vehicle = await _vehicleService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, vehicle);
    }

    [HttpPost("{id}/check-availability")]
    public async Task<IActionResult> CheckAvailability(string id, [FromBody] CheckAvailabilityRequest request)
    {
        var result = await _vehicleService.CheckAvailabilityAsync(id, request.StartDate, request.EndDate);
        return Ok(result);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] VehicleStatus status)
    {
        var success = await _vehicleService.UpdateStatusAsync(id, status);
        if (!success) return NotFound();
        return NoContent();
    }
}
