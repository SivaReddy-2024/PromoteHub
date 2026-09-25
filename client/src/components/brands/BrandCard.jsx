import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Zap, Star, ShieldCheck } from 'lucide-react';

const BrandCard = ({ brand }) => {
  return (
    <div className="group bg-[#1A1D27] hover:bg-[#202534] rounded-3xl border border-white/8 hover:border-amber-400/40 shadow-md hover:shadow-2xl transition-all duration-300 card-hover p-5 flex flex-col justify-between space-y-4">
      <div className="flex flex-col items-center text-center space-y-2.5">
        {/* Brand Logo Box with 1.1x scale and amber glow aura */}
        <div className="w-16 h-16 rounded-2xl bg-white border border-white/10 p-2.5 shadow-md flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110 group-hover:shadow-amber-500/20">
          <img
            src={brand.logo}
            alt={brand.name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>

        <div>
          <div className="flex items-center justify-center gap-1">
            <h3 className="font-display font-bold text-base text-slate-100 group-hover:text-amber-400 transition-colors">
              {brand.name}
            </h3>
            {brand.verified !== false && (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
          </div>
          <span className="text-[11px] text-slate-400 capitalize">
            {brand.category}
          </span>
        </div>

        {/* Stats Pill in JetBrains Mono */}
        <div className="grid grid-cols-2 gap-2 w-full pt-1">
          <div className="bg-[#121520] border border-white/5 rounded-xl p-2 text-center">
            <span className="text-xs font-black text-amber-400 block font-mono">
              {brand.activeOffersCount || 12}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Live Deals
            </span>
          </div>

          <div className="bg-[#121520] border border-white/5 rounded-xl p-2 text-center">
            <span className="text-xs font-black text-emerald-400 block font-mono">
              {brand.couponCount || 6}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Coupons
            </span>
          </div>
        </div>

        {/* Cashback Badge */}
        {brand.cashbackRate && (
          <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/25">
            <Zap className="w-3.5 h-3.5 fill-emerald-400" />
            <span>{brand.cashbackRate} Cashback</span>
          </div>
        )}
      </div>

      {/* View Offers CTA with Amber Glow on Hover */}
      <Link
        to={`/brand/${brand.slug}`}
        className="w-full py-2.5 rounded-xl bg-[#232838] group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-amber-600 group-hover:text-slate-950 text-slate-200 text-xs font-black transition-all flex items-center justify-center gap-1.5"
      >
        <span>View {brand.activeOffersCount || 12} Offers</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default BrandCard;
