import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Mail,
  ShieldCheck,
  Send,
  Heart,
  ExternalLink,
  CheckCircle2
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
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pb-20 md:pb-12 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter & Deal Alerts Section */}
        <div className="bg-gradient-to-r from-brand-900/60 via-indigo-900/40 to-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-[11px] font-bold border border-brand-500/30">
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

          <form onSubmit={handleSubscribe} className="flex items-center w-full max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-lg shadow-brand-600/30"
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <Megaphone className="w-5 h-5 -rotate-12" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Promote<span className="text-brand-500">Hub</span>
              </span>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              PromoteHub is India’s leading promotional discovery and savings platform. We aggregate verified coupons, flash deals, bank card instant discounts, and guaranteed cashback from hundreds of premier merchants.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <span className="font-bold text-xs">𝕏</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <span className="font-bold text-xs">in</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <span className="font-bold text-xs">yt</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
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
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Press & News</Link></li>
            </ul>
          </div>

          {/* Discover */}
          <div className="space-y-3">
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider">
              Discover
            </h4>
            <ul className="space-y-2">
              <li><Link to="/deals" className="hover:text-white transition-colors">Today's Deals</Link></li>
              <li><Link to="/coupons" className="hover:text-white transition-colors">Verified Coupons</Link></li>
              <li><Link to="/cashback" className="hover:text-white transition-colors">Cashback Offers</Link></li>
              <li><Link to="/brands" className="hover:text-white transition-colors">Top Stores & Brands</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/festivals" className="hover:text-white transition-colors">Festival Sales</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider">
              Legal & Support
            </h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ & Help Center</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link to="/affiliate-disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Notice */}
        <div className="border-t border-slate-800/80 pt-8 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Affiliate Disclosure:</strong> PromoteHub is an independent promotional and deals aggregator. When you visit merchant sites and make qualifying purchases through our referral links, coupons, or cashback activation portals, we may earn an affiliate commission at zero additional cost to you. All product trademarks, logos, and brand assets are the property of their respective owners.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
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
