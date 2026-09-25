import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LayoutGrid, Tag, Ticket, Building2, ArrowRight, ArrowUpDown, ChevronRight } from 'lucide-react';
import hubService from '../services/hubService';
import DealCard from '../components/deals/DealCard';
import CouponCard from '../components/coupons/CouponCard';
import BrandCard from '../components/brands/BrandCard';
import SEO from '../components/common/SEO';

const CategoryDetailPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [activeTab, setActiveTab] = useState('deals'); // 'deals' | 'coupons' | 'brands'

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await hubService.getCategoryBySlug(slug);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-xs font-semibold">Loading category...</p>
      </div>
    );
  }

  const category = data?.category;
  const deals = data?.deals || [];
  const coupons = data?.coupons || [];
  const brands = data?.brands || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title={`${category?.name || 'Category'} Deals, Coupons & Offers`}
        description={category?.description || `Discover verified discounts in ${category?.name}.`}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/categories" className="hover:text-brand-600">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">{category?.name}</span>
      </nav>

      {/* Header Hero */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-bold border border-white/15">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Category Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display">
            {category?.name} Deals & Offers
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {category?.description}
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
            <span>{deals.length} Active Deals</span>
            <span>•</span>
            <span>{coupons.length} Verified Coupons</span>
            <span>•</span>
            <span>{brands.length} Top Stores</span>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
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
            Stores & Brands ({brands.length})
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="discount">Highest Discount</option>
            <option value="ending">Ending Soon</option>
          </select>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'deals' && (
        deals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal._id || deal.slug} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-xs">
            No live deals in this category currently.
          </div>
        )
      )}

      {activeTab === 'coupons' && (
        coupons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <CouponCard key={coupon._id || coupon.code} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-xs">
            No active coupons in this category currently.
          </div>
        )
      )}

      {activeTab === 'brands' && (
        brands.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <BrandCard key={brand._id || brand.slug} brand={brand} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-xs">
            No stores registered in this category yet.
          </div>
        )
      )}
    </div>
  );
};

export default CategoryDetailPage;
