import React, { useState } from 'react';
import { Zap, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import MerchantRedirectModal from '../common/MerchantRedirectModal';

const CashbackCard = ({ offer }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#1A1D27] rounded-3xl border border-white/8 hover:border-emerald-500/40 shadow-md hover:shadow-2xl transition-all duration-300 card-hover p-5 flex flex-col justify-between space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-white/10 p-2 shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              <img
                src={offer.storeLogo}
                alt={offer.storeName}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-100">
                {offer.storeName}
              </h3>
              <span className="text-[11px] text-slate-400 capitalize">
                {offer.category}
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
            <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span>Eligible</span>
          </span>
        </div>

        {/* Cashback Highlight Box */}
        <div className="bg-[#121520] border border-emerald-500/25 rounded-2xl p-3.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Real Cash Back
          </span>
          <div className="text-xl font-black text-emerald-300 font-mono mt-0.5">
            {offer.cashbackRate}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1 font-mono">
            Max Limit: {offer.maxCashback}
          </p>
        </div>

        {/* Tracking speed */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Tracks: {offer.trackingSpeed}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>UPI Withdrawal</span>
          </div>
        </div>

        {/* Activate Cashback CTA */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>ACTIVATE CASHBACK</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <MerchantRedirectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        offer={{
          brandName: offer.storeName,
          brandLogo: offer.storeLogo,
          title: `${offer.cashbackRate} on ${offer.storeName}`,
          merchantUrl: offer.trackingUrl
        }}
      />
    </>
  );
};

export default CashbackCard;
