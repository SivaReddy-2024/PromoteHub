import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Tag, Ticket, Building2, Trash2, ArrowRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import DealCard from '../components/deals/DealCard';
import CouponCard from '../components/coupons/CouponCard';
import BrandCard from '../components/brands/BrandCard';
import SEO from '../components/common/SEO';

const FavoritesPage = () => {
  const { savedDeals, savedCoupons, savedBrands, favoritesCount } = useFavorites();
  const [activeTab, setActiveTab] = useState('deals');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title="My Saved Favorites | PromoteHub"
        description="View your saved deals, favorite coupon vouchers, and bookmarked stores in one central place."
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Wishlist & Bookmarks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
            My Saved Favorites
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Keep track of deals, voucher codes, and favorite merchant stores so you can grab them before expiry.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          {favoritesCount} Total Items Saved
        </span>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'deals'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Deals ({savedDeals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'coupons'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Coupons ({savedCoupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('brands')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'brands'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Stores ({savedBrands.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'deals' && (
        savedDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedDeals.map((deal) => (
              <DealCard key={deal._id || deal.slug} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <Heart className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 font-display">No Saved Deals Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tap the heart icon on any deal card to save it here for later.
            </p>
            <Link to="/deals" className="inline-block mt-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl">
              Browse Live Deals
            </Link>
          </div>
        )
      )}

      {activeTab === 'coupons' && (
        savedCoupons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCoupons.map((coupon) => (
              <CouponCard key={coupon._id || coupon.code} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 font-display">No Saved Coupons Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tap the heart icon on any coupon voucher to keep it handy before checkout.
            </p>
            <Link to="/coupons" className="inline-block mt-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl">
              Explore Coupons
            </Link>
          </div>
        )
      )}

      {activeTab === 'brands' && (
        savedBrands.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedBrands.map((brand) => (
              <BrandCard key={brand._id || brand.slug} brand={brand} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 font-display">No Saved Stores Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Bookmark your favorite merchants like Amazon, Myntra, or Swiggy to get notified of their deals.
            </p>
            <Link to="/brands" className="inline-block mt-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl">
              View All Stores
            </Link>
          </div>
        )
      )}
    </div>
  );
};

export default FavoritesPage;
