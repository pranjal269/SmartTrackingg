import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    if (userId) {
      if (userRole === 'Admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'Handler') {
        navigate('/handler-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', formData);
      const response = await apiClient.post('/user/login', formData);
      console.log('Login response:', response.data);
      
      const { user, message } = response.data;

      // Store user data in localStorage
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', `${user.firstName} ${user.lastName}`);
      localStorage.setItem('userRole', user.role);

      // Navigate based on role
      if (user.role === 'Admin') {
        localStorage.setItem('adminUser', JSON.stringify(user));
        navigate('/admin-dashboard');
      } else if (user.role === 'Handler') {
        localStorage.setItem('handlerUser', JSON.stringify(user));
        navigate('/handler-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <span onClick={() => navigate('/register')} className="auth-link">Register here</span>
          </p>
          <div style={{ margin: '10px 0', color: '#bdc3c7' }}>―――――――――――――――――――――</div>
          <p>
            Staff Member? <span onClick={() => navigate('/handler-login')} className="auth-link">Handler Login</span>
          </p>
          <p>
            Administrator? <span onClick={() => navigate('/admin-login')} className="auth-link">Admin Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 