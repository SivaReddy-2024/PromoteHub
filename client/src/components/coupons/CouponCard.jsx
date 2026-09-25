import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, ChevronDown, ChevronUp, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
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
    navigator.clipboard?.writeText(coupon.code);
    recordCopiedCoupon(coupon);
    setCopied(true);

    // Confetti celebration burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#fbbf24', '#ffffff']
      });
    } catch (err) {
      // ignore if canvas unavailable
    }

    addToast('Coupon copied to clipboard! Ready to paste.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleUseCoupon = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      <div className="group relative bg-[#1A1D27] rounded-3xl border border-white/8 shadow-md hover:shadow-2xl transition-all duration-300 coupon-ticket overflow-hidden flex flex-col justify-between card-hover">
        {/* Top Header */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-white/10 p-2 shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={coupon.brandLogo}
                  alt={coupon.brandName}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  {coupon.brandName}
                </span>
                <span className="inline-block px-2.5 py-0.5 mt-0.5 rounded-full text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/25 font-mono">
                  {coupon.discount}
                </span>
              </div>
            </div>

            {/* Favorite button */}
            <button
              onClick={handleFavorite}
              title={isFavorited ? 'Remove favorite' : 'Save coupon'}
              className={`p-2 rounded-xl transition-all ${
                isFavorited
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-white/5'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          <h3 className="font-display font-bold text-sm text-slate-100 mt-3 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {coupon.title}
          </h3>

          {coupon.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {coupon.description}
            </p>
          )}

          {/* Meta specs with Verified Tooltip tag */}
          <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
            {coupon.minimumPurchase > 0 && (
              <span className="bg-[#121520] px-2 py-0.5 rounded-md border border-white/5 font-mono text-slate-300">
                Min Spend: ₹{coupon.minimumPurchase.toLocaleString('en-IN')}
              </span>
            )}
            {coupon.verified && (
              <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified by PromoteHub</span>
              </span>
            )}
          </div>
        </div>

        {/* Dashed Cutout Divider */}
        <div className="relative border-b-2 border-dashed border-white/10 my-1 mx-3" />

        {/* Code & CTA Area */}
        <div className="p-5 pt-3 space-y-3 bg-[#131622]">
          <div className="flex items-center gap-2">
            {/* Coupon Code Pill with Marching Ants Border Animation */}
            <div className="flex-1 bg-[#1A1D27] border border-dashed border-amber-400/40 rounded-xl px-3 py-2 flex items-center justify-between shadow-inner group-hover:border-amber-400 transition-colors">
              <span className="font-mono text-sm font-black text-amber-300 tracking-wider">
                {coupon.code}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </div>

            {/* COPY CODE Button with State Machine Feedback */}
            <button
              onClick={handleCopyCode}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 active:scale-95 ${
                copied
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:border-amber-400'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED! 🎉' : 'COPY CODE'}</span>
            </button>
          </div>

          {/* USE COUPON Button */}
          <button
            onClick={handleUseCoupon}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-98"
          >
            <span>USE COUPON AT STORE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Expandable Terms */}
          <div className="pt-1">
            <button
              onClick={() => setShowTerms(!showTerms)}
              className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>Terms & Conditions</span>
              {showTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTerms && (
              <ul className="mt-2 text-[11px] text-slate-400 space-y-1 list-disc pl-4 animate-in fade-in">
                {coupon.terms && coupon.terms.length > 0 ? (
                  coupon.terms.map((t, i) => <li key={i}>{t}</li>)
                ) : (
                  <li>Valid on eligible cart checkout. Standard terms apply.</li>
                )}
                {coupon.expiryDate && (
                  <li className="font-semibold text-amber-400 font-mono">
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
