import React, { useState } from 'react';
import { CreditCard, Calendar, ChevronDown, ChevronUp, ShieldCheck, ArrowRight } from 'lucide-react';

const BankOfferCard = ({ offer }) => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 card-hover p-5 flex flex-col justify-between space-y-4">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900">
                {offer.bankName}
              </h3>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                {offer.cardType}
              </span>
            </div>
          </div>
        </div>

        {/* Discount Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-3.5 my-3 text-center">
          <div className="text-base sm:text-lg font-black text-blue-900 font-display">
            {offer.discount}
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-blue-700 font-medium mt-1">
            <span>Min Txn: ₹{offer.minimumTransaction.toLocaleString('en-IN')}</span>
            <span>•</span>
            <span>Max Disc: ₹{offer.maximumDiscount.toLocaleString('en-IN')}</span>
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
                className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Validity & Terms */}
      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{offer.validity}</span>
        </div>

        <div>
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span>Terms & Conditions</span>
            {showTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showTerms && (
            <ul className="mt-2 text-[11px] text-slate-500 space-y-1 list-disc pl-4 animate-in fade-in">
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
