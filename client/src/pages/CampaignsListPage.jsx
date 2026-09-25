import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import campaignService from '../services/campaignService';
import { useDebounce } from '../hooks/useDebounce';
import CampaignCard from '../components/campaigns/CampaignCard';
import CampaignFilters from '../components/campaigns/CampaignFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';

const CATEGORY_PILLS = [
  'All',
  'Technology',
  'E-commerce',
  'Healthcare',
  'Entertainment',
  'Fashion',
  'Finance',
  'Food & Beverage'
];

const CampaignsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [campaigns, setCampaigns] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const debouncedSearch = useDebounce(search, 400);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const data = await campaignService.getPublicCampaigns({
        page,
        limit: 9,
        status: 'active',
        category: category !== 'All' ? category : undefined,
        search: debouncedSearch || undefined
      });
      setCampaigns(data.campaigns || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, [page, category, debouncedSearch]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Sync state to URL params for shareable queries
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (category && category !== 'All') params.category = category;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, category, page, setSearchParams]);

  const handleCategorySelect = (selectedCat) => {
    setCategory(selectedCat);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
          <Compass className="w-4 h-4" />
          <span>Marketplace</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Promotional Campaigns
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Discover verified promotional offers, discounts, and brand launches.
        </p>
      </div>

      {/* Category Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_PILLS.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategorySelect(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Category Filter Box */}
      <CampaignFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        category={category}
        onCategoryChange={handleCategorySelect}
        onReset={handleResetFilters}
      />

      {/* Campaigns Grid */}
      {loading ? (
        <LoadingSpinner message="Searching verified campaigns..." />
      ) : campaigns.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing {campaigns.length} of {pagination.total} active promotions
            </span>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp) => (
              <CampaignCard key={camp._id} campaign={camp} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1 px-3 text-xs font-semibold text-slate-700">
                <span>{page}</span> / <span>{pagination.totalPages}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No campaigns found"
          description="We couldn't find any promotional campaigns matching your active filters. Try adjusting your search query or selecting a different category."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
};

export default CampaignsListPage;
