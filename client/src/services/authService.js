import api from './api';

const authService = {
  /**
   * Register a new account
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response?.token) {
      try {
        localStorage.setItem('promotehub_token', response.token);
      } catch (e) {}
    }
    return response?.data || response;
  },

  /**
   * Login with email and password
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response?.token) {
      try {
        localStorage.setItem('promotehub_token', response.token);
      } catch (e) {}
    }
    return response?.data || response;
  },

  /**
   * Logout user and clear session cookie
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      try {
        localStorage.removeItem('promotehub_token');
      } catch (e) {}
    }
  },

  /**
   * Verify session and retrieve current authenticated user
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response?.data || response;
  }
};

export default authService;
