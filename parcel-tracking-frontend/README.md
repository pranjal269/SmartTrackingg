# 📦 SmartTracking Frontend

A modern React-based frontend for the SmartTracking parcel management system. This application provides an intuitive interface for tracking parcels, managing shipments, and handling deliveries.

## 🛠️ Technologies

- **React**: Modern UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Material-UI**: UI component library
- **Chart.js**: Data visualization
- **QR Code Scanner**: Parcel verification

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser
- Backend API running (see backend setup)

## 🔧 Installation

1. **Install Dependencies**:
```bash
npm install
```

2. **Configure Environment**:
Create `.env` file in the project root:
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_QR_SCANNER_DELAY=500
```

3. **Start Development Server**:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── api/          # API client and endpoints
├── components/   # React components
├── contexts/     # React contexts
├── hooks/        # Custom hooks
├── pages/        # Page components
├── styles/       # CSS and styling
└── utils/        # Utility functions
```

## 📱 Available Routes

### Public Routes
- `/`: Home page
- `/track/:trackingId`: Public tracking page
- `/login`: User login
- `/register`: User registration

### User Routes
- `/dashboard`: User dashboard
- `/shipments`: User's shipments
- `/create-shipment`: Create new shipment

### Handler Routes
- `/handler-login`: Handler login
- `/handler-dashboard`: Handler dashboard
- `/scan-qr`: QR code scanner
- `/verify-otp`: OTP verification

### Admin Routes
- `/admin-login`: Admin login
- `/admin-dashboard`: Admin dashboard
- `/manage-users`: User management
- `/manage-shipments`: Shipment management
- `/analytics`: System analytics

## 🎨 Features

### User Features
- Create and track shipments
- View shipment history
- Receive QR codes for verification
- Get email and SMS notifications

### Handler Features
- Scan QR codes for verification
- Update shipment status
- Generate and verify OTPs
- Update current location

### Admin Features
- View system analytics
- Manage users and roles
- Monitor all shipments
- Access system logs

## 🔒 Security

- Role-based access control
- Protected routes
- Session management
- Input validation
- XSS protection

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run with coverage:
```bash
npm test -- --coverage
```

## 🚀 Build for Production

Create production build:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 📚 Component Documentation

Key components include:

### TrackShipment
```jsx
<TrackShipment trackingId={id} />
```
Displays shipment tracking information.

### QRScanner
```jsx
<QRScanner onScan={handleScan} />
```
Handles QR code scanning for verification.

### ShipmentForm
```jsx
<ShipmentForm onSubmit={handleSubmit} />
```
Creates new shipments.

## 🔍 State Management

- React Context for global state
- Local state for component-specific data
- Session storage for user data
- Local storage for preferences

## 🎨 Styling

- Material-UI components
- Custom CSS modules
- Responsive design
- Theme customization

## 🌐 API Integration

The frontend communicates with the backend API using:
- Axios for HTTP requests
- JWT for authentication
- Error handling middleware
- Request/response interceptors

## ⚙️ Configuration

Key configuration options:
- API endpoint
- QR scanner settings
- Route configurations
- Theme settings

## 📈 Performance

Optimizations include:
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

## 🚀 Deployment

1. Build the application
2. Configure environment variables
3. Set up static file serving
4. Configure routing rules
5. Enable HTTPS
6. Set up monitoring 