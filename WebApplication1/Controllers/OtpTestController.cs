using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace SmartTrackingg.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OtpTestController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;

        public OtpTestController(IEmailService emailService, ISmsService smsService)
        {
            _emailService = emailService;
            _smsService = smsService;
        }

        [HttpPost("test-email")]
        public async Task<IActionResult> TestEmail([FromBody] TestEmailRequest request)
        {
            try
            {
                string otp = GenerateOtp();
                string subject = "SmartTracking - Test OTP";
                string body = $@"
                    <html>
                    <body style='font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;'>
                        <div style='background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b); padding: 20px; border-radius: 10px; text-align: center; color: white;'>
                            <h1 style='margin: 0;'>SmartTracking</h1>
                        </div>
                        <div style='background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px; text-align: center;'>
                            <h2 style='color: #333;'>Your Test OTP Code</h2>
                            <p style='font-size: 16px; color: #555;'>Use the following OTP code to verify your test:</p>
                            <div style='font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 30px 0; color: #333; background: #e9ecef; padding: 15px; border-radius: 5px;'>
                                {otp}
                            </div>
                            <p style='font-size: 14px; color: #777;'>This is a test OTP. If you didn't request this, please ignore this email.</p>
                        </div>
                        <div style='text-align: center; margin-top: 20px; color: #777; font-size: 14px;'>
                            <p>© {DateTime.Now.Year} SmartTracking. All rights reserved.</p>
                        </div>
                    </body>
                    </html>";

                await _emailService.SendEmailAsync(request.Email, subject, body);
                
                return Ok(new { success = true, message = $"Test OTP {otp} sent to {request.Email}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Failed to send email: {ex.Message}" });
            }
        }

        [HttpPost("test-sms")]
        public async Task<IActionResult> TestSms([FromBody] TestSmsRequest request)
        {
            try
            {
                string otp = GenerateOtp();
                string message = $"SmartTracking: Your test OTP is: {otp}. Use this code to verify your test. Do not share with anyone.";

                await _smsService.SendSmsAsync(request.PhoneNumber, message);
                
                return Ok(new { success = true, message = $"Test OTP {otp} sent to {request.PhoneNumber}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Failed to send SMS: {ex.Message}" });
            }
        }
    }
} 