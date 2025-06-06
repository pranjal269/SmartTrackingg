using System.Threading.Tasks;

namespace SmartTrackingg.Services
{
    public interface ISmsService
    {
        Task SendSmsAsync(string phoneNumber, string message);
    }
} 