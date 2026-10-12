using DriveRent.Application.DTOs;
using DriveRent.Application.Interfaces;
using DriveRent.Domain.Entities;
using DriveRent.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace DriveRent.Application.Services;

public interface IContractService
{
    Task<List<RentalContract>> GetAllAsync(ContractStatus? status = null);
    Task<RentalContract?> GetByIdAsync(string id);
    Task<RentalContract> CreateAsync(CreateContractRequest request);
    Task<RentalContract> HandoverAsync(string contractId, HandoverRequest request);
    Task<RentalContract> ReturnAsync(string contractId, ReturnRequest request);
    Task<RentalContract> SettleAsync(string contractId, SettlementRequest request);
}

public class ContractService : IContractService
{
    private readonly IApplicationDbContext _context;
    private readonly IVehicleService _vehicleService;

    public ContractService(IApplicationDbContext context, IVehicleService vehicleService)
    {
        _context = context;
        _vehicleService = vehicleService;
    }

    public async Task<List<RentalContract>> GetAllAsync(ContractStatus? status = null)
    {
        var query = _context.RentalContracts.AsQueryable();
        if (status.HasValue)
            query = query.Where(c => c.Status == status.Value);

        return await query.OrderByDescending(c => c.CreatedAt).ToListAsync();
    }

    public async Task<RentalContract?> GetByIdAsync(string id)
    {
        return await _context.RentalContracts.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<RentalContract> CreateAsync(CreateContractRequest request)
    {
        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == request.VehicleId)
            ?? throw new ArgumentException("Không tìm thấy phương tiện.");

        // Check availability
        var avail = await _vehicleService.CheckAvailabilityAsync(request.VehicleId, request.StartDate, request.EndDate);
        if (!avail.Available)
            throw new InvalidOperationException(avail.ConflictReason ?? "Xe không khả dụng");

        // Customer logic
        string customerId = request.CustomerId ?? string.Empty;
        if (string.IsNullOrWhiteSpace(customerId))
        {
            customerId = $"CUST-{DateTime.UtcNow.Ticks % 10000:D4}";
            var newCustomer = new Customer
            {
                Id = customerId,
                FullName = request.CustomerName ?? "Khách hàng mới",
                Phone = request.CustomerPhone ?? "",
                IdentityNumber = request.IdentityNumber ?? "",
                DriverLicense = request.DriverLicense ?? "",
                Address = request.CustomerAddress ?? "Khách sạn nội thành"
            };
            _context.Customers.Add(newCustomer);
        }

        // Calculate billable units
        var duration = request.EndDate - request.StartDate;
        decimal units;
        decimal rate;

        if (request.PricingType == PricingType.Hourly)
        {
            var hours = (decimal)duration.TotalHours;
            units = Math.Max(1, Math.Ceiling(hours));
            rate = vehicle.HourlyPrice;
        }
        else
        {
            var days = (decimal)duration.TotalHours / 24m;
            units = Math.Max(1, Math.Ceiling(days));
            rate = vehicle.DailyPrice;
        }

        var baseRentalFee = units * rate;
        var deposit = request.Deposit > 0 ? request.Deposit : (vehicle.Type == VehicleType.Car ? 5000000m : 1000000m);
        var totalServiceFee = Math.Max(0, baseRentalFee - request.Discount);

        var contract = new RentalContract
        {
            Id = $"HD-{DateTime.UtcNow:yyyy}-{DateTime.UtcNow.Ticks % 1000:D3}",
            VehicleId = request.VehicleId,
            CustomerId = customerId,
            PricingType = request.PricingType,
            Status = ContractStatus.Confirmed,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Rate = rate,
            Units = units,
            BaseRentalFee = baseRentalFee,
            Deposit = deposit,
            Discount = request.Discount,
            SurchargesTotal = 0,
            TotalServiceFee = totalServiceFee,
            AmountPaid = request.InitialAmountPaid,
            Note = request.Note,
            CreatedAt = DateTime.UtcNow
        };

        _context.RentalContracts.Add(contract);
        await _context.SaveChangesAsync();
        return contract;
    }

    public async Task<RentalContract> HandoverAsync(string contractId, HandoverRequest request)
    {
        var contract = await _context.RentalContracts.FirstOrDefaultAsync(c => c.Id == contractId)
            ?? throw new ArgumentException("Hợp đồng không tồn tại");

        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == contract.VehicleId)
            ?? throw new ArgumentException("Phương tiện không tồn tại");

