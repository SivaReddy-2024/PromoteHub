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
      <div className="relative bg-[#1A1D27] rounded-3xl border border-amber-400/40 shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row p-4 sm:p-5 gap-5 pulse-amber-border card-hover">
        {/* Flash Sale Ribbon */}
        <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-600 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-lg flex items-center gap-1.5 z-10">
          <Flame className="w-3.5 h-3.5 fill-slate-950 animate-bounce" />
          <span>Flash Rush</span>
        </div>

        {/* Product Image */}
        <div className="relative w-full md:w-52 h-48 rounded-2xl overflow-hidden bg-[#121520] shrink-0">
          <img
            src={deal.imageUrl}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          <div className="absolute bottom-2 left-2 bg-[#0F1117]/90 backdrop-blur-md text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/5 font-mono">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{deal.discountPercentage}% OFF</span>
          </div>
        </div>

        {/* Details & Live Stock Bar */}
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {deal.brandName}
              </span>
              <span className="text-slate-600">•</span>
              <div className="text-rose-400 font-mono text-xs">
                <CountdownTimer targetDate={deal.expiryDate} compact />
              </div>
            </div>

            <Link to={`/deal/${deal.slug}`} className="block">
              <h3 className="font-display font-bold text-base text-slate-100 hover:text-amber-400 transition-colors line-clamp-2">
                {deal.title}
              </h3>
            </Link>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-white font-mono">
              ₹{deal.dealPrice.toLocaleString('en-IN')}
            </span>
            {deal.originalPrice > deal.dealPrice && (
              <span className="text-sm text-slate-500 line-through font-mono">
                ₹{deal.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-mono">
              Save ₹{deal.savingsAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Stock Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 fill-rose-400" />
                <span>Only {stockLeft} left in stock!</span>
              </span>
              <span className="text-slate-400 text-[11px] font-mono">
                {progressPercent}% claimed
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#121520] overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action */}
          <div className="pt-1 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Authentic</span>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>CLAIM RUSH DEAL</span>
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
