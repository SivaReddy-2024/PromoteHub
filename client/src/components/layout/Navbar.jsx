import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../context/FavoritesContext';
import hubService from '../../services/hubService';
import {
  Tag,
  Ticket,
  Zap,
  LayoutGrid,
  Building2,
  Flame,
  BookOpen,
  User,
  Heart,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  Search,
  ArrowRight,
  Sparkles,
  CreditCard,
  Percent,
  CheckCircle2
} from 'lucide-react';
import Button from '../common/Button';
import UserAvatar from '../common/UserAvatar';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchRef = useRef(null);

  // Menus
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [megaMenuType, setMegaMenuType] = useState(null); // 'deals' | 'brands' | null
  const megaMenuTimeout = useRef(null);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const data = await hubService.search(searchQuery);
        setSearchResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setSearchExpanded(false);
      setMobileMenuOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    {
      to: '/deals',
      label: 'Deals',
      icon: Tag,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      tooltip: 'Hand-picked discounts & price drops',
      hasMega: true,
      megaType: 'deals'
    },
    {
      to: '/coupons',
      label: 'Coupons',
      icon: Ticket,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      tooltip: '100% verified working promo codes'
    },
    {
      to: '/cashback',
      label: 'Cashback',
      icon: Zap,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      badge: 'REAL UPI',
      tooltip: 'Transfer real cash directly to UPI'
    },
    {
      to: '/bank-offers',
      label: 'Bank Offers',
      icon: CreditCard,
      color: 'text-amber-300',
      bgColor: 'bg-amber-300/10',
      tooltip: 'Exclusive credit & debit card EMI discounts'
    },
    {
      to: '/brands',
      label: 'Brands',
      icon: Building2,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      tooltip: '500+ top stores: Amazon, Flipkart, Myntra',
      hasMega: true,
      megaType: 'brands'
    },
    {
      to: '/categories',
      label: 'Categories',
      icon: LayoutGrid,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      tooltip: 'Shop by 16 popular categories'
    },
    {
      to: '/deals?isHot=true',
      label: 'Hot Steals',
      icon: Flame,
      color: 'text-rose-400',
      bgColor: 'bg-rose-400/10',
      badge: 'HOT',
      tooltip: 'Expiring fast high-discount steals'
    },
    {
      to: '/blog',
      label: 'Blog',
      icon: BookOpen,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      tooltip: 'Money-saving tips and shopping guides'
    }
  ];

  const handleMegaEnter = (type) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setMegaMenuType(type);
  };

  const handleMegaLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setMegaMenuType(null);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F1117]/85 backdrop-blur-2xl border-b border-white/8 transition-colors">
      {/* Top Banner / Promotional Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 text-slate-950 text-[11px] font-black py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
        <span>Great Indian Savings Festival is LIVE! Get up to 80% OFF + Flat 10% Extra Cashback via PromoteHub</span>
        <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 sm:h-20 gap-4">
          {/* Logo with Stylized PH Monogram */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Stylized PH Monogram SVG */}
              <svg viewBox="0 0 32 32" className="w-6 h-6 text-slate-950 fill-current font-black">
                <path d="M7 6h8c3.3 0 6 2.7 6 6s-2.7 6-6 6h-4v8H7V6zm4 8h4c1.1 0 2-.9 2-2s-.9-2-2-2h-4v4z" />
                <path d="M22 14v12h-3V14h3z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                  Promote<span className="text-gradient-amber">Hub</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-extrabold bg-amber-400/10 text-amber-400 rounded-md border border-amber-400/25">
                  DEALS & CODES
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links — left-aligned, immediately after logo */}
          <nav className="hidden lg:flex items-center gap-0.5 text-xs font-semibold text-slate-300">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              const Icon = link.icon;

              return (
                <div
                  key={link.to}
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredNav(link.to);
                    if (link.hasMega) handleMegaEnter(link.megaType);
                    else handleMegaLeave();
                  }}
                  onMouseLeave={() => {
                    setHoveredNav(null);
                    if (link.hasMega) handleMegaLeave();
                  }}
                >
                  <Link
                    to={link.to}
                    className={`px-2.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 relative group ${
                      active
                        ? 'text-amber-400 font-bold bg-amber-400/8'
                        : 'hover:text-white hover:bg-white/6'
                    }`}
                  >
                    {/* Icon bubble */}
                    <div
                      className={`p-1 rounded-lg transition-transform duration-200 group-hover:scale-110 ${
                        active ? link.bgColor : 'bg-white/5 group-hover:' + link.bgColor
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? link.color : 'text-slate-300 group-hover:' + link.color}`} />
                    </div>

                    <span className="whitespace-nowrap">{link.label}</span>

                    {link.badge && (
                      <span
                        className={`px-1 py-0.5 text-[8px] font-black rounded-full ${
                          link.badge === 'HOT'
                            ? 'bg-rose-500 text-white'
                            : 'bg-emerald-400 text-slate-950'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}

                    {/* Active sliding underline pill */}
                    {active && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>

                  {/* Hover Tooltip */}
                  <AnimatePresence>
                    {hoveredNav === link.to && !link.hasMega && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 rounded-lg bg-[#222736] border border-white/10 text-[11px] text-slate-200 whitespace-nowrap shadow-xl pointer-events-none z-50 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{link.tooltip}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Desktop Search — pushed right with ml-auto */}
          <div ref={searchRef} className="hidden lg:block ml-auto w-60 xl:w-72 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search deals, coupons, stores..."
                className="w-full pl-9 pr-20 py-2 rounded-xl bg-[#1A1D27]/90 hover:bg-[#1A1D27] focus:bg-[#202534] text-xs text-slate-100 placeholder-slate-400 border border-white/10 focus:border-amber-400/60 focus:ring-4 focus:ring-amber-400/10 transition-all outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold rounded-lg transition-colors"
              >
                Search
              </button>
            </form>

            {/* Autocomplete Dropdown in Dark Glass */}
            {searchOpen && searchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1D27] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 p-3 max-h-96 overflow-y-auto animate-in fade-in">
                {searchResults.totalResults === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No results found for "<span className="font-semibold text-white">{searchQuery}</span>".
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Deals Suggestions */}
                    {searchResults.deals?.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>Deals</span>
                        </div>
                        {searchResults.deals.map((d) => (
                          <Link
                            key={d._id || d.slug}
                            to={`/deal/${d.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors"
                          >
                            <img src={d.brandLogo} alt="" className="w-6 h-6 object-contain rounded bg-white p-0.5" />
                            <span className="text-xs text-slate-200 font-medium truncate flex-1">{d.title}</span>
                            <span className="text-xs font-bold text-amber-400 font-mono shrink-0">{d.discountPercentage}% OFF</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Coupons Suggestions */}
                    {searchResults.coupons?.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                          <Ticket className="w-3 h-3" />
                          <span>Coupons</span>
                        </div>
                        {searchResults.coupons.map((c) => (
                          <Link
                            key={c._id || c.code}
                            to="/coupons"
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors"
                          >
                            <span className="text-xs text-slate-200 font-medium truncate">{c.title}</span>
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {c.code}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Brands Suggestions */}
                    {searchResults.brands?.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                          Stores & Brands
                        </div>
                        <div className="flex flex-wrap gap-1.5 px-2">
                          {searchResults.brands.map((b) => (
                            <Link
                              key={b._id || b.slug}
                              to={`/brand/${b.slug}`}
                              onClick={() => setSearchOpen(false)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 text-xs font-semibold transition-colors"
                            >
                              <img src={b.logo} alt="" className="w-4 h-4 object-contain rounded bg-white p-0.5" />
                              <span>{b.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-white/5 pt-2 px-2 text-right">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                      >
                        <span>View all results</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nav removed from here — moved left next to logo above */}

          {/* Right Action Icons & User */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchExpanded(!searchExpanded)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites Icon with Pulse Animation */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-white/5 transition-all group"
              title="Saved Favorites"
            >
              <Heart
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  favoritesCount > 0 ? 'fill-rose-500 text-rose-500 animate-pulse' : ''
                }`}
              />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-md">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth CTA */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                >
                  <UserAvatar user={user} size="sm" />
                  <span className="hidden md:inline-block text-xs font-bold text-slate-200 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1A1D27] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-white/8 flex items-center gap-2.5">
                      <UserAvatar user={user} size="sm" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>
                    </div>

                    <div className="py-1 text-xs text-slate-300">
                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 transition-colors font-medium hover:text-white"
                      >
                        <User className="w-4 h-4 text-amber-400" />
                        <span>My Account & Profile</span>
                      </Link>

                      <Link
                        to="/favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 transition-colors font-medium hover:text-white"
                      >
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>Saved Favorites ({favoritesCount})</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 transition-colors font-medium text-amber-400 hover:text-amber-300"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </div>

                    <div className="border-t border-white/8 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-bold">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="text-xs font-bold shadow-md shadow-amber-500/20">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mega Dropdown for Deals and Brands */}
        <AnimatePresence>
          {megaMenuType && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onMouseEnter={() => handleMegaEnter(megaMenuType)}
              onMouseLeave={handleMegaLeave}
              className="hidden lg:block absolute left-4 right-4 max-w-5xl mx-auto top-full mt-1 bg-[#1A1D27]/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-6 z-50"
            >
              {megaMenuType === 'deals' ? (
                <div className="grid grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Deal Types</span>
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li>
                        <Link to="/deals?isFlash=true" className="hover:text-amber-400 flex items-center justify-between">
                          <span>⚡ Flash Deals</span>
                          <span className="text-[10px] text-amber-400 font-mono">Live</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/deals?isHot=true" className="hover:text-rose-400 flex items-center justify-between">
                          <span>🔥 Hot Steals (70%+ Off)</span>
                          <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1 rounded">HOT</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/deals" className="hover:text-amber-400">
                          🏷️ Today's Price Drops
                        </Link>
                      </li>
                      <li>
                        <Link to="/bank-offers" className="hover:text-emerald-400">
                          💳 Bank Card Offers
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                      Top Categories
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li>
                        <Link to="/category/electronics" className="hover:text-amber-400">
                          📱 Electronics & Mobiles
                        </Link>
                      </li>
                      <li>
                        <Link to="/category/fashion" className="hover:text-amber-400">
                          👗 Fashion & Apparel
                        </Link>
                      </li>
                      <li>
                        <Link to="/category/food-dining" className="hover:text-amber-400">
                          🍔 Food & Delivery
                        </Link>
                      </li>
                      <li>
                        <Link to="/category/travel" className="hover:text-amber-400">
                          ✈️ Travel & Flights
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="col-span-2 bg-[#121520] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Spotlight Offer
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">Amazon Great Summer Sale</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Up to 75% OFF + Extra 10% ICICI Card discount</p>
                      <Link
                        to="/brand/amazon"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-amber-400 hover:text-amber-300"
                      >
                        <span>Claim Deals</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <div className="text-3xl font-black text-amber-400 font-mono">
                      80%<span className="text-xs block text-slate-400">MAX OFF</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>E-Commerce Giants</span>
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li><Link to="/brand/amazon" className="hover:text-amber-400">Amazon Deals & Coupons</Link></li>
                      <li><Link to="/brand/flipkart" className="hover:text-amber-400">Flipkart Super Deals</Link></li>
                      <li><Link to="/brand/myntra" className="hover:text-amber-400">Myntra Fashion Fest</Link></li>
                      <li><Link to="/brand/ajio" className="hover:text-amber-400">Ajio All Stars Sale</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                      Food & Travel
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li><Link to="/brand/swiggy" className="hover:text-emerald-400">Swiggy 50% OFF Codes</Link></li>
                      <li><Link to="/brand/zomato" className="hover:text-emerald-400">Zomato Gold Offers</Link></li>
                      <li><Link to="/brand/makemytrip" className="hover:text-emerald-400">MakeMyTrip Flight Deals</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-2 bg-[#121520] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Brand Directory</span>
                      <h4 className="text-sm font-bold text-white mt-1">Explore 500+ Partner Merchants</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Filter by highest cashback rates and active coupon counts.</p>
                      <Link to="/brands" className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-amber-400 hover:text-amber-300">
                        <span>Browse Brands A-Z</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Search Input Bar */}
        {searchExpanded && (
          <div className="lg:hidden py-3 border-t border-white/10 animate-in fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals, coupons, brands..."
                className="w-full pl-9 pr-20 py-2.5 rounded-xl bg-[#1A1D27] text-xs text-slate-100 outline-none border border-white/15 focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Slideout Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 space-y-2 animate-in slide-in-from-top-4 bg-[#0F1117]">
            <div className="grid grid-cols-2 gap-2 pb-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                      isActive(link.to)
                        ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                        : 'bg-[#1A1D27] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.2 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
