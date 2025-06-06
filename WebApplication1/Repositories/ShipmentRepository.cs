using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public interface IShipmentRepository
    {
        Task<List<Shipment>> GetAllShipmentsAsync();
        Task<Shipment> GetShipmentByIdAsync(int id);
        Task<List<Shipment>> GetShipmentsByUserIdAsync(int userId);
        Task<Shipment> GetShipmentByTrackingIdAsync(string trackingId);
        Task<Shipment> CreateShipmentAsync(Shipment shipment);
        Task UpdateShipmentAsync(Shipment shipment);
        Task DeleteShipmentAsync(int id);
        Task<bool> ShipmentExistsAsync(int id);
    }

    public class ShipmentRepository : IShipmentRepository
    {
        private readonly ApplicationDbContext _context;

        public ShipmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Shipment>> GetAllShipmentsAsync()
        {
            return await _context.Shipments.ToListAsync();
        }

        public async Task<Shipment> GetShipmentByIdAsync(int id)
        {
            return await _context.Shipments.FindAsync(id);
        }

        public async Task<List<Shipment>> GetShipmentsByUserIdAsync(int userId)
        {
            return await _context.Shipments
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        public async Task<Shipment> GetShipmentByTrackingIdAsync(string trackingId)
        {
            return await _context.Shipments
                .FirstOrDefaultAsync(s => s.TrackingId == trackingId);
        }

        public async Task<Shipment> CreateShipmentAsync(Shipment shipment)
        {
            // Ensure CreatedAt is set
            shipment.CreatedAt = DateTime.UtcNow;
            
            // Set DeliveryDate to null - it's not in the DB
            shipment.DeliveryDate = null;
            
            _context.Shipments.Add(shipment);
            await _context.SaveChangesAsync();
            return shipment;
        }

        public async Task UpdateShipmentAsync(Shipment shipment)
        {
            // Get existing entity from DB
            var existingShipment = await _context.Shipments.FindAsync(shipment.Id);
            if (existingShipment == null)
            {
                throw new InvalidOperationException($"Shipment with ID {shipment.Id} not found");
            }
            
            // Update properties
            existingShipment.RecipientName = shipment.RecipientName;
            existingShipment.DeliveryAddress = shipment.DeliveryAddress;
            existingShipment.CurrentAddress = shipment.CurrentAddress;
            existingShipment.PackageType = shipment.PackageType;
            existingShipment.Weight = shipment.Weight;
            existingShipment.SpecialInstructions = shipment.SpecialInstructions;
            existingShipment.Photo = shipment.Photo;
            existingShipment.Status = shipment.Status;
            existingShipment.QRCodeImage = shipment.QRCodeImage;
            existingShipment.UserEmail = shipment.UserEmail;
            
            // Save changes
            await _context.SaveChangesAsync();
        }

        public async Task DeleteShipmentAsync(int id)
        {
            var shipment = await _context.Shipments.FindAsync(id);
            if (shipment != null)
            {
                _context.Shipments.Remove(shipment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ShipmentExistsAsync(int id)
        {
            return await _context.Shipments.AnyAsync(e => e.Id == id);
        }
    }
} 