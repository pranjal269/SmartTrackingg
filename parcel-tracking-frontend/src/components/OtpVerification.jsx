import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './Dashboard.css';

const OtpVerification = () => {
  const { shipmentId } = useParams();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(true);
  const [shipment, setShipment] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // First, fetch shipment details
    fetchShipmentDetails();
  }, [shipmentId]);

  const fetchShipmentDetails = async () => {
    try {
      console.log(`Fetching shipment details for shipmentId: ${shipmentId}`);
      setError('');
      
      // First, fetch the shipment details
      const response = await apiClient.get(`/shipment/${shipmentId}`);
      console.log('Shipment data:', response.data);
      setShipment(response.data);
      
      // Then fetch the user details
      try {
        const userResponse = await apiClient.get(`/user/${response.data.userId}`);
        console.log('User data:', userResponse.data);
        setUser(userResponse.data);
      } catch (userErr) {
        console.error('Error fetching user details:', userErr);
        // Continue even if user fetch fails
      }
      
      // Now generate the OTP
      generateOtp();
    } catch (err) {
      console.error('Error fetching shipment details:', err);
      setError('Failed to fetch shipment. Please try again. Error: ' + (err.response?.data?.message || err.message));
      setGenerating(false);
    }
  };

  const generateOtp = async () => {
    try {
      setGenerating(true);
      console.log(`Generating OTP for shipmentId: ${shipmentId}`);
      await apiClient.post(`/shipment/otp/${shipmentId}`);
      setSuccess('OTP has been sent to your email and phone (if provided).');
      setError('');
    } catch (err) {
      console.error('Error generating OTP:', err);
      setError('Failed to generate OTP. Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Send OTP as JSON string
      await apiClient.post(`/shipment/otp/verify/${shipmentId}`, JSON.stringify(otp), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess('Delivery confirmed! Shipment marked as Delivered.');
      
      // Navigate back to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleRegenerateOtp = () => {
    setOtp('');
    setError('');
    setSuccess('');
    generateOtp();
  };

  if (generating && !error) {
    return (
      <div className="modern-dashboard">
        <div className="loading-container">
          <div className="modern-spinner"></div>
          <p>Generating OTP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>OTP Verification</h1>
          <p>Confirm delivery with one-time password</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="modern-btn secondary"
        >
          Back to Dashboard
        </button>
      </div>

      {error && <div className="modern-error"><span>⚠️</span>{error}</div>}
      {success && <div className="success-message-card">
        <div className="success-icon">✅</div>
        <div className="success-content">
          <h3>{success}</h3>
        </div>
      </div>}

      <div className="shipment-form-container">
        <div className="form-card">
          <div className="form-header">
            <h2>Enter Delivery OTP</h2>
            <p>
              {shipment ? (
                user?.phoneNumber 
                  ? `OTP has been sent to your email (${user.email}) and phone (${user.phoneNumber})` 
                  : `OTP has been sent to your email (${user?.email || 'registered email'})`
              ) : (
                'Delivery OTP verification'
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-group">
              <label htmlFor="otp">
                <span className="label-icon">🔐</span>
                Delivery OTP Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="otp-input modern-input"
                style={{ 
                  fontSize: '1.5rem', 
                  textAlign: 'center', 
                  letterSpacing: '0.5rem',
                  fontFamily: 'monospace'
                }}
                required
              />
              <small className="form-hint">
                Enter the 6-digit code exactly as received
              </small>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                disabled={loading || otp.length !== 6 || !shipment}
                className="modern-btn primary large"
              >
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    Verify Delivery
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                onClick={handleRegenerateOtp}
                className="modern-btn secondary large"
                disabled={generating || !shipment}
              >
                {generating ? (
                  <>
                    <div className="btn-spinner"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    Resend OTP
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {shipment && (
          <div className="info-card">
            <div className="info-header">
              <h3>📋 Shipment Information</h3>
            </div>
            <div className="info-content">
              <div className="info-step">
                <div className="step-icon">ℹ️</div>
                <div className="step-text">
                  <h4>Tracking ID: {shipment?.trackingId || 'N/A'}</h4>
                  <p>For: {shipment?.recipientName || 'Recipient'}</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-icon">📱</div>
                <div className="step-text">
                  <h4>OTP Delivery</h4>
                  <p>Check both your email and SMS (if phone number provided)</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-icon">⏱️</div>
                <div className="step-text">
                  <h4>Time Sensitive</h4>
                  <p>The OTP is valid for a limited time only</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-icon">🔄</div>
                <div className="step-text">
                  <h4>Need a new code?</h4>
                  <p>Click "Resend OTP" to generate a fresh code</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpVerification; 