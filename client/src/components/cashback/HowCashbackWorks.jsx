import React from 'react';
import { Search, Zap, ShoppingBag, BarChart3, Wallet } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Find an Offer',
    description: 'Browse top deals and coupons for your favorite brands on PromoteHub.',
    icon: Search,
    bg: 'bg-amber-400/10 text-amber-400 border border-amber-400/25'
  },
  {
    step: '02',
    title: 'Activate Cashback',
    description: 'Click "Activate Cashback" to establish your verified shopping session.',
    icon: Zap,
    bg: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/25'
  },
  {
    step: '03',
    title: 'Shop at Merchant',
    description: 'Complete your purchase normally on the official store website or app.',
    icon: ShoppingBag,
    bg: 'bg-amber-400/10 text-amber-400 border border-amber-400/25'
  },
  {
    step: '04',
    title: 'Cashback Tracked',
    description: 'Your cashback is automatically captured in your PromoteHub account within 24h.',
    icon: BarChart3,
    bg: 'bg-amber-400/10 text-amber-400 border border-amber-400/25'
  },
  {
    step: '05',
    title: 'Receive Real Cash',
    description: 'Withdraw confirmed cashback directly to your Bank Account via UPI or Gift Card.',
    icon: Wallet,
    bg: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/25'
  }
];

const HowCashbackWorks = () => {
  return (
    <div className="bg-[#121520] border border-white/10 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-bold border border-emerald-400/25">
          <Zap className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Real Cash, No Gimmicks</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          How Cashback Works in 5 Easy Steps
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          We earn marketing commissions from partner stores when you shop and pass the majority right back into your pocket!
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.step}
              className="bg-[#1A1D27]/80 border border-white/8 hover:border-amber-400/40 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-sm hover:-translate-y-1.5 transition-all duration-300 card-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${st.bg} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-black text-amber-400/70">
                    {st.step}
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-white mb-1.5">
                  {st.title}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {st.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HowCashbackWorks;
