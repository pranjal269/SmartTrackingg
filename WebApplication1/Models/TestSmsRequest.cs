using System.ComponentModel.DataAnnotations;

namespace SmartTrackingg.Models
{
    public class TestSmsRequest
    {
        [Required]
        [Phone]
        public string PhoneNumber { get; set; }
    }
} 