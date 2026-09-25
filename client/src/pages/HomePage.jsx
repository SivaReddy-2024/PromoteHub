import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <SEO
        title="PromoteHub | Best Deals, Verified Coupons & Real Cashback in India"
        description="Save more with verified deals, exclusive coupons, cashback offers and promotions from Amazon, Flipkart, Myntra, Swiggy, and 500+ top Indian brands."
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
            <span>India’s #1 Verified Deals & Coupon Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Discover the Best{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Deals, Coupons & Offers
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-5 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Save more with verified deals, exclusive coupons, cashback offers and promotions from your favorite brands.
          </p>

          {/* Prominent Search Bar */}
          <form
            onSubmit={handleHeroSearchSubmit}
            className="mt-8 sm:mt-10 max-w-2xl mx-auto relative shadow-2xl rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-2 flex items-center"
          >
            <div className="pl-3 sm:pl-4 text-slate-400">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search for stores, brands, products or coupons..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            />
            <button
              type="submit"
              className="px-5 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl transition-all shadow-md shadow-brand-500/25 shrink-0"
            >
              Search Offers
            </button>
          </form>

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
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-700 hover:text-brand-600 hover:border-brand-300 transition-all card-hover"
                >
                  <img src={st.logo} alt="" className="w-4 h-4 object-contain rounded" />
                  <span>{st.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Trust Highlights Bar */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200/60 pt-8 text-center">
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">10,000+</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-bold uppercase">Verified Deals</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-display">100% Real</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-bold uppercase">UPI Cash Back</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-brand-600 font-display">500+</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-bold uppercase">Partner Stores</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-amber-500 font-display">₹4.2 Cr+</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-bold uppercase">User Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Deal Categories Grid (16 categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-brand-600 mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Browse by Category</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Popular Deal Categories
            </h2>
          </div>
          <Link
            to="/categories"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All 16 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {/* 3. 🔥 Hot Deals Section */}
      {hotDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-rose-600 mb-1">
                <Flame className="w-4 h-4 fill-rose-500 animate-bounce" />
                <span>Expiring Fast</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                🔥 Hot Deals & Steals
              </h2>
            </div>
            <Link
              to="/deals?isHot=true"
              className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
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
        </section>
      )}

      {/* 4. ⚡ Flash Deals Section with Countdown & Stock Meter */}
      {flashDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-amber-600 mb-1">
              <Zap className="w-4 h-4 fill-amber-500" />
              <span>Limited Stock Rush</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              ⚡ Flash Sale Spotlight
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {flashDeals.slice(0, 2).map((deal) => (
              <FlashDealCard key={deal._id || deal.slug} deal={deal} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Festival Banner Showcase */}
      {festivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FestivalBanner campaign={festivals[0]} />
        </section>
      )}

      {/* 6. 🏷️ Today's Best Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-brand-600 mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Hand-Picked Price Drops</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Today's Best Deals
            </h2>
          </div>
          <Link
            to="/deals"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
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
      </section>

      {/* 7. 🎟️ Dedicated Coupons Marketplace */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-brand-600 mb-1">
              <Ticket className="w-3.5 h-3.5" />
              <span>Instant Discounts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Verified Coupon Codes
            </h2>
          </div>
          <Link
            to="/coupons"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
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
      </section>

      {/* 8. 💰 Cashback Section & How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-emerald-600 mb-1">
              <Zap className="w-3.5 h-3.5 fill-emerald-500" />
              <span>Real Bank Payouts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Highest Cashback Stores
            </h2>
          </div>
          <Link
            to="/cashback"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
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
      </section>

      {/* 9. 💳 Bank Offers */}
      {bankOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-blue-600 mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Credit, Debit & EMI Deals</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Exclusive Bank Offers
              </h2>
            </div>
            <Link
              to="/bank-offers"
              className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
        </section>
      )}

      {/* 10. 🌟 Trending Brands */}
      {brands.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-brand-600 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Store Directory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Trending Brands & Merchants
              </h2>
            </div>
            <Link
              to="/brands"
              className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
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
        </section>
      )}

      {/* 11. 📝 Blog / Saving Guides Preview */}
      {blogPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold text-brand-600 mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Smart Shopping Advice</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Latest Saving Guides & Hacks
              </h2>
            </div>
            <Link
              to="/blog"
              className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
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
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 card-hover overflow-hidden flex flex-col justify-between"
              >
                <div className="h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span className="font-bold text-brand-600 uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-900 line-clamp-2 hover:text-brand-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
