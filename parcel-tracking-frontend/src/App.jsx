import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateShipment from './components/CreateShipment';
import TrackShipment from './components/TrackShipment';
import DirectTrackShipment from './components/DirectTrackShipment';
import OtpVerification from './components/OtpVerification';
import HandlerLogin from './components/HandlerLogin';
import HandlerDashboard from './components/HandlerDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  return userId ? children : <Navigate to="/login" replace />;
};

// Handler Protected Route Component
const HandlerProtectedRoute = ({ children }) => {
  const handlerUser = localStorage.getItem('handlerUser');
  const userRole = localStorage.getItem('userRole');
  return handlerUser && userRole === 'handler' ? children : <Navigate to="/handler-login" replace />;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const adminUser = localStorage.getItem('adminUser');
  const userRole = localStorage.getItem('userRole');
  return adminUser && userRole === 'admin' ? children : <Navigate to="/admin-login" replace />;
};

// Navigation Component
const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // Don't show navigation on special login pages or admin/handler dashboards
  if (location.pathname === '/login' || 
      location.pathname === '/register' || 
      location.pathname === '/handler-login' ||
      location.pathname === '/admin-login' ||
      location.pathname === '/handler-dashboard' ||
      location.pathname === '/admin-dashboard') {
    return null;
  }

  return (
    <nav className="modern-navbar">
      <div className="container">
        <div className="navbar-brand">
          <div className="logo-icon">📦</div>
          <h1>SmartTracking</h1>
        </div>
        <div className="navbar-menu">
          <div className="nav-links">
            <Link to="/track-shipment" className="nav-link">
              <span className="nav-icon">🔍</span>
              Track Shipment
            </Link>
            {userId && (
              <>
                <Link to="/dashboard" className="nav-link">
                  <span className="nav-icon">📊</span>
                  Dashboard
                </Link>
                <Link to="/create-shipment" className="nav-link">
                  <span className="nav-icon">➕</span>
                  Create Shipment
                </Link>
              </>
            )}
            {!userId && (
              <>
                <Link to="/login" className="nav-link">
                  <span className="nav-icon">🔑</span>
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  <span className="nav-icon">📝</span>
                  Register
                </Link>
                <div className="divider"></div>
                <Link to="/handler-login" className="nav-link">
                  <span className="nav-icon">👷</span>
                  Handler
                </Link>
                <Link to="/admin-login" className="nav-link">
                  <span className="nav-icon">👨‍💼</span>
                  Admin
                </Link>
              </>
            )}
          </div>
          {userId && (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-icon">👤</span>
                <span className="user-name">{userName}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  const userId = localStorage.getItem('userId');

  return (
    <div className="App">
      <Navigation />
      <div className="container">
        <Routes>
          {/* Regular User Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track-shipment" element={<TrackShipment />} />
          <Route path="/track/:trackingId" element={<DirectTrackShipment />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-shipment" 
            element={
              <ProtectedRoute>
                <CreateShipment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/otp-verification/:shipmentId" 
            element={
              <ProtectedRoute>
                <OtpVerification />
              </ProtectedRoute>
            } 
          />

          {/* Handler Routes */}
          <Route path="/handler-login" element={<HandlerLogin />} />
          <Route 
            path="/handler-dashboard" 
            element={
              <HandlerProtectedRoute>
                <HandlerDashboard />
              </HandlerProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />

          {/* Default Routes */}
          <Route 
            path="/" 
            element={
              userId ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="*" 
            element={
              userId ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App; 