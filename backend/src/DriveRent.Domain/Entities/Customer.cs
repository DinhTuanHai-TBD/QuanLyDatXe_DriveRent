namespace DriveRent.Domain.Entities;

public class Customer
{
    public string Id { get; set; } = string.Empty; // e.g. "CUST-01"
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string IdentityNumber { get; set; } = string.Empty; // CCCD
    public string DriverLicense { get; set; } = string.Empty;  // GPLX
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = "Đà Nẵng";
    public int RentalCount { get; set; } = 1;
    public int Rating { get; set; } = 5; // 1-5
    public string? Notes { get; set; }
    public string? IdCardFrontImage { get; set; }
    public string? DriverLicenseImage { get; set; }
}
