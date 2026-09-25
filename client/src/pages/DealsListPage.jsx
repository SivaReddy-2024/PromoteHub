import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, Tag, Sparkles, X, ShieldCheck } from 'lucide-react';
import hubService from '../services/hubService';
import DealCard from '../components/deals/DealCard';
import SEO from '../components/common/SEO';
import { DealCardSkeleton } from '../components/common/SkeletonLoader';

const DealsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All');
  const [minDiscount, setMinDiscount] = useState(searchParams.get('minDiscount') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'popular');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Mobile filter drawer
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, brs] = await Promise.all([
          hubService.getCategories(),
          hubService.getBrands({ limit: 50 })
        ]);
        setCategories(cats || []);
        setBrands(brs?.brands || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          brand: selectedBrand !== 'All' ? selectedBrand : undefined,
          minDiscount: minDiscount || undefined,
          sortBy,
          verified: onlyVerified ? true : undefined,
          search: searchQuery || undefined,
          isHot: searchParams.get('isHot') === 'true' ? true : undefined
        };

        const data = await hubService.getDeals(params);
        setDeals(data.deals || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [selectedCategory, selectedBrand, minDiscount, sortBy, onlyVerified, searchQuery, searchParams]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMinDiscount('');
    setSortBy('popular');
    setOnlyVerified(false);
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title="Today's Best Deals & Offers in India"
        description="Browse thousands of verified deals, price drops, and exclusive offers with high discounts across Electronics, Fashion, Mobiles, and more."
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
            <Tag className="w-3.5 h-3.5" />
            <span>Today's Marketplace Deals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
            Discover Live Deals & Price Drops
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Verified offers checked within the last 2 hours. Click to claim instant merchant discounts.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="discount">Highest Discount</option>
              <option value="ending">Ending Soon</option>
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar Filters + Deal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters Desktop */}
        <aside className={`md:block ${filterDrawerOpen ? 'block' : 'hidden'} md:col-span-1 space-y-6 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm self-start`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-600" />
              <span>Filters</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-brand-600 hover:text-brand-700"
            >
              Reset All
            </button>
          </div>

          {/* Search inside deals */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Search Deals</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Product or brand..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-brand-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Category</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
              <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="cat_filter"
                  checked={selectedCategory === 'All'}
                  onChange={() => setSelectedCategory('All')}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <span className={selectedCategory === 'All' ? 'font-bold text-brand-600' : 'text-slate-600'}>
                  All Categories
                </span>
              </label>
              {categories.map((c) => (
                <label key={c.slug} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="cat_filter"
                    checked={selectedCategory.toLowerCase() === c.name.toLowerCase()}
                    onChange={() => setSelectedCategory(c.name)}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span className={selectedCategory.toLowerCase() === c.name.toLowerCase() ? 'font-bold text-brand-600' : 'text-slate-600'}>
                    {c.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Brand / Store</label>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1 text-xs">
              <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="brand_filter"
                  checked={selectedBrand === 'All'}
                  onChange={() => setSelectedBrand('All')}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <span className={selectedBrand === 'All' ? 'font-bold text-brand-600' : 'text-slate-600'}>
                  All Brands
                </span>
              </label>
              {brands.map((b) => (
                <label key={b.slug} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="brand_filter"
                    checked={selectedBrand.toLowerCase() === b.name.toLowerCase() || selectedBrand.toLowerCase() === b.slug}
                    onChange={() => setSelectedBrand(b.name)}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span className={(selectedBrand.toLowerCase() === b.name.toLowerCase() || selectedBrand.toLowerCase() === b.slug) ? 'font-bold text-brand-600' : 'text-slate-600'}>
                    {b.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Min Discount Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Discount</label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { label: 'Any', val: '' },
                { label: '20%+ Off', val: '20' },
                { label: '40%+ Off', val: '40' },
                { label: '60%+ Off', val: '60' }
              ].map((d) => (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => setMinDiscount(d.val)}
                  className={`py-1.5 px-2 rounded-xl font-bold border transition-colors ${
                    minDiscount === d.val
                      ? 'bg-brand-50 text-brand-600 border-brand-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Deals Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Deals Only
              </span>
            </label>
          </div>
        </aside>

        {/* Deals Grid */}
        <div className="md:col-span-3 space-y-6">
          {/* Active Filter Chips */}
          {(selectedCategory !== 'All' || selectedBrand !== 'All' || minDiscount || onlyVerified || searchQuery) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-400">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
                  {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
                </span>
              )}
              {selectedBrand !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
                  {selectedBrand}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand('All')} />
                </span>
              )}
              {minDiscount && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
                  {minDiscount}%+ Discount
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setMinDiscount('')} />
                </span>
              )}
              {onlyVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  Verified
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setOnlyVerified(false)} />
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <DealCardSkeleton key={n} />
              ))}
            </div>
          ) : deals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal._id || deal.slug} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <Tag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 font-display">No Deals Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any deals matching your current filter combinations. Try adjusting or clearing your filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealsListPage;
