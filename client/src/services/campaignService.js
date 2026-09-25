import api from './api';

const campaignService = {
  /**
   * Fetch public campaigns with filters, search, and pagination
   */
  async getPublicCampaigns(params = {}) {
    const response = await api.get('/campaigns', { params });
    return response.data;
  },

  /**
   * Fetch single campaign details by ID
   */
  async getCampaignById(id) {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  /**
   * Fetch logged-in user's campaigns
   */
  async getUserCampaigns(params = {}) {
    const response = await api.get('/campaigns/user/my', { params });
    return response.data;
  },

  /**
   * Fetch logged-in user's campaign statistics for dashboard
   */
  async getUserCampaignStats() {
    const response = await api.get('/campaigns/user/stats');
    return response.data;
  },

  /**
   * Create a new campaign
   */
  async createCampaign(campaignData) {
    const response = await api.post('/campaigns', campaignData);
    return response.data;
  },

  /**
   * Update an existing campaign (owner only)
   */
  async updateCampaign(id, campaignData) {
    const response = await api.put(`/campaigns/${id}`, campaignData);
    return response.data;
  },

  /**
   * Delete a campaign (owner only)
   */
  async deleteCampaign(id) {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  }
};

export default campaignService;
