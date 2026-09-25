/**
 * Campaign Constants & Enums
 */
const CAMPAIGN_CATEGORIES = [
  'Technology',
  'E-commerce',
  'Healthcare',
  'Education',
  'Entertainment',
  'Fashion',
  'Finance',
  'Food & Beverage',
  'Travel',
  'Other'
];

const CAMPAIGN_STATUSES = ['draft', 'active', 'paused', 'completed'];

const DEFAULT_PAGE_SIZE = 9;
const MAX_PAGE_SIZE = 50;

module.exports = {
  CAMPAIGN_CATEGORIES,
  CAMPAIGN_STATUSES,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE
};
