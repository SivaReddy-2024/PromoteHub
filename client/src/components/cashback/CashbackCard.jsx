import React, { useState } from 'react';
import { Zap, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import MerchantRedirectModal from '../common/MerchantRedirectModal';

const CashbackCard = ({ offer }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 card-hover p-5 flex flex-col justify-between space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 p-2 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={offer.storeLogo}
                alt={offer.storeName}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900">
                {offer.storeName}
              </h3>
              <span className="text-[11px] text-slate-400 capitalize">
                {offer.category}
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3 text-emerald-600 fill-emerald-500" />
            <span>Eligible</span>
          </span>
        </div>

        {/* Cashback Highlight Box */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl p-3.5 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Real Cash Back
          </span>
          <div className="text-xl font-extrabold text-emerald-800 font-display mt-0.5">
            {offer.cashbackRate}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            Max Limit: {offer.maxCashback}
          </p>
        </div>

        {/* Tracking speed */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Tracks: {offer.trackingSpeed}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>UPI Withdrawal</span>
          </div>
        </div>

        {/* Activate Cashback CTA */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Activate Cashback</span>
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
