import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';
import MerchantRedirectModal from '../common/MerchantRedirectModal';

const FlashDealCard = ({ deal }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const stockLeft = deal.flashStock || 8;
  const totalStock = deal.flashTotalStock || 35;
  const progressPercent = Math.min(100, Math.max(15, Math.round(((totalStock - stockLeft) / totalStock) * 100)));

  return (
    <>
      <div className="relative bg-white rounded-3xl border-2 border-amber-300 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row p-4 gap-5">
        {/* Flash Sale Ribbon */}
        <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-bl-xl shadow-sm flex items-center gap-1 z-10">
          <Flame className="w-3.5 h-3.5 fill-white" />
          <span>Flash Sale</span>
        </div>

        {/* Product Image */}
        <div className="relative w-full md:w-48 h-44 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
          <img
            src={deal.imageUrl}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{deal.discountPercentage}% OFF</span>
          </div>
        </div>

        {/* Details & Live Stock Bar */}
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {deal.brandName}
              </span>
              <span className="text-slate-300">•</span>
              <CountdownTimer targetDate={deal.expiryDate} compact />
            </div>

            <Link to={`/deal/${deal.slug}`} className="block">
              <h3 className="font-display font-bold text-base text-slate-900 hover:text-brand-600 transition-colors line-clamp-2">
                {deal.title}
              </h3>
            </Link>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-slate-900 font-display">
              ₹{deal.dealPrice.toLocaleString('en-IN')}
            </span>
            {deal.originalPrice > deal.dealPrice && (
              <span className="text-sm text-slate-400 line-through">
                ₹{deal.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Save ₹{deal.savingsAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Stock Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-rose-600 font-bold animate-pulse">
                ⚡ Only {stockLeft} left in stock!
              </span>
              <span className="text-slate-400 text-[11px]">
                {progressPercent}% claimed
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action */}
          <div className="pt-1 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified Authentic</span>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 flex items-center gap-1.5 transition-all"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <MerchantRedirectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        offer={deal}
      />
    </>
  );
};

export default FlashDealCard;
