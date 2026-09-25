import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  Flame,
  Zap,
  Tag,
  Ticket,
  CreditCard,
  Building2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Percent,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import hubService from '../services/hubService';
import HeroCanvas from '../components/hero/HeroCanvas';
import RevealSection from '../components/common/RevealSection';
import DealCard from '../components/deals/DealCard';
import FlashDealCard from '../components/deals/FlashDealCard';
import CouponCard from '../components/coupons/CouponCard';
import CategoryCard from '../components/categories/CategoryCard';
import CashbackCard from '../components/cashback/CashbackCard';
import HowCashbackWorks from '../components/cashback/HowCashbackWorks';
import BankOfferCard from '../components/bankOffers/BankOfferCard';
import BrandCard from '../components/brands/BrandCard';
import FestivalBanner from '../components/campaigns/FestivalBanner';
import SEO from '../components/common/SEO';
import { DealCardSkeleton, CouponCardSkeleton } from '../components/common/SkeletonLoader';

const quickStores = [
  { name: 'Amazon', slug: 'amazon', logo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=100&q=80' },
  { name: 'Flipkart', slug: 'flipkart', logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=100&q=80' },
  { name: 'Myntra', slug: 'myntra', logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=100&q=80' },
  { name: 'Ajio', slug: 'ajio', logo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=100&q=80' },
  { name: 'Swiggy', slug: 'swiggy', logo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80' },
  { name: 'Zomato', slug: 'zomato', logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=100&q=80' },
  { name: 'MakeMyTrip', slug: 'makemytrip', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80' },
  { name: 'Croma', slug: 'croma', logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=100&q=80' },
  { name: 'Reliance Digital', slug: 'reliance-digital', logo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=100&q=80' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const wordVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [cashbacks, setCashbacks] = useState([]);
  const [bankOffers, setBankOffers] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [brands, setBrands] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [
          catData,
          dealsData,
          couponsData,
          cbData,
          bankData,
          festData,
          brandsData,
          blogData
        ] = await Promise.all([
          hubService.getCategories(),
          hubService.getDeals({ limit: 12 }),
          hubService.getCoupons({ limit: 8 }),
          hubService.getCashbackOffers(),
          hubService.getBankOffers(),
          hubService.getFestivalCampaigns(),
          hubService.getBrands({ limit: 8 }),
          hubService.getBlogPosts()
        ]);

        setCategories(catData || []);
        const allDeals = dealsData?.deals || [];
        setDeals(allDeals);
        setHotDeals(allDeals.filter(d => d.isHot));
        setFlashDeals(allDeals.filter(d => d.isFlash));
        setCoupons(couponsData?.coupons || []);
        setCashbacks(cbData || []);
        setBankOffers(bankData || []);
        setFestivals(festData || []);
        setBrands(brandsData?.brands || []);
        setBlogPosts(blogData || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const heroHeadlineWords = [
    { text: 'Discover', isGradient: false },
    { text: 'the', isGradient: false },
    { text: 'Best', isGradient: false },
    { text: 'Deals,', isGradient: true },
    { text: 'Coupons', isGradient: true },
    { text: '&', isGradient: true },
    { text: 'Offers', isGradient: true }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 bg-[#0F1117] text-[#F9FAFB]">
      <SEO
        title="PromoteHub | Best Deals, Verified Coupons & Real Cashback in India"
        description="Save more with verified deals, exclusive coupons, cashback offers and promotions from Amazon, Flipkart, Myntra, Swiggy, and 500+ top Indian brands."
      />

      {/* 1. 3D Animated Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 gradient-hero">
        {/* Pinned 3D Hero Three.js Canvas */}
        <HeroCanvas />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge Pill with Shimmer Border */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold mb-6 shadow-lg shadow-amber-500/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>India’s #1 Verified Deals & 3D Savings Platform</span>
          </div>

          {/* Headline with Staggered Entrance */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight font-display flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
          >
            {heroHeadlineWords.map((item, idx) => (
              <motion.span
                key={idx}
                variants={wordVariants}
                className={item.isGradient ? 'text-gradient-amber' : ''}
              >
                {item.text}
              </motion.span>
            ))}
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Save effortlessly with hand-picked verified deals, instant coupon codes, and 100% direct UPI cashback rewards.
          </motion.p>

          {/* Prominent Search Bar with Frosted Glass & Amber Ring */}
          <motion.form
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onSubmit={handleHeroSearchSubmit}
            className="mt-8 sm:mt-10 max-w-2xl mx-auto relative shadow-2xl rounded-2xl sm:rounded-3xl border border-white/10 bg-[#1A1D27]/80 backdrop-blur-2xl p-2 flex items-center hover:border-amber-400/50 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/15 transition-all"
          >
            <div className="pl-3 sm:pl-4 text-slate-400">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search stores, brands, products or coupons..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-400 outline-none bg-transparent"
            />
            <button
              type="submit"
              className="px-5 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-amber-500/25 shrink-0 active:scale-95"
            >
              Search Offers
            </button>
          </motion.form>

          {/* Quick Category & Brand Shortcuts */}
          <div className="mt-8 flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Popular Stores & Shortcuts
            </span>
            <div className="flex items-center justify-center flex-wrap gap-2 max-w-3xl">
              {quickStores.map((st) => (
                <Link
                  key={st.slug}
                  to={`/brand/${st.slug}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1A1D27] hover:bg-[#232838] border border-white/8 hover:border-amber-400/40 shadow-sm text-xs font-semibold text-slate-300 hover:text-amber-400 transition-all card-hover"
                >
                  <img src={st.logo} alt="" className="w-4 h-4 object-contain rounded bg-white p-0.5" />
                  <span>{st.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Trust Highlights Bar with JetBrains Mono numbers */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/8 pt-8 text-center">
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">10,000+</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-bold uppercase">Verified Deals</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100% Real</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-bold uppercase">UPI Cash Back</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">500+</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-bold uppercase">Partner Stores</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">₹4.2 Cr+</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-bold uppercase">User Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Deal Categories Grid (16 categories) */}
      <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-amber-400 mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Browse by Category</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Popular Deal Categories
            </h2>
          </div>
          <Link
            to="/categories"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </RevealSection>

      {/* 3. 🔥 Hot Deals Section */}
      {hotDeals.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-rose-400 mb-1">
                <Flame className="w-4 h-4 fill-rose-500 animate-bounce" />
                <span>Expiring Fast</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                🔥 Hot Deals & Steals
              </h2>
            </div>
            <Link
              to="/deals?isHot=true"
              className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>Explore all hot deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotDeals.slice(0, 4).map((deal) => (
              <DealCard key={deal._id || deal.slug} deal={deal} />
            ))}
          </div>
        </RevealSection>
      )}

      {/* 4. ⚡ Flash Deals Section with Countdown & Stock Meter */}
      {flashDeals.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-amber-400 mb-1">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>Limited Stock Rush</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              ⚡ Flash Sale Spotlight
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {flashDeals.slice(0, 2).map((deal) => (
              <FlashDealCard key={deal._id || deal.slug} deal={deal} />
            ))}
          </div>
        </RevealSection>
      )}

      {/* 5. Festival Banner Showcase */}
      {festivals.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FestivalBanner campaign={festivals[0]} />
        </RevealSection>
      )}

      {/* 6. 🏷️ Today's Best Deals */}
      <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-amber-400 mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Hand-Picked Price Drops</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Today's Best Deals
            </h2>
          </div>
          <Link
            to="/deals"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Browse All Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <DealCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.slice(0, 8).map((deal) => (
              <DealCard key={deal._id || deal.slug} deal={deal} />
            ))}
          </div>
        )}
      </RevealSection>

      {/* 7. 🎟️ Dedicated Coupons Marketplace */}
      <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-amber-400 mb-1">
              <Ticket className="w-3.5 h-3.5" />
              <span>Instant Discounts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Verified Coupon Codes
            </h2>
          </div>
          <Link
            to="/coupons"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Explore All Coupons</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <CouponCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.slice(0, 6).map((coupon) => (
              <CouponCard key={coupon._id || coupon.code} coupon={coupon} />
            ))}
          </div>
        )}
      </RevealSection>

      {/* 8. 💰 Cashback Section & How It Works */}
      <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-emerald-400 mb-1">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Real Bank Payouts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Highest Cashback Stores
            </h2>
          </div>
          <Link
            to="/cashback"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Cashback Stores</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cashbacks.slice(0, 4).map((cb) => (
            <CashbackCard key={cb._id || cb.storeSlug} offer={cb} />
          ))}
        </div>

        {/* 5-Step Visual Guide */}
        <HowCashbackWorks />
      </RevealSection>

      {/* 9. 💳 Bank Offers */}
      {bankOffers.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-amber-400 mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Credit, Debit & EMI Deals</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Exclusive Bank Offers
              </h2>
            </div>
            <Link
              to="/bank-offers"
              className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All Bank Offers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bankOffers.slice(0, 4).map((offer) => (
              <BankOfferCard key={offer._id || offer.bankName} offer={offer} />
            ))}
          </div>
        </RevealSection>
      )}

      {/* 10. 🌟 Trending Brands */}
      {brands.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-amber-400 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Store Directory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Trending Brands & Merchants
              </h2>
            </div>
            <Link
              to="/brands"
              className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Explore All Brands (A-Z)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.slice(0, 8).map((brand) => (
              <BrandCard key={brand._id || brand.slug} brand={brand} />
            ))}
          </div>
        </RevealSection>
      )}

      {/* 11. 📝 Blog / Saving Guides Preview */}
      {blogPosts.length > 0 && (
        <RevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-amber-400 mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Smart Shopping Advice</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Latest Saving Guides & Hacks
              </h2>
            </div>
            <Link
              to="/blog"
              className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Read All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Link
                key={post._id || post.slug}
                to={`/blog/${post.slug}`}
                className="bg-[#1A1D27] hover:bg-[#202534] rounded-3xl border border-white/8 hover:border-amber-400/40 shadow-md hover:shadow-2xl transition-all duration-300 card-hover overflow-hidden flex flex-col justify-between"
              >
                <div className="h-44 w-full bg-[#121520] overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 opacity-90 hover:opacity-100"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                      <span className="font-bold text-amber-400 uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-100 line-clamp-2 hover:text-amber-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/8 flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </RevealSection>
      )}
    </div>
  );
};

export default HomePage;
