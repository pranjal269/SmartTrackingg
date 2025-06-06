import axios from 'axios';

// Configure your ngrok URL here (replace with your actual ngrok URL)
const NGROK_URL = 'https://f63e-103-180-214-187.ngrok-free.app/api'; // Example: 'https://a1b2-c3d4-e5f6.ngrok-free.app/api'
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
  headers: { 'Content-Type': 'application/json' }
});

// Set the base URL dynamically for each request
apiClient.interceptors.request.use(config => {
  // Set baseURL for each request
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
