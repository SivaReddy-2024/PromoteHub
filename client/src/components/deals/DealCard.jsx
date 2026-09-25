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
      recordCopiedCoupon({
        code: deal.couponCode,
        brandName: deal.brandName,
        title: deal.title
      });
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
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
      <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 card-hover overflow-hidden">
        {/* Top Badges Bar */}
        <div className="p-4 pb-3 flex items-start justify-between gap-2">
          {/* Brand Info */}
          <Link
            to={`/brand/${deal.brandSlug}`}
            className="flex items-center gap-2.5 group/brand"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 p-1.5 shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover/brand:border-brand-300 transition-colors">
              <img
                src={deal.brandLogo}
                alt={deal.brandName}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 hover:text-brand-600 transition-colors block">
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
              className={`p-2 rounded-xl transition-colors ${
                isFavorited
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'text-slate-400 hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              title="Share deal"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Image Showcase */}
        <Link to={`/deal/${deal.slug}`} className="relative h-44 w-full bg-slate-50 overflow-hidden block">
          {deal.imageUrl ? (
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
              No Image
            </div>
          )}

          {/* Discount Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-amber-500 to-rose-600 shadow-md">
            {deal.isHot && <Flame className="w-3.5 h-3.5 fill-white animate-bounce" />}
            <span>{deal.discountPercentage}% OFF</span>
          </div>

          {/* Verified Badge */}
          {deal.verified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 bg-white/95 border border-emerald-200 backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Verified</span>
            </div>
          )}

          {/* Ending Soon Countdown Pill */}
          {deal.expiryDate && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="inline-block bg-slate-950/80 backdrop-blur-md text-white rounded-lg px-2.5 py-1 text-[11px] shadow">
                <CountdownTimer targetDate={deal.expiryDate} compact />
              </div>
            </div>
          )}
        </Link>

        {/* Deal Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <Link to={`/deal/${deal.slug}`} className="block">
              <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                {deal.title}
              </h3>
            </Link>
            <p className="text-slate-500 text-xs mt-1 line-clamp-2">
              {deal.description}
            </p>
          </div>

          {/* Extra Benefit Badges (Coupon / Cashback) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {deal.couponCode && (
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                title="Click to copy code"
              >
                {codeCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{codeCopied ? 'COPIED!' : deal.couponCode}</span>
              </button>
            )}

            {deal.cashbackText && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>{deal.cashbackText}</span>
              </span>
            )}
          </div>

          {/* Price & Savings Row */}
          <div className="border-t border-slate-100 pt-3 flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-slate-900 font-display">
                  ₹{deal.dealPrice.toLocaleString('en-IN')}
                </span>
                {deal.originalPrice > deal.dealPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{deal.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {deal.savingsAmount > 0 && (
                <span className="text-[11px] font-bold text-emerald-600">
                  Save ₹{deal.savingsAmount.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Main CTA: GET DEAL */}
            <button
              onClick={handleGetDeal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all flex items-center gap-1"
            >
              <span>GET DEAL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
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
