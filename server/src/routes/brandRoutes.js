const express = require('express');
const router = express.Router();
const {
  getBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');

router.route('/')
  .get(getBrands)
  .post(createBrand);

router.route('/:slug')
  .get(getBrandBySlug)
  .put(updateBrand)
  .delete(deleteBrand);

module.exports = router;
