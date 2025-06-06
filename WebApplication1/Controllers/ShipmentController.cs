﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShipmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;
        private readonly ITrackingService _trackingService;
        private readonly IQRCodeService _qrCodeService;

        public ShipmentController(
            ApplicationDbContext context,
            IEmailService emailService,
            ISmsService smsService,
            ITrackingService trackingService,
            IQRCodeService qrCodeService)
        {
            _context = context;
            _emailService = emailService;
            _smsService = smsService;
            _trackingService = trackingService;
            _qrCodeService = qrCodeService;
        }

        // GET: api/Shipment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shipment>>> GetShipments()
        {
            return await _context.Shipments.ToListAsync();
        }

        // GET: api/Shipment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Shipment>> GetShipment(int id)
        {
            var shipment = await _context.Shipments.FindAsync(id);

            if (shipment == null)
            {
                return NotFound();
            }

            return shipment;
        }

        // GET: api/Shipment/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Shipment>>> GetShipmentsByUser(int userId)
        {
            return await _context.Shipments
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        // GET: api/Shipment/tracking/{trackingId}
        [HttpGet("tracking/{trackingId}")]
        public async Task<ActionResult<Shipment>> GetShipmentByTrackingId(string trackingId)
        {
            // Validate input
            if (string.IsNullOrEmpty(trackingId))
            {
                return BadRequest("Tracking ID cannot be empty.");
            }

            // Find shipment by tracking ID
            var shipment = await _context.Shipments
                .FirstOrDefaultAsync(s => s.TrackingId == trackingId);

            // Return 404 if not found
            if (shipment == null)
            {
                return NotFound($"No shipment found with tracking ID: {trackingId}");
            }

            return shipment;
        }

        // POST: api/Shipment
        [HttpPost]
        public async Task<ActionResult<Shipment>> CreateShipment(Shipment shipment)
        {
            // Verify user exists
            var user = await _context.Users.FindAsync(shipment.UserId);
            if (user == null)
            {
                return BadRequest("The specified UserId does not exist");
            }

            // Generate tracking ID
            shipment.TrackingId = _trackingService.GenerateTrackingId();

            // Generate QR code containing tracking URL
            
            string trackingUrl = $"http://https://smart-trackingg.vercel.app/track/{shipment.TrackingId}";
            shipment.QRCodeImage = _qrCodeService.GenerateQRCode(trackingUrl);

            // Set user email from the user
            shipment.UserEmail = user.Email;
            
            // Explicitly detach the User property to avoid validation errors
            shipment.User = null;
            
            _context.Shipments.Add(shipment);
            await _context.SaveChangesAsync();

            // Try to send email notification - don't fail if email service is down
            try
            {
                Console.WriteLine($"Attempting to send shipment confirmation email to: {user.Email}");
                string emailBody = $@"
                    <html>
                    <body>
                        <h2>Your Parcel Has Been Registered</h2>
                        <p>Dear {user.FirstName},</p>
                        <p>Your parcel has been successfully registered in our system.</p>
                        <p><strong>Tracking ID:</strong> {shipment.TrackingId}</p>
                        <p><strong>Recipient:</strong> {shipment.RecipientName}</p>
                        <p><strong>Delivery Address:</strong> {shipment.DeliveryAddress}</p>
                        <p>You can track your parcel status using the tracking ID above.</p>
                        <p>Thank you for using our service!</p>
                    </body>
                    </html>";

                await _emailService.SendEmailAsync(user.Email, "Parcel Registration Confirmation", emailBody);
                Console.WriteLine("Shipment confirmation email sent successfully");
            }
            catch (Exception ex)
            {
                // Log the email error but don't fail the shipment creation
                Console.WriteLine($"Email notification failed for shipment {shipment.TrackingId}: {ex.Message}");
                Console.WriteLine($"Email error details: {ex}");
            }

            // Try to send SMS notification if phone number exists - don't fail if SMS service is down
            try
            {
                if (!string.IsNullOrEmpty(user.PhoneNumber))
                {
                    Console.WriteLine($"Attempting to send shipment SMS to: {user.PhoneNumber}");
                    string smsMessage = $"Your parcel has been registered. Tracking ID: {shipment.TrackingId}";
                    await _smsService.SendSmsAsync(user.PhoneNumber, smsMessage);
                    Console.WriteLine("Shipment SMS sent successfully");
                }
                else
                {
                    Console.WriteLine("No phone number found for user, skipping shipment SMS");
                }
            }
            catch (Exception ex)
            {
                // Log the SMS error but don't fail the shipment creation
                Console.WriteLine($"SMS notification failed for shipment {shipment.TrackingId}: {ex.Message}");
                Console.WriteLine($"SMS error details: {ex}");
            }

            return CreatedAtAction(nameof(GetShipment), new { id = shipment.Id }, shipment);
        }

        // PUT: api/Shipment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateShipment(int id, Shipment shipment)
        {
            if (id != shipment.Id)
            {
                return BadRequest();
            }

            _context.Entry(shipment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShipmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PATCH: api/Shipment/5/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateShipmentStatus(int id, [FromBody] ShipmentStatusUpdate statusUpdate)
        {
            var shipment = await _context.Shipments.FindAsync(id);
            if (shipment == null)
            {
                return NotFound();
            }

            // Update status
            shipment.Status = statusUpdate.Status;
            
            // Update current address if provided
            if (!string.IsNullOrEmpty(statusUpdate.CurrentAddress))
            {
                shipment.CurrentAddress = statusUpdate.CurrentAddress;
            }
            
            await _context.SaveChangesAsync();

            return Ok(shipment);
        }

        // DELETE: api/Shipment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShipment(int id)
        {
            var shipment = await _context.Shipments.FindAsync(id);
            if (shipment == null)
            {
                return NotFound();
            }

            _context.Shipments.Remove(shipment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPost("otp/{shipmentId}")]
        public async Task<ActionResult<DeliveryOtp>> CreateDeliveryOtp(int shipmentId)
        {
            var shipment = await _context.Shipments.FindAsync(shipmentId);
            if (shipment == null)
            {
                return NotFound("Shipment not found.");
            }

            // Get user details for SMS
            var user = await _context.Users.FindAsync(shipment.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            Console.WriteLine($"Creating OTP for shipment {shipmentId}, user email: {user.Email}, phone: {user.PhoneNumber}");

            // Generate OTP
            var otp = new DeliveryOtp
            {
                Otp = _trackingService.GenerateOtp(),
                ShipmentId = shipmentId
            };

            _context.DeliveryOtps.Add(otp);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Generated OTP: {otp.Otp}");

            // Try to send OTP via email - don't fail if email service is down
            try
            {
                Console.WriteLine($"Attempting to send email to: {shipment.UserEmail}");
                string emailBody = $@"
                    <html>
                    <body style='font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;'>
                        <div style='background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b); padding: 20px; border-radius: 10px; text-align: center; color: white;'>
                            <h1 style='margin: 0;'>SmartTracking</h1>
                        </div>
                        <div style='background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px; text-align: center;'>
                            <h2 style='color: #333;'>Your Delivery OTP Code</h2>
                            <p style='font-size: 16px; color: #555;'>Hello {shipment.RecipientName},</p>
                            <p style='font-size: 16px; color: #555;'>Use the following OTP code to confirm the delivery of your parcel (Tracking ID: {shipment.TrackingId}):</p>
                            <div style='font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 30px 0; color: #333; background: #e9ecef; padding: 15px; border-radius: 5px;'>
                                {otp.Otp}
                            </div>
                            <p style='font-size: 14px; color: #777;'>This OTP is valid for a limited time. Do not share this code with anyone.</p>
                        </div>
                        <div style='text-align: center; margin-top: 20px; color: #777; font-size: 14px;'>
                            <p>© {DateTime.Now.Year} SmartTracking. All rights reserved.</p>
                        </div>
                    </body>
                    </html>";

                await _emailService.SendEmailAsync(shipment.UserEmail, "SmartTracking - Delivery OTP", emailBody);
                Console.WriteLine("Email sent successfully");
            }
            catch (Exception ex)
            {
                // Log the email error but don't fail the OTP creation
                Console.WriteLine($"Email notification failed for OTP {otp.Otp}: {ex.Message}");
                Console.WriteLine($"Email error details: {ex}");
            }

            // Try to send OTP via SMS if phone number exists - don't fail if SMS service is down
            try
            {
                if (!string.IsNullOrEmpty(user.PhoneNumber))
                {
                    Console.WriteLine($"Attempting to send SMS to: {user.PhoneNumber}");
                    string smsMessage = $"SmartTracking: Your delivery OTP for parcel {shipment.TrackingId} is: {otp.Otp}. This code is valid for a limited time. Do not share it with anyone.";
                    await _smsService.SendSmsAsync(user.PhoneNumber, smsMessage);
                    Console.WriteLine("SMS sent successfully");
                }
                else
                {
                    Console.WriteLine("No phone number found for user, skipping SMS");
                }
            }
            catch (Exception ex)
            {
                // Log the SMS error but don't fail the OTP creation
                Console.WriteLine($"SMS notification failed for OTP {otp.Otp}: {ex.Message}");
                Console.WriteLine($"SMS error details: {ex}");
            }

            return CreatedAtAction(nameof(GetShipment), new { id = shipmentId }, otp);
        }
        [HttpPost("otp/verify/{shipmentId}")]
        public async Task<IActionResult> VerifyDeliveryOtp(int shipmentId, [FromBody] string otpCode)
        {
            var otp = await _context.DeliveryOtps
                .FirstOrDefaultAsync(o => o.ShipmentId == shipmentId && o.Otp == otpCode && !o.IsUsed);

            if (otp == null)
            {
                return BadRequest("Invalid or already used OTP.");
            }

            // Mark OTP as used
            otp.IsUsed = true;
            _context.Shipments
                .Where(s => s.Id == shipmentId)
                .ToList()
                .ForEach(s => s.Status = "Delivered"); // Update shipment status to Delivered
            await _context.SaveChangesAsync();

            return Ok("OTP verified successfully.");
        }


        private bool ShipmentExists(int id)
        {
            return _context.Shipments.Any(e => e.Id == id);
        }
    }
    

    public class ShipmentStatusUpdate
    {
        public string Status { get; set; } = string.Empty;
        public string? CurrentAddress { get; set; }
    }
}
