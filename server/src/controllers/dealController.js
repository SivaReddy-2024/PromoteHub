const Deal = require('../models/Deal');
const Brand = require('../models/Brand');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @desc Get all deals with filtering, search, sorting & pagination
 * @route GET /api/deals
 */
const getDeals = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      status = 'active',
      isHot,
      isFlash,
      featured,
      verified,
      minDiscount,
      sortBy = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (brand && brand !== 'All') {
      query.$or = [
        { brandName: new RegExp(brand, 'i') },
        { brandSlug: brand.toLowerCase() }
      ];
    }

    if (isHot === 'true' || isHot === true) query.isHot = true;
    if (isFlash === 'true' || isFlash === true) query.isFlash = true;
    if (featured === 'true' || featured === true) query.featured = true;
    if (verified === 'true' || verified === true) query.verified = true;

    if (minDiscount) {
      query.discountPercentage = { $gte: Number(minDiscount) };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { brandName: searchRegex },
        { couponCode: searchRegex }
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'popular') sortOptions = { clicks: -1 };
    else if (sortBy === 'discount') sortOptions = { discountPercentage: -1 };
    else if (sortBy === 'ending') sortOptions = { expiryDate: 1 };
    else if (sortBy === 'price_low') sortOptions = { dealPrice: 1 };
    else if (sortBy === 'price_high') sortOptions = { dealPrice: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [deals, total] = await Promise.all([
      Deal.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Deal.countDocuments(query)
    ]);

    return sendSuccess(res, 200, 'Deals retrieved successfully', {
      deals,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single deal by slug or ID
 * @route GET /api/deals/:identifier
 */
const getDealByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let deal = null;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      deal = await Deal.findById(identifier);
    }
    if (!deal) {
      deal = await Deal.findOne({ slug: identifier });
    }

    if (!deal) {
      return sendError(res, 404, 'Deal not found');
    }

    // Increment click/view
    deal.clicks = (deal.clicks || 0) + 1;
    await deal.save();

    // Fetch related deals in same category
    const relatedDeals = await Deal.find({
      category: deal.category,
      _id: { $ne: deal._id },
      status: 'active'
    })
      .limit(4)
      .lean();

    return sendSuccess(res, 200, 'Deal details retrieved', {
      deal,
      relatedDeals
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create deal
 * @route POST /api/deals
 */
const createDeal = async (req, res, next) => {
  try {
    const dealData = { ...req.body };
    if (!dealData.slug && dealData.title) {
      dealData.slug =
        dealData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-') +
        '-' +
        Date.now().toString().slice(-4);
    }
    if (!dealData.brandSlug && dealData.brandName) {
      dealData.brandSlug = dealData.brandName.toLowerCase().replace(/\s+/g, '-');
    }
    if (dealData.originalPrice && dealData.dealPrice) {
      dealData.savingsAmount = Math.max(0, dealData.originalPrice - dealData.dealPrice);
    }
    if (req.user) {
      dealData.user = req.user._id;
    }

    const deal = await Deal.create(dealData);

    // Update brand offers count
    await Brand.findOneAndUpdate(
      { slug: deal.brandSlug },
      { $inc: { activeOffersCount: 1 } }
    );

    return sendSuccess(res, 210, 'Deal created successfully', { deal });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update deal
 * @route PUT /api/deals/:id
 */
const updateDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.originalPrice && updateData.dealPrice) {
      updateData.savingsAmount = Math.max(0, updateData.originalPrice - updateData.dealPrice);
    }

    const deal = await Deal.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!deal) {
      return sendError(res, 404, 'Deal not found');
    }

    return sendSuccess(res, 200, 'Deal updated successfully', { deal });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete deal
 * @route DELETE /api/deals/:id
 */
const deleteDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByIdAndDelete(id);

    if (!deal) {
      return sendError(res, 404, 'Deal not found');
    }

    return sendSuccess(res, 200, 'Deal deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Outbound redirect / Click tracking
 * @route POST /api/deals/:id/track-click
 */
const trackClick = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!deal) {
      return sendError(res, 404, 'Deal not found');
    }

    return sendSuccess(res, 200, 'Click recorded', {
      redirectUrl: deal.affiliateUrl || deal.merchantUrl,
      clicks: deal.clicks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDeals,
  getDealByIdentifier,
  createDeal,
  updateDeal,
  deleteDeal,
  trackClick
};
