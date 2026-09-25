import React, { useState } from 'react';
import { CreditCard, Calendar, ChevronDown, ChevronUp, ShieldCheck, ArrowRight } from 'lucide-react';

const BankOfferCard = ({ offer }) => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="bg-[#1A1D27] rounded-3xl border border-white/8 hover:border-amber-400/40 shadow-md hover:shadow-2xl transition-all duration-300 card-hover p-5 flex flex-col justify-between space-y-4">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400 font-bold text-xs">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-100">
                {offer.bankName}
              </h3>
              <span className="text-[11px] font-semibold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-amber-400/20">
                {offer.cardType}
              </span>
            </div>
          </div>
        </div>

        {/* Discount Box */}
        <div className="bg-[#121520] border border-amber-400/20 rounded-2xl p-3.5 my-3 text-center">
          <div className="text-base sm:text-lg font-black text-amber-300 font-display">
            {offer.discount}
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
            <span>Min Txn: ₹{offer.minimumTransaction.toLocaleString('en-IN')}</span>
            <span>•</span>
            <span className="text-emerald-400">Max Disc: ₹{offer.maximumDiscount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Applicable Merchants */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Applicable At:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {offer.applicableMerchants && offer.applicableMerchants.map((m, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#242938] text-slate-200 border border-white/8"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Validity & Terms */}
      <div className="border-t border-white/8 pt-3 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>{offer.validity}</span>
        </div>

        <div>
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span>Terms & Conditions</span>
            {showTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showTerms && (
            <ul className="mt-2 text-[11px] text-slate-400 space-y-1 list-disc pl-4 animate-in fade-in">
              {offer.terms && offer.terms.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankOfferCard;
