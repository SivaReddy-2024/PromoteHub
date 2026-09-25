import api from './api';

const userService = {
  /**
   * Fetch user profile and campaign count statistics
   */
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  /**
   * Update profile information
   */
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  /**
   * Change user account password
   */
  async changePassword(passwordData) {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  }
};

export default userService;
