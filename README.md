# 🚀 SmartTracking - Parcel Management System

A modern, full-stack parcel tracking and management system built with .NET 8 and React. This application provides real-time parcel tracking, QR code-based verification, and multi-role user management.

## 🌟 Features

- **Multi-Role System**: Support for Users, Handlers, and Administrators
- **Real-Time Tracking**: Live updates on parcel status and location
- **QR Code Integration**: Secure parcel verification using QR codes
- **OTP Verification**: Two-factor authentication for delivery confirmation
- **Email & SMS Notifications**: Automated alerts for shipment updates
- **Responsive UI**: Modern, mobile-friendly interface

## 🏗️ Project Structure

The project is divided into two main components:

- `WebApplication1/`: Backend API built with .NET 8
- `parcel-tracking-frontend/`: Frontend application built with React

## 📋 Prerequisites

- Node.js (v18 or higher)
- .NET 8 SDK
- PostgreSQL 14 or higher
- Docker (optional)
- Git

## 🔧 Installation

Clone the repository:
```bash
git clone https://github.com/yourusername/SmartTrackingg.git
cd SmartTrackingg
```

For detailed setup instructions, refer to:
- [Backend Setup Guide](WebApplication1/README.md)
- [Frontend Setup Guide](parcel-tracking-frontend/README.md)

## 🚀 Quick Start

1. Set up the database:
```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE parcel_tracker;
CREATE USER dev16 WITH ENCRYPTED PASSWORD 'Datta@123';
GRANT ALL PRIVILEGES ON DATABASE parcel_tracker TO dev16;
ALTER USER dev16 CREATEDB;
```

2. Start the backend:
```bash
cd WebApplication1
dotnet restore
dotnet run
```

3. Start the frontend:
```bash
cd parcel-tracking-frontend
npm install
npm start
```

## 🐳 Docker Deployment

Build and run the backend using Docker:
```bash
docker build -t smarttracking-backend .
docker run -d --name smarttracking-backend -p 8080:80 \
  --add-host=host.docker.internal:host-gateway \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ASPNETCORE_URLS="http://+:80" \
  smarttracking-backend
```

## 👥 Default Accounts

The system comes with pre-configured accounts:

- **Admin Account**
  - Email: admin@parcel.com
  - Password: admin123

- **Handler Account**
  - Email: handler@parcel.com
  - Password: handler123

## 📱 API Endpoints

The backend API is available at `http://localhost:8080` with the following main endpoints:

- `/api/User`: User management
- `/api/Shipment`: Shipment operations
- `/api/Admin`: Administrative functions
- `/api/Handler`: Handler operations

## 🔒 Environment Variables

Backend (.NET):
```env
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:80
```

Frontend (React):
```env
REACT_APP_API_URL=http://localhost:8080
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 
