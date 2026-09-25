import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, ChevronDown, ChevronUp, Heart, Sparkles } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import MerchantRedirectModal from '../common/MerchantRedirectModal';

const CouponCard = ({ coupon }) => {
  const { toggleFavoriteCoupon, isCouponFavorited, recordCopiedCoupon } = useFavorites();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [redirectModalOpen, setRedirectModalOpen] = useState(false);

  const isFavorited = isCouponFavorited(coupon._id || coupon.code);

  const handleCopyCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(coupon.code);
    recordCopiedCoupon(coupon);
    setCopied(true);
    addToast('Coupon copied!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleUseCoupon = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Auto-copy when clicking use coupon as well
    recordCopiedCoupon(coupon);
    setRedirectModalOpen(true);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteCoupon(coupon);
  };

  return (
    <>
      <div className="group relative bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 coupon-ticket overflow-hidden flex flex-col justify-between">
        {/* Top Header */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 p-2 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={coupon.brandLogo}
                  alt={coupon.brandName}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  {coupon.brandName}
                </span>
                <span className="inline-block px-2 py-0.5 mt-0.5 rounded-full text-xs font-black text-brand-700 bg-brand-50 border border-brand-200">
                  {coupon.discount}
                </span>
              </div>
            </div>

            {/* Favorite button */}
            <button
              onClick={handleFavorite}
              title={isFavorited ? 'Remove favorite' : 'Save coupon'}
              className={`p-2 rounded-xl transition-colors ${
                isFavorited
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'text-slate-400 hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          <h3 className="font-display font-bold text-sm text-slate-900 mt-3 line-clamp-2 leading-snug">
            {coupon.title}
          </h3>

          {coupon.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {coupon.description}
            </p>
          )}

          {/* Meta specs */}
          <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
            {coupon.minimumPurchase > 0 && (
              <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60 font-medium">
                Min Spend: ₹{coupon.minimumPurchase.toLocaleString('en-IN')}
              </span>
            )}
            {coupon.verified && (
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Dashed Cutout Divider */}
        <div className="relative border-b-2 border-dashed border-slate-200 my-1 mx-3" />

        {/* Code & CTA Area */}
        <div className="p-5 pt-3 space-y-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            {/* Coupon Code Pill */}
            <div className="flex-1 bg-white border border-dashed border-brand-300 rounded-xl px-3 py-2 flex items-center justify-between shadow-inner">
              <span className="font-mono text-sm font-extrabold text-slate-900 tracking-wider">
                {coupon.code}
              </span>
            </div>

            {/* COPY CODE Button */}
            <button
              onClick={handleCopyCode}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white hover:bg-slate-100 text-brand-700 border border-brand-200 hover:border-brand-400'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED ✓' : 'COPY CODE'}</span>
            </button>
          </div>

          {/* USE COUPON Button */}
          <button
            onClick={handleUseCoupon}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>USE COUPON</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Expandable Terms */}
          <div className="pt-1">
            <button
              onClick={() => setShowTerms(!showTerms)}
              className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span>Terms & Conditions</span>
              {showTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTerms && (
              <ul className="mt-2 text-[11px] text-slate-500 space-y-1 list-disc pl-4 animate-in fade-in">
                {coupon.terms && coupon.terms.length > 0 ? (
                  coupon.terms.map((t, i) => <li key={i}>{t}</li>)
                ) : (
                  <li>Valid on eligible cart checkout. Standard terms apply.</li>
                )}
                {coupon.expiryDate && (
                  <li className="font-semibold text-amber-700">
                    Expires: {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      <MerchantRedirectModal
        isOpen={redirectModalOpen}
        onClose={() => setRedirectModalOpen(false)}
        offer={coupon}
      />
    </>
  );
};

export default CouponCard;
