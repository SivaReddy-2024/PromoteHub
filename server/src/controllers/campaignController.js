const campaignService = require('../services/campaignService');
const { successResponse } = require('../utils/apiResponse');

/**
 * @desc    Get public active campaigns with filters and search
 * @route   GET /api/campaigns
 * @access  Public
 */
const getCampaigns = async (req, res, next) => {
  try {
    const result = await campaignService.getPublicCampaigns(req.query);
    return successResponse(res, 'Campaigns retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single campaign details by ID
 * @route   GET /api/campaigns/:id
 * @access  Public (Owner gets special access to drafts)
 */
const getCampaignById = async (req, res, next) => {
  try {
    const currentUserId = req.user ? req.user._id : null;
    const campaign = await campaignService.getCampaignById(req.params.id, currentUserId);
    return successResponse(res, 'Campaign details retrieved', { campaign });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's owned campaigns
 * @route   GET /api/campaigns/user/my
 * @access  Protected
 */
const getMyCampaigns = async (req, res, next) => {
  try {
    const result = await campaignService.getUserCampaigns(req.user._id, req.query);
    return successResponse(res, 'Your campaigns retrieved', result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics and recent campaigns for current user
 * @route   GET /api/campaigns/user/stats
 * @access  Protected
 */
const getMyCampaignStats = async (req, res, next) => {
  try {
    const data = await campaignService.getUserCampaignStats(req.user._id);
    return successResponse(res, 'Campaign statistics retrieved', data);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new campaign
 * @route   POST /api/campaigns
 * @access  Protected
 */
const createCampaign = async (req, res, next) => {
  try {
    const campaign = await campaignService.createCampaign(req.user._id, req.body);
    return successResponse(res, 'Campaign created successfully', { campaign }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a campaign
 * @route   PUT /api/campaigns/:id
 * @access  Protected (Owner only)
 */
const updateCampaign = async (req, res, next) => {
  try {
    const campaign = await campaignService.updateCampaign(
      req.params.id,
      req.user._id,
      req.body
    );
    return successResponse(res, 'Campaign updated successfully', { campaign });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a campaign
 * @route   DELETE /api/campaigns/:id
 * @access  Protected (Owner only)
 */
const deleteCampaign = async (req, res, next) => {
  try {
    await campaignService.deleteCampaign(req.params.id, req.user._id);
    return successResponse(res, 'Campaign deleted successfully', {});
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCampaigns,
  getCampaignById,
  getMyCampaigns,
  getMyCampaignStats,
  createCampaign,
  updateCampaign,
  deleteCampaign
};
