using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public interface IDeliveryOtpRepository
    {
        Task<DeliveryOtp> GetByShipmentIdAndOtpAsync(int shipmentId, string otpCode, bool isUsed);
        Task<DeliveryOtp> CreateOtpAsync(DeliveryOtp otp);
        Task UpdateOtpAsync(DeliveryOtp otp);
    }

    public class DeliveryOtpRepository : IDeliveryOtpRepository
    {
        private readonly ApplicationDbContext _context;

        public DeliveryOtpRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DeliveryOtp> GetByShipmentIdAndOtpAsync(int shipmentId, string otpCode, bool isUsed)
        {
            return await _context.DeliveryOtps
                .Where(o => o.ShipmentId == shipmentId && o.Otp == otpCode && o.IsUsed == isUsed)
                .FirstOrDefaultAsync();
        }

        public async Task<DeliveryOtp> CreateOtpAsync(DeliveryOtp otp)
        {
            // Initialize properties
            otp.IsUsed = false;
            
            _context.DeliveryOtps.Add(otp);
            await _context.SaveChangesAsync();
            return otp;
        }

        public async Task UpdateOtpAsync(DeliveryOtp otp)
        {
            var existingOtp = await _context.DeliveryOtps.FindAsync(otp.Id);
            if (existingOtp == null)
            {
                throw new InvalidOperationException($"OTP with ID {otp.Id} not found");
            }
            
            existingOtp.IsUsed = otp.IsUsed;
            
            await _context.SaveChangesAsync();
        }
    }
} 