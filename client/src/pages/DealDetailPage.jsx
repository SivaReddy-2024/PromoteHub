import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  Copy,
  Check,
  ExternalLink,
  Share2,
  AlertTriangle,
  Heart,
  Zap,
  ArrowRight,
  ChevronRight,
  Tag,
  Building2,
  CheckCircle2
} from 'lucide-react';
import hubService from '../services/hubService';
import DealCard from '../components/deals/DealCard';
import CouponCard from '../components/coupons/CouponCard';
import CountdownTimer from '../components/common/CountdownTimer';
import MerchantRedirectModal from '../components/common/MerchantRedirectModal';
import ShareModal from '../components/common/ShareModal';
import ReportOfferModal from '../components/common/ReportOfferModal';
import SEO from '../components/common/SEO';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';

const DealDetailPage = () => {
  const { slug, id } = useParams();
  const identifier = slug || id;

  const { toggleFavoriteDeal, isDealFavorited, recordCopiedCoupon } = useFavorites();
  const { addToast } = useToast();

  const [deal, setDeal] = useState(null);
  const [relatedDeals, setRelatedDeals] = useState([]);
  const [similarCoupons, setSimilarCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [redirectModalOpen, setRedirectModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const fetchDealData = async () => {
      setLoading(true);
      try {
        const data = await hubService.getDealByIdOrSlug(identifier);
        setDeal(data.deal);
        setRelatedDeals(data.relatedDeals || []);

        if (data.deal?.category) {
          const couponsData = await hubService.getCoupons({ category: data.deal.category, limit: 3 });
          setSimilarCoupons(couponsData.coupons || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDealData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [identifier]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-xs font-semibold">Loading deal details...</p>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-display">Deal Not Found</h2>
        <p className="text-slate-500 text-sm">The deal you're looking for might have expired or been removed.</p>
        <Link to="/deals" className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Browse Live Deals
        </Link>
      </div>
    );
  }

  const isFavorited = isDealFavorited(deal._id || deal.slug);

  const handleCopyCode = () => {
    if (deal.couponCode) {
      navigator.clipboard.writeText(deal.couponCode);
      recordCopiedCoupon({
        code: deal.couponCode,
        brandName: deal.brandName,
        title: deal.title
      });
      setCodeCopied(true);
      addToast(`Promo code "${deal.couponCode}" copied!`, 'success');
      setTimeout(() => setCodeCopied(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SEO
        title={`${deal.title} - ${deal.discountPercentage}% OFF on ${deal.brandName}`}
        description={deal.description}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/deals" className="hover:text-brand-600">Deals</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/category/${deal.category?.toLowerCase()}`} className="hover:text-brand-600 capitalize">
          {deal.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{deal.brandName}</span>
      </nav>

      {/* Main Deal Card Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
        {/* Left Column: Image & Countdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 h-80 sm:h-96">
            <img
              src={deal.imageUrl || 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=800&q=80'}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
            {/* Discount Badge */}
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-sm font-black text-white bg-gradient-to-r from-amber-500 to-rose-600 shadow-lg">
              {deal.discountPercentage}% OFF
            </div>
          </div>

          {/* Countdown & Trust Badge */}
          {deal.expiryDate && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800">Limited-Time Offer:</span>
              <CountdownTimer targetDate={deal.expiryDate} compact />
            </div>
          )}
        </div>

        {/* Right Column: Title, Pricing, Code, CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand Header */}
            <div className="flex items-center justify-between gap-4">
              <Link to={`/brand/${deal.brandSlug}`} className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm flex items-center justify-center overflow-hidden">
                  <img src={deal.brandLogo} alt={deal.brandName} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                    {deal.brandName}
                  </h4>
                  <span className="text-xs text-slate-400 capitalize">{deal.category} Store</span>
                </div>
              </Link>

              {/* Action Buttons: Favorite & Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavoriteDeal(deal)}
                  title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
                  className={`p-2.5 rounded-2xl border transition-colors ${
                    isFavorited
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>

                <button
                  onClick={() => setShareModalOpen(true)}
                  title="Share Deal"
                  className="p-2.5 rounded-2xl bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display leading-tight">
              {deal.title}
            </h1>

            {/* Verification & Trust Badge */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Offer</span>
              </div>
              <span className="text-slate-400 font-medium">
                Last verified: {deal.lastVerified ? '2 hours ago' : 'Recently checked'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{deal.clicks || 450}+ shoppers clicked</span>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Effective Deal Price
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-black text-slate-900 font-display">
                    ₹{deal.dealPrice.toLocaleString('en-IN')}
                  </span>
                  {deal.originalPrice > deal.dealPrice && (
                    <span className="text-base text-slate-400 line-through">
                      ₹{deal.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {deal.savingsAmount > 0 && (
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs">
                    You Save ₹{deal.savingsAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Coupon Box if available */}
            {deal.couponCode && (
              <div className="bg-indigo-50/70 border-2 border-dashed border-brand-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">
                    Use Coupon Code at Checkout
                  </span>
                  <span className="font-mono text-xl font-black text-brand-900 tracking-wider">
                    {deal.couponCode}
                  </span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                    codeCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                  }`}
                >
                  {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{codeCopied ? 'COPIED ✓' : 'COPY CODE'}</span>
                </button>
              </div>
            )}

            {/* Cashback Extra Notice */}
            {deal.cashbackText && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200">
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-500 shrink-0" />
                <span>Cashback Available: {deal.cashbackText}</span>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setRedirectModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>GET DEAL AT {deal.brandName.toUpperCase()}</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
              <span>Opens official merchant site</span>
              <button
                onClick={() => setReportModalOpen(true)}
                className="hover:text-rose-600 flex items-center gap-1 text-[11px] font-medium"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                <span>Report offer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How to Redeem & Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* How to Redeem */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>How to Redeem this Offer</span>
          </h3>

          <ol className="space-y-3 text-xs sm:text-sm text-slate-600 list-decimal pl-4">
            {deal.howToUse && deal.howToUse.length > 0 ? (
              deal.howToUse.map((step, i) => (
                <li key={i} className="leading-relaxed">
                  {step}
                </li>
              ))
            ) : (
              <>
                <li>Click on the <strong>GET DEAL</strong> button above to visit {deal.brandName}.</li>
                <li>Add the product to your shopping bag.</li>
                <li>Apply any indicated promo code during checkout.</li>
                <li>Enjoy verified savings!</li>
              </>
            )}
          </ol>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-600" />
            <span>Terms & Conditions</span>
          </h3>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc pl-4">
            {deal.terms && deal.terms.length > 0 ? (
              deal.terms.map((term, i) => (
                <li key={i} className="leading-relaxed">
                  {term}
                </li>
              ))
            ) : (
              <>
                <li>Offer valid while inventory lasts on official merchant channels.</li>
                <li>Cannot be clubbed with select manufacturer vouchers.</li>
                <li>Merchant reserve the right to cancel or amend terms without prior notice.</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Similar Coupons for this Store / Category */}
      {similarCoupons.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 font-display">
              Similar Coupons for {deal.category}
            </h3>
            <Link to="/coupons" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              View All Coupons →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCoupons.map((c) => (
              <CouponCard key={c._id || c.code} coupon={c} />
            ))}
          </div>
        </section>
      )}

      {/* Related Deals in Same Category */}
      {relatedDeals.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 font-display">
              Related Deals You May Like
            </h3>
            <Link to="/deals" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              View All Deals →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedDeals.map((d) => (
              <DealCard key={d._id || d.slug} deal={d} />
            ))}
          </div>
        </section>
      )}

      {/* Outbound & Report Modals */}
      <MerchantRedirectModal
        isOpen={redirectModalOpen}
        onClose={() => setRedirectModalOpen(false)}
        offer={deal}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        offer={deal}
      />

      <ReportOfferModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        offer={deal}
      />
    </div>
  );
};

export default DealDetailPage;
