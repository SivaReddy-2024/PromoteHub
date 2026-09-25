import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const CATEGORIES = [
  'All',
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

const CampaignFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  showStatusFilter = false,
  onReset
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search campaigns by keyword, product, or offer..."
          className="block w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Select */}
      <div className="sm:w-48">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="block w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter (Optional for management screens) */}
      {showStatusFilter && onStatusChange && (
        <div className="sm:w-40">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="block w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {/* Clear Filters Button */}
      {(search || (category && category !== 'All') || (status && status !== 'all')) && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-brand-600 px-2 py-2 transition-colors flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
};

export default CampaignFilters;
