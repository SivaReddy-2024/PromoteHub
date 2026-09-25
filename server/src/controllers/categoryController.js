const Category = require('../models/Category');
const Deal = require('../models/Deal');
const Coupon = require('../models/Coupon');
const Brand = require('../models/Brand');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @desc Get all categories
 * @route GET /api/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 }).lean();

    // Dynamically enrich offer counts if needed
    return sendSuccess(res, 200, 'Categories retrieved successfully', { categories });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single category by slug with deals, coupons & top brands
 * @route GET /api/categories/:slug
 */
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug: slug.toLowerCase() }).lean();

    if (!category) {
      return sendError(res, 404, 'Category not found');
    }

    const [deals, coupons, brands] = await Promise.all([
      Deal.find({ category: new RegExp(`^${category.name}$`, 'i'), status: 'active' })
        .sort({ discountPercentage: -1 })
        .limit(12)
        .lean(),
      Coupon.find({ category: new RegExp(`^${category.name}$`, 'i'), status: 'active' })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Brand.find({ category: new RegExp(`^${category.name}$`, 'i') })
        .limit(8)
        .lean()
    ]);

    return sendSuccess(res, 200, 'Category details retrieved', {
      category,
      deals,
      coupons,
      brands
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create category
 * @route POST /api/categories
 */
const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return sendSuccess(res, 201, 'Category created successfully', { category });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update category
 * @route PUT /api/categories/:id
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!category) {
      return sendError(res, 404, 'Category not found');
    }

    return sendSuccess(res, 200, 'Category updated successfully', { category });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory
};
