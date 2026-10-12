using System.Text.Json.Serialization;
using DriveRent.Application.Interfaces;
using DriveRent.Application.Services;
using DriveRent.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers with JSON String Enum Converter
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// 2. Add DbContext (InMemory for instant zero-config run, can switch to SQL Server)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseInMemoryDatabase("DriveRentDb");
});

builder.Services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

// 3. Register Application Services (Clean Architecture Dependency Injection)
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IContractService, ContractService>();
builder.Services.AddScoped<IMaintenanceService, MaintenanceService>();
builder.Services.AddScoped<IBookingService, BookingService>();

// 4. Configure CORS for Frontend React / Vite
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 5. Add Swagger / OpenAPI documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "DriveRent Web API",
        Version = "v1",
        Description = "Hệ thống Quản lý Dịch vụ Cho thuê Xe máy & Ô tô Tự lái (Clean Architecture & RESTful API)",
        Contact = new OpenApiContact
        {
            Name = "DriveRent Development Team",
            Email = "hotro@driverent.vn"
        }
    });
});

var app = builder.Build();

// Seed initial mock data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await DbInitializer.SeedAsync(context);
}

// Configure HTTP request pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "DriveRent API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
