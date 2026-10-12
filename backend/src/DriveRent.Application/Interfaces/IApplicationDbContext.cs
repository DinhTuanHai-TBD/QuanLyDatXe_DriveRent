using DriveRent.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DriveRent.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Vehicle> Vehicles { get; }
    DbSet<Customer> Customers { get; }
    DbSet<RentalContract> RentalContracts { get; }
    DbSet<MaintenanceTask> MaintenanceTasks { get; }
    DbSet<OnlineBooking> OnlineBookings { get; }
    DbSet<User> Users { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
