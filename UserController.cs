using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using System.Text.Json;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction("CreateUser", new { id = user.Id }, user);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST: api/User/login
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginModel model)
        {
            Console.WriteLine($"Login attempt for: {model.Email}");
            
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == model.Password);

            if (user == null)
            {
                Console.WriteLine("Login failed: User not found or password incorrect");
                return NotFound("Invalid email or password");
            }

            Console.WriteLine($"Login successful for user: {user.Email}, ID: {user.Id}");
            return Ok(new { 
                id = user.Id, 
                name = user.Name, 
                email = user.Email,
                phoneNumber = user.PhoneNumber
            });
        }
    }

    public class LoginModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
} 