        contract.Status = ContractStatus.Rented;
        contract.HandoverRecord = new HandoverRecord
        {
            ActualTime = request.ActualTime,
            Odometer = request.Odometer > 0 ? request.Odometer : vehicle.CurrentOdometer,
            FuelLevel = request.FuelLevel,
            Accessories = request.Accessories,
            Notes = request.Notes,
            Photos = request.Photos,
            PerformedBy = request.PerformedBy
        };

        vehicle.Status = VehicleStatus.Rented;
        vehicle.CurrentOdometer = contract.HandoverRecord.Odometer;
        vehicle.FuelLevel = contract.HandoverRecord.FuelLevel;

        await _context.SaveChangesAsync();
        return contract;
    }

    public async Task<RentalContract> ReturnAsync(string contractId, ReturnRequest request)
    {
        var contract = await _context.RentalContracts.FirstOrDefaultAsync(c => c.Id == contractId)
            ?? throw new ArgumentException("Hợp đồng không tồn tại");

        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == contract.VehicleId)
            ?? throw new ArgumentException("Phương tiện không tồn tại");

        contract.Status = ContractStatus.PendingSettlement;
        contract.ReturnRecord = new ReturnRecord
        {
            ActualTime = request.ActualTime,
            Odometer = request.Odometer,
            FuelLevel = request.FuelLevel,
            Checklist = request.Checklist,
            DamageNotes = request.DamageNotes,
            DamageFee = request.DamageFee,
            Photos = request.Photos,
            PostStatus = request.PostStatus,
            PerformedBy = request.PerformedBy
        };

        vehicle.CurrentOdometer = request.Odometer;
        vehicle.FuelLevel = request.FuelLevel;

        await _context.SaveChangesAsync();
        return contract;
    }

    public async Task<RentalContract> SettleAsync(string contractId, SettlementRequest request)
    {
        var contract = await _context.RentalContracts.FirstOrDefaultAsync(c => c.Id == contractId)
            ?? throw new ArgumentException("Hợp đồng không tồn tại");

        var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == contract.VehicleId)
            ?? throw new ArgumentException("Phương tiện không tồn tại");

        var actualStart = contract.HandoverRecord?.ActualTime ?? contract.StartDate;
        var actualEnd = contract.ReturnRecord?.ActualTime ?? DateTime.UtcNow;

        var duration = actualEnd - actualStart;
        decimal actualUnits;
        if (contract.PricingType == PricingType.Hourly)
        {
            var hours = (decimal)duration.TotalHours;
            actualUnits = Math.Max(1, Math.Ceiling(hours));
        }
        else
        {
            var days = (decimal)duration.TotalHours / 24m;
            actualUnits = Math.Max(1, Math.Ceiling(days));
        }

        var actualRentalFee = actualUnits * contract.Rate;
        var damageFee = contract.ReturnRecord?.DamageFee ?? 0;
        var totalServiceFee = Math.Max(0, actualRentalFee + contract.SurchargesTotal + damageFee - contract.Discount);

        var depositHeld = contract.Deposit;
        var amountPaid = contract.AmountPaid;
        var remainingDue = totalServiceFee - amountPaid;

        decimal depositDeducted = 0;
        decimal additionalDue = 0;
        decimal refundAmount = 0;

        if (remainingDue > 0)
        {
            if (request.DeductFromDeposit)
            {
                depositDeducted = Math.Min(depositHeld, remainingDue);
                additionalDue = Math.Max(0, remainingDue - depositHeld);
                refundAmount = Math.Max(0, depositHeld - remainingDue);
            }
            else
            {
                depositDeducted = 0;
                additionalDue = remainingDue;
                refundAmount = depositHeld;
            }
        }
        else
        {
            depositDeducted = 0;
            additionalDue = 0;
            refundAmount = depositHeld + Math.Abs(remainingDue);
        }

        contract.FinalSettlement = new FinalSettlement
        {
            ActualUnitsBilled = actualUnits,
            PricingType = contract.PricingType,
            UnitRate = contract.Rate,
            ActualRentalFee = actualRentalFee,
            SurchargesTotal = contract.SurchargesTotal,
            DamageFee = damageFee,
            Discount = contract.Discount,
            TotalServiceFee = totalServiceFee,
            AmountPaid = amountPaid,
            DepositHeld = depositHeld,
            DepositDeducted = depositDeducted,
            AdditionalDue = additionalDue,
            RefundAmount = refundAmount,
            SettledAt = DateTime.UtcNow,
            SettledBy = request.SettledBy,
            PaymentMethod = request.PaymentMethod
        };

        contract.Status = ContractStatus.Completed;

        // Update vehicle status
        vehicle.Status = contract.ReturnRecord?.PostStatus ?? VehicleStatus.Available;

        await _context.SaveChangesAsync();
        return contract;
    }
}
