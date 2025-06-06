# 🚀 SmartTracking Backend

The backend API for the SmartTracking parcel management system, built with .NET 8 and PostgreSQL.

## 🛠️ Technologies

- **.NET 8**: Modern, cross-platform development framework
- **PostgreSQL**: Robust, open-source database
- **Entity Framework Core**: ORM for database operations
- **SendGrid**: Email service integration
- **Twilio**: SMS service integration
- **QRCoder**: QR code generation
- **Swagger/OpenAPI**: API documentation

## 📋 Prerequisites

- .NET 8 SDK
- PostgreSQL 14 or higher
- Docker (optional)
- SendGrid API Key (for email notifications)
- Twilio Account (for SMS notifications)

## 🔧 Local Development Setup

1. **Install Dependencies**:
```bash
dotnet restore
```

2. **Configure Database**:
```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE parcel_tracker;
CREATE USER dev16 WITH ENCRYPTED PASSWORD 'Datta@123';
GRANT ALL PRIVILEGES ON DATABASE parcel_tracker TO dev16;
ALTER USER dev16 CREATEDB;
GRANT ALL ON SCHEMA public TO dev16;
```

3. **Update Configuration**:
Edit `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=parcel_tracker;Username=dev16;Password=Datta@123;Pooling=true;"
  },
  "EmailSettings": {
    "SmtpServer": "smtp.sendgrid.net",
    "SmtpPort": 587,
    "SmtpUsername": "apikey",
    "SmtpPassword": "YOUR_SENDGRID_API_KEY",
    "SenderName": "SmartTracking",
    "SenderEmail": "your-verified-email@domain.com"
  },
  "SmsSettings": {
    "AccountSid": "YOUR_TWILIO_ACCOUNT_SID",
    "AuthToken": "YOUR_TWILIO_AUTH_TOKEN",
    "TwilioPhoneNumber": "YOUR_TWILIO_PHONE_NUMBER"
  }
}
```

4. **Apply Database Migrations**:
```bash
dotnet ef database update
```

5. **Run the Application**:
```bash
dotnet run
```

The API will be available at `http://localhost:8080`

## 🐳 Docker Deployment

1. **Build the Image**:
```bash
docker build -t smarttracking-backend .
```

2. **Run the Container**:
```bash
docker run -d --name smarttracking-backend -p 8080:80 \
  --add-host=host.docker.internal:host-gateway \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ASPNETCORE_URLS="http://+:80" \
  smarttracking-backend
```

3. **Apply Migrations in Container**:
```bash
docker exec -it smarttracking-backend bash -c "cd /src/WebApplication1 && dotnet ef database update"
```

## 📱 API Endpoints

### User Management
- `POST /api/User`: Create new user
- `POST /api/Admin/login`: Admin login
- `POST /api/Handler/login`: Handler login

### Shipment Operations
- `GET /api/Shipment`: Get all shipments
- `GET /api/Shipment/{id}`: Get shipment by ID
- `GET /api/Shipment/tracking/{trackingId}`: Get shipment by tracking ID
- `POST /api/Shipment`: Create new shipment
- `PATCH /api/Shipment/{id}/status`: Update shipment status
- `POST /api/Shipment/otp/{shipmentId}`: Generate delivery OTP
- `POST /api/Shipment/otp/verify/{shipmentId}`: Verify delivery OTP

### Admin Operations
- `GET /api/Admin/dashboard`: Get dashboard statistics
- `GET /api/Admin/shipments`: Get all shipments with filters
- `GET /api/Admin/users`: Get all users
- `PUT /api/Admin/users/{id}/role`: Update user role

## 🔒 Security

- **Authentication**: Token-based authentication
- **Authorization**: Role-based access control (User, Handler, Admin)
- **Data Protection**: Secure password storage
- **API Security**: CORS policy configuration

## 📊 Database Schema

Key entities in the system:
- `Users`: User management
- `Shipments`: Parcel tracking
- `DeliveryOtps`: OTP verification

## 🧪 Testing

Run the test suite:
```bash
dotnet test
```

## 📚 Documentation

API documentation is available at:
- Development: `http://localhost:8080/swagger`
- Production: Configure as needed

## 🔍 Logging

The application uses built-in .NET logging with console output. In production, configure appropriate logging providers.

## ⚙️ Configuration Options

Key configuration sections:
- `ConnectionStrings`: Database connection
- `EmailSettings`: SendGrid configuration
- `SmsSettings`: Twilio configuration
- `AllowedHosts`: CORS settings

## 🚀 Deployment Checklist

1. Update connection strings
2. Configure email/SMS services
3. Set environment variables
4. Apply database migrations
5. Configure CORS policies
6. Enable production logging
7. Set up monitoring 