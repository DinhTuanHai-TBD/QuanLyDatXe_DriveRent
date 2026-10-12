using DriveRent.Application.DTOs;
using DriveRent.Application.Services;
using DriveRent.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace DriveRent.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractsController : ControllerBase
{
    private readonly IContractService _contractService;

    public ContractsController(IContractService contractService)
    {
        _contractService = contractService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ContractStatus? status)
    {
        var contracts = await _contractService.GetAllAsync(status);
        return Ok(contracts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var contract = await _contractService.GetByIdAsync(id);
        if (contract == null) return NotFound(new { message = "Không tìm thấy hợp đồng" });
        return Ok(contract);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContractRequest request)
    {
        try
        {
            var contract = await _contractService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = contract.Id }, contract);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/handover")]
    public async Task<IActionResult> Handover(string id, [FromBody] HandoverRequest request)
    {
        try
        {
            var contract = await _contractService.HandoverAsync(id, request);
            return Ok(contract);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/return")]
    public async Task<IActionResult> Return(string id, [FromBody] ReturnRequest request)
    {
        try
        {
            var contract = await _contractService.ReturnAsync(id, request);
            return Ok(contract);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/settle")]
    public async Task<IActionResult> Settle(string id, [FromBody] SettlementRequest request)
    {
        try
        {
            var contract = await _contractService.SettleAsync(id, request);
            return Ok(contract);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
