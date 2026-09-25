import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';

const FestivalBanner = ({ campaign }) => {
  if (!campaign) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 text-white">
      {/* Background Banner Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={campaign.banner}
          alt={campaign.name}
          className="w-full h-full object-cover opacity-35 transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
      </div>

      {/* Banner Content */}
      <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{campaign.tag || 'Festival Special'}</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display leading-tight">
          {campaign.title}
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          {campaign.description}
        </p>

        {/* Participating Brands */}
        {campaign.participatingBrands && campaign.participatingBrands.length > 0 && (
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[11px] uppercase font-bold text-slate-400">
              Top Partners:
            </span>
            {campaign.participatingBrands.map((b, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-white"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2 flex items-center gap-3">
          <Link
            to="/festivals"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all"
          >
            <span>Explore All Festival Offers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-xs font-black text-amber-300 px-3 py-1 rounded-lg bg-black/40 border border-amber-400/30">
            {campaign.discountUpTo}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FestivalBanner;
