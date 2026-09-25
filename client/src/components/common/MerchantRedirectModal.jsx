import React, { useState, useEffect } from 'react';
import { ExternalLink, Copy, Check, ShieldCheck, X, Sparkles } from 'lucide-react';
import Button from './Button';
import { useToast } from '../../context/ToastContext';
import { useFavorites } from '../../context/FavoritesContext';
import hubService from '../../services/hubService';

const MerchantRedirectModal = ({ isOpen, onClose, offer }) => {
  const { addToast } = useToast();
  const { recordCopiedCoupon } = useFavorites();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && offer?.couponCode) {
      // Auto-copy coupon code
      navigator.clipboard.writeText(offer.couponCode);
      recordCopiedCoupon({
        code: offer.couponCode,
        brandName: offer.brandName || offer.brand,
        title: offer.title
      });
      setCopied(true);
    } else {
      setCopied(false);
    }
  }, [isOpen, offer]);

  if (!isOpen || !offer) return null;

  const handleManualCopy = () => {
    if (offer.couponCode) {
      navigator.clipboard.writeText(offer.couponCode);
      setCopied(true);
      addToast(`Coupon code ${offer.couponCode} copied!`, 'success');
      recordCopiedCoupon({
        code: offer.couponCode,
        brandName: offer.brandName || offer.brand,
        title: offer.title
      });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleOpenMerchant = () => {
    if (offer._id) {
      hubService.recordDealClick(offer._id);
    }
    const targetUrl = offer.affiliateUrl || offer.merchantUrl || 'https://www.google.com';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-2xl bg-white p-2 shadow-lg mb-3 flex items-center justify-center overflow-hidden border border-white/20">
            <img
              src={offer.brandLogo || 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80'}
              alt={offer.brandName}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Verified Merchant Promotion</span>
          </div>

          <h3 className="text-xl font-extrabold text-white font-display">
            {offer.brandName}
          </h3>
          <p className="text-white/80 text-xs mt-1 max-w-sm mx-auto line-clamp-1">
            {offer.title}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {offer.couponCode ? (
            <div className="bg-slate-50 border-2 border-dashed border-brand-200 rounded-2xl p-5 text-center relative">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1 block">
                {copied ? '✓ Coupon Automatically Copied' : 'Your Exclusive Promo Code'}
              </span>
              <div className="flex items-center justify-center gap-3 my-2">
                <span className="font-mono text-2xl font-black text-brand-700 tracking-wider bg-white px-4 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                  {offer.couponCode}
                </span>
                <button
                  onClick={handleManualCopy}
                  className={`p-2.5 rounded-xl border text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                    copied
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Paste this code in the coupon / voucher box during checkout at {offer.brandName}.
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-emerald-700 font-bold text-sm">
                No Coupon Code Required!
              </div>
              <p className="text-emerald-600 text-xs mt-1">
                The discount will be automatically applied at {offer.brandName} checkout.
              </p>
            </div>
          )}

          {/* Trust and Tracking Note */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200/60">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">100% Verified Deal Link</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                We are opening the official merchant store in a new window. Ensure your cart is empty to track applicable cashback.
              </p>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="space-y-2">
            <Button
              onClick={handleOpenMerchant}
              variant="primary"
              size="lg"
              className="w-full justify-center gap-2 shadow-lg shadow-brand-500/25 text-base"
            >
              <span>Continue to {offer.brandName}</span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <button
              onClick={onClose}
              className="w-full text-center py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Stay on PromoteHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantRedirectModal;
