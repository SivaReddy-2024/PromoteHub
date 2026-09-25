import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Zap, Star, ShieldCheck } from 'lucide-react';

const BrandCard = ({ brand }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 card-hover p-5 flex flex-col justify-between space-y-4">
      <div className="flex flex-col items-center text-center space-y-2.5">
        {/* Brand Logo Box */}
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 p-2.5 shadow-md flex items-center justify-center overflow-hidden">
          <img
            src={brand.logo}
            alt={brand.name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>

        <div>
          <div className="flex items-center justify-center gap-1">
            <h3 className="font-display font-bold text-base text-slate-900">
              {brand.name}
            </h3>
            {brand.verified !== false && (
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
          </div>
          <span className="text-[11px] text-slate-400 capitalize">
            {brand.category}
          </span>
        </div>

        {/* Stats Pill */}
        <div className="grid grid-cols-2 gap-2 w-full pt-1">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center">
            <span className="text-xs font-black text-slate-900 block font-display">
              {brand.activeOffersCount || 12}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Live Deals
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center">
            <span className="text-xs font-black text-slate-900 block font-display">
              {brand.couponCount || 6}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Coupons
            </span>
          </div>
        </div>

        {/* Cashback Badge */}
        {brand.cashbackRate && (
          <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
            <Zap className="w-3.5 h-3.5 fill-emerald-500" />
            <span>{brand.cashbackRate} Cashback</span>
          </div>
        )}
      </div>

      {/* View Offers CTA */}
      <Link
        to={`/brand/${brand.slug}`}
        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 group/btn"
      >
        <span>View Offers</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

export default BrandCard;
