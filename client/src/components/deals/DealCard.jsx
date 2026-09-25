import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share2, ShieldCheck, Flame, Zap, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';
import MerchantRedirectModal from '../common/MerchantRedirectModal';
import ShareModal from '../common/ShareModal';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';

const DealCard = ({ deal }) => {
  const { toggleFavoriteDeal, isDealFavorited, recordCopiedCoupon } = useFavorites();
  const { addToast } = useToast();
  const [redirectModalOpen, setRedirectModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const isFavorited = isDealFavorited(deal._id || deal.slug);

  const handleCopyCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (deal.couponCode) {
      navigator.clipboard?.writeText(deal.couponCode);
      recordCopiedCoupon({
        code: deal.couponCode,
        brandName: deal.brandName,
        title: deal.title
      });
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2200);
    }
  };

  const handleGetDeal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRedirectModalOpen(true);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteDeal(deal);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShareModalOpen(true);
  };

  return (
    <>
      <div className="group relative flex flex-col bg-[#1A1D27] rounded-3xl border border-white/8 shadow-lg hover:shadow-2xl transition-all duration-300 card-hover overflow-hidden">
        {/* Top Badges Bar */}
        <div className="p-4 pb-3 flex items-start justify-between gap-2 z-10">
          {/* Brand Info */}
          <Link
            to={`/brand/${deal.brandSlug}`}
            className="flex items-center gap-2.5 group/brand"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 rounded-2xl bg-white border border-white/10 p-1.5 shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover/brand:border-amber-400 transition-colors">
              <img
                src={deal.brandLogo}
                alt={deal.brandName}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-100 hover:text-amber-400 transition-colors block">
                {deal.brandName}
              </span>
              <span className="text-[11px] text-slate-400 capitalize">
                {deal.category}
              </span>
            </div>
          </Link>

          {/* Quick Actions (Favorite & Share) */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleFavorite}
              title={isFavorited ? 'Remove from favorites' : 'Save deal'}
              className={`p-2 rounded-xl transition-all ${
                isFavorited
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-white/5'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              title="Share deal"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Image Showcase */}
        <Link to={`/deal/${deal.slug}`} className="relative h-44 w-full bg-[#121520] overflow-hidden block">
          {deal.imageUrl ? (
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#121520] text-slate-500 text-xs">
              No Image
            </div>
          )}

          {/* Discount Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 shadow-md">
            {deal.isHot && <Flame className="w-3.5 h-3.5 fill-slate-950 animate-bounce" />}
            <span className="font-mono">{deal.discountPercentage}% OFF</span>
          </div>

          {/* Verified Badge */}
          {deal.verified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-400 bg-[#0F1117]/85 border border-emerald-500/30 backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified</span>
            </div>
          )}

          {/* Ending Soon Countdown Pill */}
          {deal.expiryDate && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="inline-block bg-[#0F1117]/90 backdrop-blur-md text-amber-400 rounded-lg px-2.5 py-1 text-[11px] shadow border border-white/5 font-mono">
                <CountdownTimer targetDate={deal.expiryDate} compact />
              </div>
            </div>
          )}
        </Link>

        {/* Deal Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <Link to={`/deal/${deal.slug}`} className="block">
              <h3 className="font-display font-bold text-sm text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                {deal.title}
              </h3>
            </Link>
            <p className="text-slate-400 text-xs mt-1 line-clamp-2">
              {deal.description}
            </p>
          </div>

          {/* Extra Benefit Badges (Coupon / Cashback) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {deal.couponCode && (
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 transition-colors"
                title="Click to copy code"
              >
                {codeCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{codeCopied ? 'COPIED!' : deal.couponCode}</span>
              </button>
            )}

            {deal.cashbackText && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>{deal.cashbackText}</span>
              </span>
            )}
          </div>

          {/* Price & Savings Row */}
          <div className="border-t border-white/8 pt-3 flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-white font-mono">
                  ₹{deal.dealPrice.toLocaleString('en-IN')}
                </span>
                {deal.originalPrice > deal.dealPrice && (
                  <span className="text-xs text-slate-400 line-through font-mono">
                    ₹{deal.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {deal.savingsAmount > 0 && (
                <span className="text-[11px] font-bold text-emerald-400 font-mono">
                  Save ₹{deal.savingsAmount.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Main CTA: GET DEAL */}
            <button
              onClick={handleGetDeal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 transition-all flex items-center gap-1 active:scale-95"
            >
              <span>GET DEAL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hover Quick-Action Tray Sliding Up from Card Bottom */}
        <div className="absolute inset-x-0 bottom-0 py-2.5 px-3 bg-[#121520]/95 backdrop-blur-md border-t border-amber-500/30 flex items-center justify-around gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
          <button
            onClick={handleFavorite}
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors ${
              isFavorited ? 'text-rose-400 bg-rose-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500' : ''}`} />
            <span>{isFavorited ? 'Saved' : 'Save'}</span>
          </button>

          {deal.couponCode ? (
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 px-2 py-1 rounded-lg hover:bg-amber-400/10 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{codeCopied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          ) : (
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          )}

          <Link
            to={`/deal/${deal.slug}`}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg hover:bg-emerald-400/10 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Outbound & Share Modals */}
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
    </>
  );
};

export default DealCard;
