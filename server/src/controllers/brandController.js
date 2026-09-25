const Brand = require('../models/Brand');
const Deal = require('../models/Deal');
const Coupon = require('../models/Coupon');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @desc Get all brands with alphabetical and category filters
 * @route GET /api/brands
 */
const getBrands = async (req, res, next) => {
  try {
    const { search, category, letter, featured, page = 1, limit = 24 } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (letter && letter !== 'All') {
      query.name = new RegExp(`^${letter}`, 'i');
    }

    if (featured === 'true' || featured === true) {
      query.featured = true;
    }

    if (search && search.trim()) {
      query.name = new RegExp(search.trim(), 'i');
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [brands, total] = await Promise.all([
      Brand.find(query).sort({ featured: -1, name: 1 }).skip(skip).limit(limitNum).lean(),
      Brand.countDocuments(query)
    ]);

    return sendSuccess(res, 200, 'Brands retrieved successfully', {
      brands,
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
 * @desc Get brand by slug with its active deals and coupons
 * @route GET /api/brands/:slug
 */
const getBrandBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const brand = await Brand.findOne({ slug: slug.toLowerCase() }).lean();

    if (!brand) {
      return sendError(res, 404, 'Brand not found');
    }

    const [deals, coupons] = await Promise.all([
      Deal.find({ brandSlug: brand.slug, status: 'active' }).sort({ discountPercentage: -1 }).lean(),
      Coupon.find({ brandSlug: brand.slug, status: 'active' }).sort({ createdAt: -1 }).lean()
    ]);

    return sendSuccess(res, 200, 'Brand details retrieved', {
      brand,
      deals,
      coupons
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create brand
 * @route POST /api/brands
 */
const createBrand = async (req, res, next) => {
  try {
    const brandData = { ...req.body };
    if (!brandData.slug && brandData.name) {
      brandData.slug = brandData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    }

    const brand = await Brand.create(brandData);
    return sendSuccess(res, 201, 'Brand created successfully', { brand });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update brand
 * @route PUT /api/brands/:id
 */
const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!brand) {
      return sendError(res, 404, 'Brand not found');
    }

    return sendSuccess(res, 200, 'Brand updated successfully', { brand });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete brand
 * @route DELETE /api/brands/:id
 */
const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      return sendError(res, 404, 'Brand not found');
    }

    return sendSuccess(res, 200, 'Brand deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand
};
