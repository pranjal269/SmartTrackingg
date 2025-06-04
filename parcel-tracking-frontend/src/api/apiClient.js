import axios from 'axios';

// Dynamically determine the API base URL based on current host
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && window.location) {
    const currentHost = window.location.hostname;
    
    // If accessing via network IP, use the same IP for API
    if (currentHost === '192.168.1.6') {
      return 'http://192.168.1.6:8080/api';
    }
  }
  
  // Default to localhost for local development
  return 'http://localhost:8080/api';
};

const apiClient = axios.create({
  headers: { 'Content-Type': 'application/json' }
});

// Set the base URL dynamically for each request
apiClient.interceptors.request.use(config => {
  // Set baseURL for each request to handle dynamic detection
  config.baseURL = getApiBaseUrl();
  
  console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
  
  return config;
});

// Add response interceptor to log responses
apiClient.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    console.error('Request URL:', error.config?.baseURL + error.config?.url);
    return Promise.reject(error);
  }
);

export default apiClient; 