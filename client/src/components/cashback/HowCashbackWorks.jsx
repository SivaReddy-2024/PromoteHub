import React from 'react';
import { Search, Zap, ShoppingBag, BarChart3, Wallet } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Find an Offer',
    description: 'Browse top deals and coupons for your favorite brands on PromoteHub.',
    icon: Search,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 text-blue-600'
  },
  {
    step: '02',
    title: 'Activate Cashback',
    description: 'Click "Activate Cashback" to establish your verified shopping session.',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 text-amber-600'
  },
  {
    step: '03',
    title: 'Shop at Merchant',
    description: 'Complete your purchase normally on the official store website or app.',
    icon: ShoppingBag,
    color: 'from-indigo-500 to-purple-600',
    bg: 'bg-indigo-50 text-indigo-600'
  },
  {
    step: '04',
    title: 'Cashback Tracked',
    description: 'Your cashback is automatically captured in your PromoteHub account within 24h.',
    icon: BarChart3,
    color: 'from-violet-500 to-pink-600',
    bg: 'bg-violet-50 text-violet-600'
  },
  {
    step: '05',
    title: 'Receive Real Cash',
    description: 'Withdraw confirmed cashback directly to your Bank Account via UPI or Amazon Gift Card.',
    icon: Wallet,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 text-emerald-600'
  }
];

const HowCashbackWorks = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold border border-white/15">
          <Zap className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Real Cash, No Gimmicks</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          How Cashback Works in 5 Easy Steps
        </h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          We earn marketing commissions from stores when you shop and pass the majority right back into your pocket!
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={st.step}
              className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-sm hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${st.bg} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-black text-slate-400 opacity-60">
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
