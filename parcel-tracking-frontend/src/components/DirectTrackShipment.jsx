import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './Dashboard.css';

const DirectTrackShipment = () => {
  const { trackingId } = useParams();
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipment = async () => {
      if (!trackingId) {
        setError('No tracking ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/shipment/tracking/${trackingId}`);
        setShipment(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Shipment not found. Please check your tracking ID.');
        } else {
          setError(err.response?.data?.message || 'An error occurred while tracking the shipment.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [trackingId]);

  if (loading) {
    return (
      <div className="modern-dashboard">
        <div className="dashboard-hero">
          <div className="hero-content">
            <h1>🔍 Tracking Shipment</h1>
            <p>Loading details for {trackingId}</p>
          </div>
        </div>
        <div className="tracking-loading">
          <div className="loading-animation">
            <div className="package-icon">📦</div>
            <div className="loading-text">
              <h3>Loading shipment details...</h3>
              <p>Please wait while we retrieve your package information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modern-dashboard">
        <div className="dashboard-hero gradient-hero">
          <div className="hero-content">
            <h1>❌ Tracking Error</h1>
            <p>There was a problem finding your shipment</p>
          </div>
        </div>
        <div className="modern-error">
          <span>⚠️</span>
          {error}
        </div>
        <div className="help-section">
          <div className="help-card">
            <h3>💡 Need Help?</h3>
            <div className="help-tips">
              <div className="tip">
                <span className="tip-icon">✓</span>
                <span>Make sure you've entered the correct tracking ID</span>
              </div>
              <div className="tip">
                <span className="tip-icon">✓</span>
                <span>Tracking IDs are usually in the format PT-XXXX-XXXXXX</span>
              </div>
              <div className="tip">
                <span className="tip-icon">✓</span>
                <span>Try again or contact customer support if you continue to have issues</span>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/track-shipment" className="modern-btn primary">
                Try Manual Tracking
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      <div className="dashboard-hero gradient-hero">
        <div className="hero-content">
          <h1>📦 Shipment Details</h1>
          <p>Showing details for tracking ID: <strong>{trackingId}</strong></p>
        </div>
        <Link to="/track-shipment" className="modern-btn secondary">
          Track Another Shipment
        </Link>
      </div>

      {shipment && (
        <div className="tracking-results">
          {/* Status Card */}
          <div className="status-card">
            <div className={`status-indicator ${shipment.status.toLowerCase().replace(' ', '-')}`}>
              <div className="status-icon">
                {shipment.status === 'Delivered' ? '🎯' : shipment.status === 'In Transit' ? '🚚' : '📦'}
              </div>
              <div className="status-text">
                <h4>{shipment.status}</h4>
                <p>
                  {shipment.status === 'Delivered' 
                    ? 'Your package has been successfully delivered to the recipient.'
                    : shipment.status === 'In Transit'
                    ? 'Your package is on its way to the destination.'
                    : 'Your package is being processed.'}
                </p>
              </div>
            </div>
            
            {/* Timeline */}
            <div className="timeline-container">
              <h3>📋 Tracking Progress</h3>
              <div className="modern-timeline">
                <div className="timeline-node completed">
                  <div className="node-icon">📦</div>
                  <div className="node-content">
                    <h4>Package Created</h4>
                    <p>{new Date(shipment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className={`timeline-connector ${shipment.status !== 'Pending' ? 'active' : ''}`}></div>
                
                <div className={`timeline-node ${shipment.status !== 'Pending' ? 'completed' : 'pending'}`}>
                  <div className="node-icon">🚚</div>
                  <div className="node-content">
                    <h4>In Transit</h4>
                    <p>{shipment.status !== 'Pending' ? 'Package is on its way' : 'Waiting to be dispatched'}</p>
                  </div>
                </div>
                
                <div className={`timeline-connector ${shipment.status === 'Delivered' ? 'active' : ''}`}></div>
                
                <div className={`timeline-node ${shipment.status === 'Delivered' ? 'completed' : 'pending'}`}>
                  <div className="node-icon">🎯</div>
                  <div className="node-content">
                    <h4>Delivered</h4>
                    <p>{shipment.status === 'Delivered' ? 'Package delivered successfully' : 'Waiting for delivery'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Details and QR */}
          <div className="details-qr-container">
            {/* Shipment Details */}
            <div className="detail-card">
              <h3>📋 Shipment Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">🏷️ Tracking ID:</span>
                  <span className="detail-value">{shipment.trackingId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👤 Recipient:</span>
                  <span className="detail-value">{shipment.recipientName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📍 Delivery Address:</span>
                  <span className="detail-value">{shipment.deliveryAddress}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📦 Package Type:</span>
                  <span className="detail-value">{shipment.packageType || 'Standard'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">⚖️ Weight:</span>
                  <span className="detail-value">{shipment.weight} kg</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📅 Created:</span>
                  <span className="detail-value">{new Date(shipment.createdAt).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📍 Current Location:</span>
                  <span className="detail-value">{shipment.currentAddress || 'Processing Facility'}</span>
                </div>
                {shipment.specialInstructions && (
                  <div className="detail-item special-instructions">
                    <span className="detail-label">⚠️ Special Instructions:</span>
                    <span className="detail-value">{shipment.specialInstructions}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* QR Code */}
            {shipment.qrCodeImage && (
              <div className="qr-card">
                <h3>🔍 Quick Access</h3>
                <div className="qr-content">
                  <img 
                    src={`data:image/png;base64,${shipment.qrCodeImage}`}
                    alt="Shipment QR Code"
                    className="qr-image"
                  />
                  <div className="qr-info">
                    <h4>Scan QR Code</h4>
                    <p>Scan this QR code with your phone camera to quickly access shipment tracking details</p>
                    <div className="qr-sharing">
                      <button className="share-btn" onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Tracking link copied to clipboard!');
                      }}>
                        📋 Copy Tracking Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Delivered Success Message */}
          {shipment.status === 'Delivered' && (
            <div className="success-message-card">
              <div className="success-icon">✅</div>
              <div className="success-content">
                <h3>Package Successfully Delivered!</h3>
                <p>Your package has been delivered to the recipient. Thank you for using our service!</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DirectTrackShipment; 