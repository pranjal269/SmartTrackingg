using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Services;
using WebApplication1.Repositories;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using System.Net;
using System;

var builder = WebApplication.CreateBuilder(args);

// Configure forwarded headers
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    // In a production environment, you might want to specify known proxies if possible.
    // options.KnownNetworks.Clear();
    // options.KnownProxies.Clear();
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure database context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(connectionString);
    
    // Turn off the migration warnings
    options.ConfigureWarnings(warnings => 
        warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
});

// Register repositories
builder.Services.AddScoped<IShipmentRepository, ShipmentRepository>();
builder.Services.AddScoped<IDeliveryOtpRepository, DeliveryOtpRepository>();

// Register service implementations
builder.Services.AddScoped<ITrackingService, TrackingService>();
builder.Services.AddScoped<IQRCodeService, QRCodeService>();

// Register mock services when the real ones aren't available
try
{
    // Try to use real services if they're properly configured
    builder.Services.AddScoped<IEmailService, EmailService>();
    builder.Services.AddScoped<ISmsService, SmsService>();
    Console.WriteLine("Registered real email and SMS services");
}
catch (Exception ex)
{
    // Fall back to mock services if something goes wrong
    Console.WriteLine($"Error registering real services: {ex.Message}");
    Console.WriteLine("Using mock email and SMS services instead");
    builder.Services.AddScoped<IEmailService, MockEmailService>();
    builder.Services.AddScoped<ISmsService, MockSmsService>();
}

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowGitHubPages",
        policy =>
        {
            policy.WithOrigins(
                    "https://smart-trackingg.vercel.app",
                    "https://f737-103-180-214-187.ngrok-free.app"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .SetIsOriginAllowed(origin => true); // Backup to ensure all origins are allowed during testing
        });
});

var app = builder.Build();

app.UseForwardedHeaders(); // Use forwarded headers early

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // Basic production error handling (optional, logs are primary)
    // app.UseExceptionHandler("/Error"); // You would need to create an Error handling page/endpoint
    app.UseHsts(); // HTTP Strict Transport Security
}

app.UseHttpsRedirection(); // Should work better with UseForwardedHeaders

app.UseRouting(); // Explicitly add UseRouting

app.UseCors("AllowGitHubPages"); // Apply the named CORS policy

app.UseAuthorization();
app.MapControllers();

// Try to connect to the database and create schema if needed
try 
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        Console.WriteLine("Attempting to create/update database schema if needed...");
        db.Database.EnsureCreated();
        Console.WriteLine("Database schema check completed successfully!");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"An error occurred while setting up the database: {ex.Message}");
    // Log the error but continue app startup
}

app.Run();