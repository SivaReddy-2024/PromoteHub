import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../context/FavoritesContext';
import hubService from '../../services/hubService';
import {
  Megaphone,
  Search,
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
  Layers,
  ArrowRight
} from 'lucide-react';
import Button from '../common/Button';

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
  const searchRef = useRef(null);

  // Menus
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

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
      setMobileSearchVisible(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/deals', label: 'Deals' },
    { to: '/coupons', label: 'Coupons' },
    { to: '/cashback', label: 'Cashback' },
    { to: '/categories', label: 'Categories' },
    { to: '/brands', label: 'Brands' },
    { to: '/trending', label: 'Trending', badge: 'HOT' },
    { to: '/blog', label: 'Blog' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      {/* Top Banner / Promotional Notice */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 text-white text-[11px] font-semibold py-1 px-4 text-center">
        <span>🎉 Great Indian Festive Deals Live! Get up to 80% OFF + Flat 10% Extra Cashback via PromoteHub</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Megaphone className="w-5 h-5 -rotate-12" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display">
                Promote<span className="text-brand-600">Hub</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-extrabold bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                DEALS & OFFERS
              </span>
            </div>
          </Link>

          {/* Desktop Global Search Bar */}
          <div ref={searchRef} className="hidden lg:block flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search for stores, brands, products or coupons..."
                className="w-full pl-10 pr-24 py-2 rounded-2xl bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-bold rounded-xl transition-colors"
              >
                Search
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {searchOpen && searchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 p-3 max-h-96 overflow-y-auto animate-in fade-in">
                {searchResults.totalResults === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No results found for "<span className="font-semibold">{searchQuery}</span>".
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Deals Suggestions */}
                    {searchResults.deals?.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                          Deals
                        </div>
                        {searchResults.deals.map((d) => (
                          <Link
                            key={d._id || d.slug}
                            to={`/deal/${d.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <img src={d.brandLogo} alt="" className="w-6 h-6 object-contain rounded" />
                            <span className="text-xs text-slate-800 font-medium truncate flex-1">{d.title}</span>
                            <span className="text-xs font-bold text-rose-600 shrink-0">{d.discountPercentage}% OFF</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Coupons Suggestions */}
                    {searchResults.coupons?.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                          Coupons
                        </div>
                        {searchResults.coupons.map((c) => (
                          <Link
                            key={c._id || c.code}
                            to="/coupons"
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-xs text-slate-800 font-medium truncate">{c.title}</span>
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
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
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-xs font-semibold transition-colors"
                            >
                              <img src={b.logo} alt="" className="w-4 h-4 object-contain rounded" />
                              <span>{b.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-2 px-2 text-right">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
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

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-xl transition-all relative flex items-center gap-1 ${
                  isActive(link.to)
                    ? 'text-brand-600 bg-brand-50 font-black'
                    : 'hover:text-brand-600 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1 py-0.2 text-[9px] font-black bg-rose-500 text-white rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & User */}
          <div className="flex items-center gap-2.5">
            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites Icon */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors"
              title="Saved Favorites"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth CTA */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user?.name || 'User'}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                  />
                  <span className="hidden md:inline-block text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1 text-xs text-slate-700">
                      <Link
                        to="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors font-medium"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Account & Profile</span>
                      </Link>

                      <Link
                        to="/favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors font-medium"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Saved Favorites ({favoritesCount})</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors font-medium text-brand-600"
                      >
                        <Shield className="w-4 h-4 text-brand-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
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
                  <Button variant="primary" size="sm" className="text-xs font-bold shadow-md shadow-brand-500/20">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Bar */}
        {mobileSearchVisible && (
          <div className="lg:hidden py-3 border-t border-slate-100 animate-in fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals, coupons, brands..."
                className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-slate-100 text-xs text-slate-800 outline-none border border-transparent focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-xl"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Slideout Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4 space-y-2 animate-in slide-in-from-top-4">
            <div className="grid grid-cols-2 gap-2 pb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                    isActive(link.to)
                      ? 'bg-brand-50 text-brand-600'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.2 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 text-brand-700 text-xs font-bold"
              >
                <Shield className="w-4 h-4 text-brand-600" />
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
