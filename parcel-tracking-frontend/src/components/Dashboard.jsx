import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './Dashboard.css';

const Dashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retries, setRetries] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    // Validate user is logged in
    if (!userId) {
      console.error('No userId found in localStorage, redirecting to login');
      navigate('/login');
      return;
    }
    
    console.log('Dashboard mounted, userId:', userId, 'userName:', userName);
    fetchShipments();
  }, [userId, navigate]);

  const fetchShipments = async () => {
    if (!userId) {
      console.error('Cannot fetch shipments: No userId available');
      setError('You need to be logged in to view shipments');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`Fetching shipments for user ID: ${userId}`);
      const response = await apiClient.get(`/shipment/user/${userId}`);
      console.log('Shipments response:', response.data);
      setShipments(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching shipments:', err);
      console.error('Request URL:', err.config?.baseURL + err.config?.url);
      console.error('Response:', err.response?.data);
      
      // Handle unauthorized errors by redirecting to login
      if (err.response?.status === 401) {
        console.log('Unauthorized access, redirecting to login');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        navigate('/login');
        return;
      }
      
      // If we get a network error or 5xx error, retry up to 3 times
      if (!err.response || err.response.status >= 500) {
        if (retries < 3) {
          const nextRetry = retries + 1;
          setRetries(nextRetry);
          console.log(`Retrying shipment fetch (${nextRetry}/3) in 2 seconds...`);
          
          setTimeout(() => {
            fetchShipments();
          }, 2000);
          
          setError(`Connection issue. Retrying... (${nextRetry}/3)`);
        } else {
          setError('Failed to fetch shipments after multiple attempts. Please refresh the page or try again later.');
        }
      } else {
        setError('Failed to fetch shipments. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverOtp = async (shipmentId) => {
    try {
      setLoading(true);
      console.log(`Generating OTP for shipment ID: ${shipmentId}`);
      const response = await apiClient.post(`/shipment/otp/${shipmentId}`);
      console.log('OTP generation response:', response.data);
      
      alert('OTP has been sent to your email and phone (if provided)!');
      navigate(`/otp-verification/${shipmentId}`);
    } catch (err) {
      console.error('Error generating OTP:', err);
      setError(`Failed to generate delivery OTP: ${err.response?.data || err.message}`);
      setTimeout(() => {
        setError(''); // Clear error after 5 seconds
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="modern-dashboard">
        <div className="loading-container">
          <div className="modern-spinner"></div>
          <p>Loading your shipments...</p>
          {retries > 0 && (
            <p className="retry-message">Connection attempt {retries}/3</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>Welcome back, {userName}!</h1>
          <p>Manage and track all your shipments in one place</p>
          <button 
            onClick={() => navigate('/create-shipment')}
            className="hero-btn"
          >
            <span>📦</span>
            Create New Shipment
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">{shipments.length}</div>
            <div className="stat-label">Total Shipments</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{shipments.filter(s => s.status === 'Pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{shipments.filter(s => s.status === 'In Transit').length}</div>
            <div className="stat-label">In Transit</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{shipments.filter(s => s.status === 'Delivered').length}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="modern-error">
          <span>⚠️</span>
          {error}
          {retries > 0 && (
            <button 
              onClick={() => {
                setRetries(0);
                fetchShipments();
              }}
              className="retry-btn"
            >
              Retry Now
            </button>
          )}
        </div>
      )}

      {/* Shipments Section */}
      {shipments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Shipments Yet</h3>
          <p>You haven't created any shipments yet. Start by creating your first shipment!</p>
          <button 
            onClick={() => navigate('/create-shipment')}
            className="modern-btn primary"
          >
            Create Your First Shipment
          </button>
        </div>
      ) : (
        <div className="shipments-section">
          <div className="section-header">
            <h2>Your Shipments</h2>
            <div className="header-actions">
              <button 
                onClick={() => navigate('/track-shipment')}
                className="modern-btn secondary"
              >
                Track Any Shipment
              </button>
            </div>
          </div>

          <div className="shipments-grid">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="shipment-card">
                <div className="card-header">
                  <div className="tracking-info">
                    <h4>{shipment.trackingId}</h4>
                    <span className={`status-badge ${shipment.status.toLowerCase().replace(' ', '-')}`}>
                      {shipment.status}
                    </span>
                  </div>
                  <div className="card-id">#{shipment.id}</div>
                </div>

                <div className="card-content">
                  <div className="recipient-info">
                    <div className="info-item">
                      <span className="label">👤 Recipient:</span>
                      <span className="value">{shipment.recipientName}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">📅 Created:</span>
                      <span className="value">{new Date(shipment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">📍 Address:</span>
                      <span className="value">{shipment.deliveryAddress}</span>
                    </div>
                  </div>

                  {shipment.qrCodeImage && (
                    <div className="qr-section">
                      <h5>QR Code</h5>
                      <img 
                        src={`data:image/png;base64,${shipment.qrCodeImage}`}
                        alt="QR Code"
                        className="qr-code"
                        onClick={() => {
                          const newWindow = window.open();
                          newWindow.document.write(`
                            <html>
                              <head><title>QR Code - ${shipment.trackingId}</title></head>
                              <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f0f0f0;">
                                <img src="data:image/png;base64,${shipment.qrCodeImage}" style="max-width:90%;height:auto;" />
                              </body>
                            </html>
                          `);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  {shipment.status !== 'Delivered' ? (
                    <button
                      onClick={() => handleDeliverOtp(shipment.id)}
                      className="modern-btn primary"
                    >
                      🔐 Generate OTP
                    </button>
                  ) : (
                    <div className="delivered-badge">
                      ✅ Delivered
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 