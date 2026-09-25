const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory
} = require('../controllers/categoryController');

router.route('/')
  .get(getCategories)
  .post(createCategory);

router.route('/:slug')
  .get(getCategoryBySlug)
  .put(updateCategory);

module.exports = router;
