import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ShieldCheck,
  Send,
  Heart,
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      addToast('🎉 Subscribed to Daily Deal Alerts!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0A0C11] text-slate-400 text-xs border-t border-white/8 pb-20 md:pb-12 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter & Deal Alerts Section with Amber/Emerald Dark Styling */}
        <div className="bg-[#121520] rounded-3xl p-6 sm:p-10 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 text-center lg:text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-[11px] font-bold border border-amber-400/25">
              <Mail className="w-3.5 h-3.5" />
              <span>Never Miss a Price Drop</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display">
              Get Curated Hand-Picked Deals in Your Inbox
            </h3>
            <p className="text-slate-400 text-xs max-w-lg">
              Join 150,000+ smart Indian shoppers receiving morning flash alerts, exclusive coupon codes, and bank discount reminders.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex items-center w-full max-w-md gap-2 relative z-10">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#1A1D27] border border-white/15 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <span>{subscribed ? 'Subscribed!' : 'Subscribe'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Multi-Column Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/25">
                <svg viewBox="0 0 32 32" className="w-5 h-5 text-slate-950 fill-current font-black">
                  <path d="M7 6h8c3.3 0 6 2.7 6 6s-2.7 6-6 6h-4v8H7V6zm4 8h4c1.1 0 2-.9 2-2s-.9-2-2-2h-4v4z" />
                  <path d="M22 14v12h-3V14h3z" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight text-white font-display">
                Promote<span className="text-gradient-amber">Hub</span>
              </span>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              PromoteHub is India’s premier promotional discovery and savings platform. We aggregate verified coupons, flash deals, bank card instant discounts, and guaranteed cashback from hundreds of premier merchants.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-xl bg-white/5 hover:bg-amber-400/20 hover:text-amber-400 flex items-center justify-center text-slate-300 transition-colors">
                <span className="font-bold text-xs">𝕏</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-white/5 hover:bg-amber-400/20 hover:text-amber-400 flex items-center justify-center text-slate-300 transition-colors">
                <span className="font-bold text-xs">in</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-white/5 hover:bg-amber-400/20 hover:text-amber-400 flex items-center justify-center text-slate-300 transition-colors">
                <span className="font-bold text-xs">yt</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-white/5 hover:bg-amber-400/20 hover:text-amber-400 flex items-center justify-center text-slate-300 transition-colors">
                <span className="font-bold text-xs">ig</span>
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/careers" className="hover:text-amber-400 transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-amber-400 transition-colors">Press & News</Link></li>
            </ul>
          </div>

          {/* Discover */}
          <div className="space-y-3">
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider">
              Discover
            </h4>
            <ul className="space-y-2">
              <li><Link to="/deals" className="hover:text-amber-400 transition-colors">Today's Deals</Link></li>
              <li><Link to="/coupons" className="hover:text-amber-400 transition-colors">Verified Coupons</Link></li>
              <li><Link to="/cashback" className="hover:text-amber-400 transition-colors">Cashback Offers</Link></li>
              <li><Link to="/brands" className="hover:text-amber-400 transition-colors">Top Stores & Brands</Link></li>
              <li><Link to="/categories" className="hover:text-amber-400 transition-colors">Categories</Link></li>
              <li><Link to="/festivals" className="hover:text-amber-400 transition-colors">Festival Sales</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider">
              Legal & Support
            </h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-amber-400 transition-colors">FAQ & Help Center</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-amber-400 transition-colors">Cookie Policy</Link></li>
              <li><Link to="/affiliate-disclosure" className="hover:text-amber-400 transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Notice */}
        <div className="border-t border-white/8 pt-8 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Affiliate Disclosure:</strong> PromoteHub is an independent promotional and deals aggregator. When you visit merchant sites and make qualifying purchases through our referral links, coupons, or cashback activation portals, we may earn an affiliate commission at zero additional cost to you. All product trademarks, logos, and brand assets are the property of their respective owners.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} PromoteHub India Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Engineered with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for smart Indian shoppers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
