private string GenerateRandomOtp() { var random = new Random(); return random.Next(100000, 999999).ToString(); }
