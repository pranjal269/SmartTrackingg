using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace WebApplication1.Services
{
    // Mock implementation for services that might be missing
    public class MockEmailService : IEmailService
    {
        public Task SendEmailAsync(string toEmail, string subject, string body)
        {
            Console.WriteLine($"[MOCK] Email to: {toEmail}, Subject: {subject}");
            return Task.CompletedTask;
        }
    }

    public class MockSmsService : ISmsService
    {
        public Task SendSmsAsync(string phoneNumber, string message)
        {
            Console.WriteLine($"[MOCK] SMS to: {phoneNumber}, Message: {message}");
            return Task.CompletedTask;
        }
    }
} 