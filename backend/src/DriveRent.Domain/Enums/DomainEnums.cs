namespace DriveRent.Domain.Enums;

public enum VehicleType
{
    Motorbike = 1,
    Car = 2
}

public enum VehicleStatus
{
    Available = 1,
    Rented = 2,
    Maintenance = 3
}

public enum ContractStatus
{
    Draft = 1,
    Confirmed = 2,
    Rented = 3,
    PendingSettlement = 4,
    Completed = 5,
    Cancelled = 6
}

public enum PricingType
{
    Hourly = 1,
    Daily = 2
}

public enum MaintenanceStatus
{
    Upcoming = 1,
    Overdue = 2,
    InProgress = 3,
    Completed = 4
}

public enum BookingStatus
{
    PendingPayment = 1,
    VerifyingPayment = 2,
    Confirmed = 3,
    Expired = 4,
    Cancelled = 5,
    RefundPending = 6,
    Refunded = 7
}

public enum UserRole
{
    Admin = 1,
    Staff = 2,
    Technician = 3
}
