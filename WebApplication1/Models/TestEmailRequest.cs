using System.ComponentModel.DataAnnotations;

namespace SmartTrackingg.Models
{
    public class TestEmailRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
} 