import axios from 'axios';

/**
 * Centralized Axios API instance with credentials enabled for HttpOnly cookies
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Crucial for sending & receiving HttpOnly cookies across origins
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Request interceptor to attach Authorization Bearer token if present
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('promotehub_token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // LocalStorage access might be restricted in some iframe contexts
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to normalize error payloads
api.interceptors.response.use(
  (response) => {
    // Return standard response body
    return response.data;
  },
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    let validationErrors = [];

    if (error.response) {
      const data = error.response.data;
      if (data && data.message) {
        message = data.message;
      }
      if (data && data.errors && Array.isArray(data.errors)) {
        validationErrors = data.errors;
      }
    } else if (error.request) {
      message = 'Unable to reach PromoteHub servers. Please check your network connection.';
    }

    const enhancedError = new Error(message);
    enhancedError.status = error.response ? error.response.status : 500;
    enhancedError.validationErrors = validationErrors;
    enhancedError.raw = error;

    return Promise.reject(enhancedError);
  }
);

export default api;
