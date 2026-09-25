import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Tag, Ticket, Building2, LayoutGrid, ArrowRight, X } from 'lucide-react';
import hubService from '../services/hubService';
import DealCard from '../components/deals/DealCard';
import CouponCard from '../components/coupons/CouponCard';
import BrandCard from '../components/brands/BrandCard';
import SEO from '../components/common/SEO';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'deals' | 'coupons' | 'brands'

  useEffect(() => {
    setInputVal(query);
    const executeSearch = async () => {
      if (!query || query.trim().length === 0) {
        setResults(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await hubService.search(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    executeSearch();
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  const deals = results?.deals || [];
  const coupons = results?.coupons || [];
  const brands = results?.brands || [];
  const categories = results?.categories || [];
  const totalCount = deals.length + coupons.length + brands.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title={`Search Results for "${query}" | PromoteHub`}
        description={`Find verified deals, coupons, and discounts for ${query}.`}
      />

      {/* Search Bar Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Search for stores, brands, products or coupons..."
          className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-slate-300 text-sm text-slate-800 shadow-md focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none"
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-all"
        >
          Search
        </button>
      </form>

      {/* Search Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
          Search Results for "<span className="text-brand-600">{query}</span>"
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Found {totalCount} matching deals, coupons, and partner brands.
        </p>
      </div>

      {/* Matching Categories Pill row */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400">Matching Categories:</span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-bold transition-colors"
            >
              <span>{c.name}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </Link>
          ))}
        </div>
      )}

      {/* Tabs */}
      {totalCount > 0 && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Results ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'deals'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Deals ({deals.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'coupons'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'brands'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Stores ({brands.length})
          </button>
        </div>
      )}

      {/* Results View */}
      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-slate-400">Searching offers...</div>
      ) : totalCount > 0 ? (
        <div className="space-y-10">
          {(activeTab === 'all' || activeTab === 'deals') && deals.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-600" />
                <span>Deals ({deals.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {deals.map((d) => (
                  <DealCard key={d._id || d.slug} deal={d} />
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'coupons') && coupons.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                <Ticket className="w-4 h-4 text-brand-600" />
                <span>Coupons & Promo Codes ({coupons.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((c) => (
                  <CouponCard key={c._id || c.code} coupon={c} />
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'brands') && brands.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                <span>Matching Stores ({brands.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {brands.map((b) => (
                  <BrandCard key={b._id || b.slug} brand={b} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-800 font-display">
            No Results Found for "{query}"
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn't find any deals or coupons matching that query. Try checking your spelling or search by store name like <strong>Amazon</strong>, <strong>Flipkart</strong>, or <strong>Myntra</strong>.
          </p>
          <div className="pt-2">
            <Link
              to="/deals"
              className="inline-block px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Browse All Active Deals
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
