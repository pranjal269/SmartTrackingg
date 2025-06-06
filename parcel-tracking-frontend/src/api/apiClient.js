import axios from 'axios';

// Configure your ngrok URL here (replace with your actual ngrok URL)
const NGROK_URL = 'https://f737-103-180-214-187.ngrok-free.app/api'; // Make sure to include /api path
const AZURE_URL = 'https://smart-tracking-backend.azurewebsites.net/api';

// Use ngrok for development and Azure as fallback
const getApiBaseUrl = () => {
  // For local development or testing with ngrok
  if (NGROK_URL && NGROK_URL !== 'YOUR_NGROK_URL') {
    return NGROK_URL;
  }
  
  // Fallback to Azure for production
  return AZURE_URL;
};

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    if (config.data) {
      console.log('Request Data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    console.log('Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient; 
