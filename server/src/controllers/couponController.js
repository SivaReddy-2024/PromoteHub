const Coupon = require('../models/Coupon');
const Brand = require('../models/Brand');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @desc Get all coupons
 * @route GET /api/coupons
 */
const getCoupons = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      status = 'active',
      sortBy = 'popular',
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

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { code: searchRegex },
        { brandName: searchRegex },
        { description: searchRegex }
      ];
    }

    let sortOptions = { copies: -1, clicks: -1 };
    if (sortBy === 'newest') sortOptions = { createdAt: -1 };
    else if (sortBy === 'ending') sortOptions = { expiryDate: 1 };
    else if (sortBy === 'popular') sortOptions = { copies: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [coupons, total] = await Promise.all([
      Coupon.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Coupon.countDocuments(query)
    ]);

    return sendSuccess(res, 200, 'Coupons retrieved successfully', {
      coupons,
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
 * @desc Get single coupon
 * @route GET /api/coupons/:id
 */
const getCouponById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return sendError(res, 404, 'Coupon not found');
    }

    return sendSuccess(res, 200, 'Coupon retrieved', { coupon });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create coupon
 * @route POST /api/coupons
 */
const createCoupon = async (req, res, next) => {
  try {
    const couponData = { ...req.body };
    if (!couponData.brandSlug && couponData.brandName) {
      couponData.brandSlug = couponData.brandName.toLowerCase().replace(/\s+/g, '-');
    }
    if (req.user) {
      couponData.user = req.user._id;
    }

    const coupon = await Coupon.create(couponData);

    await Brand.findOneAndUpdate(
      { slug: coupon.brandSlug },
      { $inc: { couponCount: 1 } }
    );

    return sendSuccess(res, 201, 'Coupon created successfully', { coupon });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update coupon
 * @route PUT /api/coupons/:id
 */
const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!coupon) {
      return sendError(res, 404, 'Coupon not found');
    }

    return sendSuccess(res, 200, 'Coupon updated successfully', { coupon });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete coupon
 * @route DELETE /api/coupons/:id
 */
const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return sendError(res, 404, 'Coupon not found');
    }

    return sendSuccess(res, 200, 'Coupon deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Record coupon code copy
 * @route POST /api/coupons/:id/copy
 */
const recordCopy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { $inc: { copies: 1 } },
      { new: true }
    );

    if (!coupon) {
      return sendError(res, 404, 'Coupon not found');
    }

    return sendSuccess(res, 200, 'Coupon copy recorded', {
      code: coupon.code,
      copies: coupon.copies,
      merchantUrl: coupon.merchantUrl
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  recordCopy
};
