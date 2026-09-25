const Campaign = require('../models/Campaign');
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../constants/campaignConstants');

class CampaignService {
  /**
   * Get public campaigns with filtering, search, and pagination
   */
  async getPublicCampaigns({
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    status = 'active',
    category,
    search,
    sortBy = 'createdAt',
    order = 'desc'
  }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(limit, 10) || DEFAULT_PAGE_SIZE));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    // Filter by status (public view defaults to active, or allows filtering if specific)
    if (status) {
      query.status = status;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search query across title and description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { promotionalContent: searchRegex }
      ];
    }

    const sortOption = {};
    sortOption[sortBy] = order === 'asc' ? 1 : -1;

    const [campaigns, total] = await Promise.all([
      Campaign.find(query)
        .populate('user', 'name avatar company')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Campaign.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
      campaigns,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    };
  }

  /**
   * Get single campaign details by ID
   */
  async getCampaignById(campaignId, currentUserId = null) {
    const campaign = await Campaign.findById(campaignId)
      .populate('user', 'name email avatar company bio')
      .lean();

    if (!campaign) {
      const error = new Error('Campaign not found');
      error.statusCode = 404;
      throw error;
    }

    // If campaign is not active and requester is not the creator, restrict access
    const isOwner = currentUserId && campaign.user._id.toString() === currentUserId.toString();
    if (campaign.status === 'draft' && !isOwner) {
      const error = new Error('You do not have permission to view this draft campaign');
      error.statusCode = 403;
      throw error;
    }

    return {
      ...campaign,
      isOwner: Boolean(isOwner)
    };
  }

  /**
   * Get campaigns created by a specific user with pagination & status filter
   */
  async getUserCampaigns(userId, { page = 1, limit = 20, status, search }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const query = { user: userId };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    const [campaigns, total] = await Promise.all([
      Campaign.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Campaign.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
      campaigns,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    };
  }

  /**
   * Get aggregate metrics for authenticated user's campaigns
   */
  async getUserCampaignStats(userId) {
    const statsResult = await Campaign.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stats = {
      total: 0,
      active: 0,
      draft: 0,
      paused: 0,
      completed: 0
    };

    statsResult.forEach((item) => {
      stats.total += item.count;
      if (stats[item._id] !== undefined) {
        stats[item._id] = item.count;
      }
    });

    // Also get the 5 most recent campaigns for the dashboard preview
    const recentCampaigns = await Campaign.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return {
      stats,
      recentCampaigns
    };
  }

  /**
   * Create a new campaign for authenticated user
   */
  async createCampaign(userId, campaignData) {
    const campaign = await Campaign.create({
      ...campaignData,
      user: userId // Enforce server-side ownership
    });

    return campaign;
  }

  /**
   * Update an existing campaign (strictly owner-authorized)
   */
  async updateCampaign(campaignId, userId, updateData) {
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      const error = new Error('Campaign not found');
      error.statusCode = 404;
      throw error;
    }

    // Ownership verification - cannot modify another user's campaign
    if (campaign.user.toString() !== userId.toString()) {
      const error = new Error('Not authorized to modify this campaign');
      error.statusCode = 403;
      throw error;
    }

    // Prevent client from overwriting user field
    delete updateData.user;

    Object.assign(campaign, updateData);
    await campaign.save();

    return campaign;
  }

  /**
   * Delete an existing campaign (strictly owner-authorized)
   */
  async deleteCampaign(campaignId, userId) {
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      const error = new Error('Campaign not found');
      error.statusCode = 404;
      throw error;
    }

    // Ownership verification - cannot delete another user's campaign
    if (campaign.user.toString() !== userId.toString()) {
      const error = new Error('Not authorized to delete this campaign');
      error.statusCode = 403;
      throw error;
    }

    await Campaign.findByIdAndDelete(campaignId);
    return true;
  }
}

module.exports = new CampaignService();
