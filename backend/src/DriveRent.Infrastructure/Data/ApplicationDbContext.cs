using DriveRent.Application.Interfaces;
using DriveRent.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DriveRent.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<RentalContract> RentalContracts => Set<RentalContract>();
    public DbSet<MaintenanceTask> MaintenanceTasks => Set<MaintenanceTask>();
    public DbSet<OnlineBooking> OnlineBookings => Set<OnlineBooking>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Vehicle config
        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.HourlyPrice).HasPrecision(18, 2);
            entity.Property(e => e.DailyPrice).HasPrecision(18, 2);
        });

        // Customer config
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        // RentalContract config
        modelBuilder.Entity<RentalContract>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Rate).HasPrecision(18, 2);
            entity.Property(e => e.Units).HasPrecision(18, 2);
            entity.Property(e => e.BaseRentalFee).HasPrecision(18, 2);
            entity.Property(e => e.Deposit).HasPrecision(18, 2);
            entity.Property(e => e.Discount).HasPrecision(18, 2);
            entity.Property(e => e.SurchargesTotal).HasPrecision(18, 2);
            entity.Property(e => e.TotalServiceFee).HasPrecision(18, 2);
            entity.Property(e => e.AmountPaid).HasPrecision(18, 2);

            entity.OwnsOne(e => e.HandoverRecord);
            entity.OwnsOne(e => e.ReturnRecord, r =>
            {
                r.Property(x => x.DamageFee).HasPrecision(18, 2);
                r.OwnsOne(x => x.Checklist);
            });
            entity.OwnsOne(e => e.FinalSettlement, s =>
            {
                s.Property(x => x.ActualUnitsBilled).HasPrecision(18, 2);
                s.Property(x => x.UnitRate).HasPrecision(18, 2);
                s.Property(x => x.ActualRentalFee).HasPrecision(18, 2);
                s.Property(x => x.SurchargesTotal).HasPrecision(18, 2);
                s.Property(x => x.DamageFee).HasPrecision(18, 2);
                s.Property(x => x.Discount).HasPrecision(18, 2);
                s.Property(x => x.TotalServiceFee).HasPrecision(18, 2);
                s.Property(x => x.AmountPaid).HasPrecision(18, 2);
                s.Property(x => x.DepositHeld).HasPrecision(18, 2);
                s.Property(x => x.DepositDeducted).HasPrecision(18, 2);
                s.Property(x => x.AdditionalDue).HasPrecision(18, 2);
                s.Property(x => x.RefundAmount).HasPrecision(18, 2);
            });
        });

        // MaintenanceTask config
        modelBuilder.Entity<MaintenanceTask>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Cost).HasPrecision(18, 2);
        });

        // OnlineBooking config
        modelBuilder.Entity<OnlineBooking>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Units).HasPrecision(18, 2);
            entity.Property(e => e.Rate).HasPrecision(18, 2);
            entity.Property(e => e.RentalFee).HasPrecision(18, 2);
            entity.Property(e => e.DeliveryFee).HasPrecision(18, 2);
            entity.Property(e => e.TotalEstimatedAmount).HasPrecision(18, 2);
            entity.Property(e => e.BookingDepositRequired).HasPrecision(18, 2);
            entity.Property(e => e.BookingDepositPaid).HasPrecision(18, 2);
            entity.Property(e => e.RemainingAmountDue).HasPrecision(18, 2);
            entity.Property(e => e.SecurityDepositOnPickup).HasPrecision(18, 2);
        });
    }
}
