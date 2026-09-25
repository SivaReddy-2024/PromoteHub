import React, { useState, useEffect } from 'react';
import { Ticket, Search, Filter, ShieldCheck, Tag, X } from 'lucide-react';
import hubService from '../services/hubService';
import CouponCard from '../components/coupons/CouponCard';
import SEO from '../components/common/SEO';
import { CouponCardSkeleton } from '../components/common/SkeletonLoader';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await hubService.getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined
        };
        const data = await hubService.getCoupons(params);
        setCoupons(data.coupons || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title="Verified Coupons, Promo Codes & Discount Vouchers"
        description="Find verified promo codes and discount vouchers for Amazon, Myntra, Swiggy, Ajio, and more. 1-click copy with instant merchant discount."
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
          <Ticket className="w-3.5 h-3.5" />
          <span>Exclusive Voucher Codes</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Verified Coupons & Promo Codes
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
          Click <strong>COPY CODE</strong> to automatically copy the voucher to your clipboard and jump straight to the store to save instantly.
        </p>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupons by brand or code..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-brand-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <CouponCardSkeleton key={n} />
          ))}
        </div>
      ) : coupons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <CouponCard key={coupon._id || coupon.code} coupon={coupon} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 font-display">No Coupons Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active coupons found for this filter. Try selecting "All Categories" or searching another store.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
