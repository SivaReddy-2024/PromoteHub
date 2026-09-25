import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Tag,
  Ticket,
  Heart,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import hubService from '../services/hubService';
import DealCard from '../components/deals/DealCard';
import CouponCard from '../components/coupons/CouponCard';
import MerchantRedirectModal from '../components/common/MerchantRedirectModal';
import SEO from '../components/common/SEO';
import { useFavorites } from '../context/FavoritesContext';

const BrandDetailPage = () => {
  const { slug } = useParams();
  const { toggleFavoriteBrand, isBrandFavorited } = useFavorites();

  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'deals' | 'coupons'
  const [redirectModalOpen, setRedirectModalOpen] = useState(false);

  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      try {
        const res = await hubService.getBrandBySlug(slug);
        setBrandData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-xs font-semibold">Loading store offers...</p>
      </div>
    );
  }

  const brand = brandData?.brand;
  const deals = brandData?.deals || [];
  const coupons = brandData?.coupons || [];
  const isFavorited = isBrandFavorited(brand?._id || brand?.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SEO
        title={`${brand?.name} Coupons, Promo Codes & Deals 2026`}
        description={brand?.description || `Explore verified discount codes and sales for ${brand?.name}.`}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/brands" className="hover:text-brand-600">Brands</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">{brand?.name}</span>
      </nav>

      {/* Store Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Brand Logo Box */}
        <div className="w-24 h-24 rounded-3xl bg-white border border-slate-200 p-3 shadow-md flex items-center justify-center overflow-hidden shrink-0">
          <img src={brand?.logo} alt={brand?.name} className="max-h-full max-w-full object-contain" />
        </div>

        {/* Brand Info */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                  {brand?.name} Coupons & Deals
                </h1>
                {brand?.verified !== false && (
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" title="Verified Merchant" />
                )}
              </div>
              <span className="text-xs text-slate-400 font-medium capitalize">
                Category: {brand?.category}
              </span>
            </div>

            {/* Favorite & Visit Merchant CTAs */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => toggleFavoriteBrand(brand)}
                title={isFavorited ? 'Remove favorite' : 'Save brand'}
                className={`p-2.5 rounded-2xl border transition-colors ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-slate-50 text-slate-400 hover:text-rose-600 border-slate-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => setRedirectModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all"
              >
                <span>Visit Store</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {brand?.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
              {deals.length} Active Deals
            </span>
            <span className="px-3 py-1 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold">
              {coupons.length} Active Coupons
            </span>
            {brand?.cashbackRate && (
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-emerald-500" />
                <span>{brand.cashbackRate} Cashback Available</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Offers ({deals.length + coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'coupons'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Coupons Only ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'deals'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Deals Only ({deals.length})
        </button>
      </div>

      {/* Offers Display */}
      <div className="space-y-8">
        {(activeTab === 'all' || activeTab === 'coupons') && coupons.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 font-display flex items-center gap-2">
              <Ticket className="w-5 h-5 text-brand-600" />
              <span>{brand?.name} Verified Coupons</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <CouponCard key={coupon._id || coupon.code} coupon={coupon} />
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'deals') && deals.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 font-display flex items-center gap-2">
              <Tag className="w-5 h-5 text-brand-600" />
              <span>{brand?.name} Live Deals</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal._id || deal.slug} deal={deal} />
              ))}
            </div>
          </section>
        )}

        {deals.length === 0 && coupons.length === 0 && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-xs">
            No live offers listed for {brand?.name} today. Check back tomorrow!
          </div>
        )}
      </div>

      {/* Merchant FAQs */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-600" />
          <span>Frequently Asked Questions about {brand?.name} Offers</span>
        </h3>
        <div className="space-y-3 text-xs text-slate-600">
          <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50">
            <h4 className="font-bold text-slate-800">How do I apply a {brand?.name} coupon code?</h4>
            <p className="mt-1 text-slate-500">
              Click "COPY CODE" on any voucher card above. We'll automatically copy the code to your device and redirect you to {brand?.name}. Paste the code in the "Promo Code" box at checkout.
            </p>
          </div>
          <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50">
            <h4 className="font-bold text-slate-800">Can I earn cashback on {brand?.name}?</h4>
            <p className="mt-1 text-slate-500">
              Yes, click "Activate Cashback" from PromoteHub. When your cart is empty and you complete the checkout in that session, your cashback will track in 24 hours.
            </p>
          </div>
        </div>
      </section>

      <MerchantRedirectModal
        isOpen={redirectModalOpen}
        onClose={() => setRedirectModalOpen(false)}
        offer={{
          brandName: brand?.name,
          brandLogo: brand?.logo,
          title: `Visit ${brand?.name} Official Store`,
          merchantUrl: brand?.website || 'https://www.google.com'
        }}
      />
    </div>
  );
};

export default BrandDetailPage;
