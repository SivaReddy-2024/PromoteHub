import React, { useState, useEffect } from 'react';
import { Zap, Calculator, ShieldCheck, ArrowRight, Wallet, CheckCircle2 } from 'lucide-react';
import hubService from '../services/hubService';
import CashbackCard from '../components/cashback/CashbackCard';
import HowCashbackWorks from '../components/cashback/HowCashbackWorks';
import SEO from '../components/common/SEO';

const CashbackPage = () => {
  const [cashbacks, setCashbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cashback Calculator State
  const [orderAmount, setOrderAmount] = useState(5000);
  const [selectedRate, setSelectedRate] = useState(8.5);

  useEffect(() => {
    const fetchCashbacks = async () => {
      setLoading(true);
      try {
        const data = await hubService.getCashbackOffers();
        setCashbacks(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCashbacks();
  }, []);

  const estimatedCashback = Math.round((orderAmount * selectedRate) / 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SEO
        title="PromoteHub Cashback | Earn Real Cash on 500+ Indian Stores"
        description="Activate real cashback on Myntra, Ajio, Croma, Swiggy, and Samsung. Transfer directly to Bank or UPI with zero fees."
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5 fill-emerald-400" />
            <span>Guaranteed Real Money</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display leading-tight">
            Earn Real Cashback on Every Single Order
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Shop at your favorite stores through PromoteHub links. We track your purchases, credit your wallet, and let you withdraw directly to your bank account via UPI.
          </p>
        </div>
      </div>

      {/* Top Cashback Stores Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-display">
            Top Cashback Stores in India
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Click "Activate Cashback" before shopping to ensure automatic tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cashbacks.map((offer) => (
            <CashbackCard key={offer._id || offer.storeSlug} offer={offer} />
          ))}
        </div>
      </section>

      {/* Interactive Cashback Calculator */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-1">
            <Calculator className="w-4 h-4" />
            <span>Interactive Tool</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-display">
            Estimate Your Annual Cashback Earnings
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Slide to estimate how much extra cash you'll pocket by shopping via PromoteHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Monthly Online Spend:</span>
                <span className="text-emerald-700 font-black text-sm">₹{orderAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={orderAmount}
                onChange={(e) => setOrderAmount(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Select Typical Category Rate:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Electronics (5%)', val: 5 },
                  { label: 'Fashion (8.5%)', val: 8.5 },
                  { label: 'Food & Dining (10%)', val: 10 }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setSelectedRate(item.val)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedRate === item.val
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Estimated Monthly Cashback
            </span>
            <div className="text-4xl font-black text-emerald-600 font-display">
              ₹{estimatedCashback.toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-slate-500 block">
              That's approximately <strong className="text-slate-900">₹{(estimatedCashback * 12).toLocaleString('en-IN')}</strong> in free money every year!
            </span>
          </div>
        </div>
      </section>

      {/* 5-Step Visual Guide */}
      <HowCashbackWorks />
    </div>
  );
};

export default CashbackPage;
