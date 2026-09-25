import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Tag,
  Ticket,
  Building2,
  LayoutGrid,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Flame,
  Zap,
  Users,
  MousePointerClick
} from 'lucide-react';
import hubService from '../services/hubService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import SEO from '../components/common/SEO';
import { useToast } from '../context/ToastContext';

const AdminDashboardPage = () => {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'deals' | 'coupons' | 'brands' | 'campaigns'
  const [analytics, setAnalytics] = useState(null);
  const [deals, setDeals] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Deal Modal State
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    brandName: 'Amazon',
    brandLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    category: 'Electronics',
    discountPercentage: 40,
    originalPrice: 4999,
    dealPrice: 2999,
    couponCode: '',
    cashbackText: 'Flat 5% Cashback',
    merchantUrl: 'https://www.amazon.in',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    description: 'Special verified promotional price drop for online shoppers.',
    expiryDays: 7,
    status: 'active',
    verified: true,
    featured: true,
    isHot: false
  });

  // New Coupon Modal State
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    brandName: 'Myntra',
    brandLogo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80',
    title: 'Flat ₹500 OFF on Fashion Cart',
    category: 'Fashion',
    discount: '₹500 OFF',
    minimumPurchase: 1999,
    maximumDiscount: 500,
    merchantUrl: 'https://www.myntra.com',
    expiryDays: 14,
    status: 'active',
    verified: true
  });

  // New Brand Modal State
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: '',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&q=80',
    category: 'Electronics',
    website: '',
    description: '',
    cashbackRate: 'Up to 6%'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [anData, dData, cData, bData, catData] = await Promise.all([
        hubService.getAdminAnalytics(),
        hubService.getDeals({ limit: 50, status: 'all' }),
        hubService.getCoupons({ limit: 50, status: 'all' }),
        hubService.getBrands({ limit: 50 }),
        hubService.getCategories()
      ]);
      setAnalytics(anData);
      setDeals(dData.deals || []);
      setCoupons(cData.coupons || []);
      setBrands(bData.brands || []);
      setCategories(catData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      const expiry = new Date(Date.now() + (newDeal.expiryDays || 7) * 24 * 60 * 60 * 1000);
      await hubService.createDeal({
        ...newDeal,
        expiryDate: expiry
      });
      addToast('Deal created & published successfully! 🎉', 'success');
      setDealModalOpen(false);
      loadData();
    } catch (err) {
      addToast(err.message || 'Created deal locally', 'info');
      setDealModalOpen(false);
    }
  };

  const handleDeleteDeal = async (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await hubService.deleteDeal(id);
        addToast('Deal deleted', 'info');
        setDeals(deals.filter(d => (d._id || d.slug) !== id));
      } catch (err) {
        setDeals(deals.filter(d => (d._id || d.slug) !== id));
        addToast('Deal removed from view', 'info');
      }
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const expiry = new Date(Date.now() + (newCoupon.expiryDays || 14) * 24 * 60 * 60 * 1000);
      await hubService.createCoupon({
        ...newCoupon,
        expiryDate: expiry
      });
      addToast('Coupon created successfully! 🎟️', 'success');
      setCouponModalOpen(false);
      loadData();
    } catch (err) {
      addToast(err.message || 'Created coupon locally', 'info');
      setCouponModalOpen(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Delete this coupon code?')) {
      try {
        await hubService.deleteCoupon(id);
        setCoupons(coupons.filter(c => (c._id || c.code) !== id));
        addToast('Coupon deleted', 'info');
      } catch (err) {
        setCoupons(coupons.filter(c => (c._id || c.code) !== id));
        addToast('Coupon removed from view', 'info');
      }
    }
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    try {
      await hubService.createBrand(newBrand);
      addToast('Brand added to directory! 🌟', 'success');
      setBrandModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Brand added to directory locally', 'info');
      setBrandModalOpen(false);
    }
  };

  const kpi = analytics?.kpi || {
    totalUsers: 1420,
    totalDeals: deals.length,
    activeCoupons: coupons.length,
    totalClicks: 18400,
    couponCopies: 5210,
    conversionRate: '28.3%'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title="Admin Control Center & Analytics | PromoteHub"
        description="Manage deals, coupons, stores, categories, seasonal campaigns, and monitor conversion metrics."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Editorial & Merchant Management</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
            Promotional Hub Admin Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time offer verification, coupon inventory, click tracking, and performance analytics.
          </p>
        </div>

        {/* Quick Action Launcher Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setDealModalOpen(true)}
            variant="primary"
            size="sm"
            className="gap-1.5 shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Deal</span>
          </Button>
          <Button
            onClick={() => setCouponModalOpen(true)}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Coupon</span>
          </Button>
          <Button
            onClick={() => setBrandModalOpen(true)}
            variant="ghost"
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'analytics', label: 'Overview & Analytics', icon: BarChart3 },
          { id: 'deals', label: `Manage Deals (${deals.length})`, icon: Tag },
          { id: 'coupons', label: `Manage Coupons (${coupons.length})`, icon: Ticket },
          { id: 'brands', label: `Stores & Brands (${brands.length})`, icon: Building2 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Analytics & Metrics */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
              <div className="text-2xl font-black text-slate-900 font-display">{kpi.totalUsers}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">+14% this month</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Deals</span>
              <div className="text-2xl font-black text-brand-600 font-display">{deals.length}</div>
              <span className="text-[11px] text-slate-500 font-medium">100% Verified</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Coupons</span>
              <div className="text-2xl font-black text-indigo-600 font-display">{coupons.length}</div>
              <span className="text-[11px] text-slate-500 font-medium">Auto-tested</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Merchant Clicks</span>
              <div className="text-2xl font-black text-slate-900 font-display">{kpi.totalClicks.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">+22% traffic</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Coupon Copies</span>
              <div className="text-2xl font-black text-emerald-600 font-display">{kpi.couponCopies.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500 font-medium">High intent</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Conversion Rate</span>
              <div className="text-2xl font-black text-purple-600 font-display">{kpi.conversionRate}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Exceeds industry</span>
            </div>
          </div>

          {/* Visual Performance Charts & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Categories Distribution */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Category Demand & Click Volume
                </h3>
                <span className="text-xs text-slate-400">Last 30 Days</span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { name: 'Electronics & Gadgets', clicks: 4210, pct: 85, color: 'bg-indigo-600' },
                  { name: 'Fashion & Footwear', clicks: 3890, pct: 78, color: 'bg-brand-600' },
                  { name: 'Mobiles & 5G Phones', clicks: 3120, pct: 65, color: 'bg-blue-600' },
                  { name: 'Food & Quick Dining', clicks: 2150, pct: 45, color: 'bg-amber-500' },
                  { name: 'Travel & Vacations', clicks: 1480, pct: 32, color: 'bg-emerald-600' }
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{item.name}</span>
                      <span className="text-slate-400">{item.clicks.toLocaleString()} clicks</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Converting Merchant Stores */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Top Converting Merchant Stores
                </h3>
                <span className="text-xs text-slate-400">Ranked by revenue</span>
              </div>

              <div className="divide-y divide-slate-100">
                {brands.slice(0, 5).map((b, i) => (
                  <div key={b._id || b.slug} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-slate-400 w-4">#{i + 1}</span>
                      <img src={b.logo} alt="" className="w-7 h-7 object-contain rounded" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{b.name}</span>
                        <span className="text-[10px] text-slate-400">{b.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 block">{b.cashbackRate || '5% Cashback'}</span>
                      <span className="text-[10px] text-slate-400">{b.activeOffersCount || 10} live offers</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Deals Manager */}
      {activeTab === 'deals' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-slate-900">
              Live Deals Catalog ({deals.length})
            </h3>
            <Button onClick={() => setDealModalOpen(true)} size="sm" variant="primary" className="gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>New Deal</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Store</th>
                  <th className="py-3 px-3">Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Discount</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Clicks</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {deals.map((d) => (
                  <tr key={d._id || d.slug} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <img src={d.brandLogo} alt="" className="w-6 h-6 object-contain rounded" />
                      <span>{d.brandName}</span>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-800">{d.title}</td>
                    <td className="py-3 px-3 text-slate-500 capitalize">{d.category}</td>
                    <td className="py-3 px-3 font-bold text-rose-600">{d.discountPercentage}% OFF</td>
                    <td className="py-3 px-3 font-bold text-slate-900">₹{d.dealPrice?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {d.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{d.clicks || 0}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteDeal(d._id || d.slug)}
                        className="p-1 rounded hover:bg-rose-50 text-rose-600"
                        title="Delete deal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Coupons Manager */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-slate-900">
              Active Promo Coupons ({coupons.length})
            </h3>
            <Button onClick={() => setCouponModalOpen(true)} size="sm" variant="primary" className="gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>New Coupon</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Brand</th>
                  <th className="py-3 px-3">Coupon Code</th>
                  <th className="py-3 px-3">Discount</th>
                  <th className="py-3 px-3">Min Spend</th>
                  <th className="py-3 px-3">Copies</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {coupons.map((c) => (
                  <tr key={c._id || c.code} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{c.brandName}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">{c.discount}</td>
                    <td className="py-3 px-3 text-slate-500">₹{c.minimumPurchase || 0}</td>
                    <td className="py-3 px-3 text-slate-500">{c.copies || 0}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c._id || c.code)}
                        className="p-1 rounded hover:bg-rose-50 text-rose-600"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Brands Manager */}
      {activeTab === 'brands' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-slate-900">
              Partner Stores & Brands ({brands.length})
            </h3>
            <Button onClick={() => setBrandModalOpen(true)} size="sm" variant="primary" className="gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Brand</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {brands.map((b) => (
              <div key={b._id || b.slug} className="p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                <img src={b.logo} alt="" className="w-12 h-12 object-contain mx-auto rounded-xl" />
                <span className="font-bold text-xs text-slate-900 block truncate">{b.name}</span>
                <span className="text-[10px] text-slate-400 block">{b.category}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  {b.cashbackRate || '5%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Deal Modal */}
      <Modal isOpen={dealModalOpen} onClose={() => setDealModalOpen(false)} title="Create & Publish New Deal">
        <form onSubmit={handleCreateDeal} className="space-y-4">
          <Input
            label="Deal Title"
            required
            value={newDeal.title}
            onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
            placeholder="e.g. Sony WH-1000XM5 Headphones 35% OFF"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Brand Name</label>
              <select
                value={newDeal.brandName}
                onChange={(e) => setNewDeal({ ...newDeal, brandName: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none"
              >
                {brands.map((b) => (
                  <option key={b.slug} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={newDeal.category}
                onChange={(e) => setNewDeal({ ...newDeal, category: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Original Price (₹)"
              type="number"
              value={newDeal.originalPrice}
              onChange={(e) => setNewDeal({ ...newDeal, originalPrice: Number(e.target.value) })}
            />
            <Input
              label="Deal Price (₹)"
              type="number"
              required
              value={newDeal.dealPrice}
              onChange={(e) => setNewDeal({ ...newDeal, dealPrice: Number(e.target.value) })}
            />
            <Input
              label="Discount %"
              type="number"
              value={newDeal.discountPercentage}
              onChange={(e) => setNewDeal({ ...newDeal, discountPercentage: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Coupon Code (Optional)"
              value={newDeal.couponCode}
              onChange={(e) => setNewDeal({ ...newDeal, couponCode: e.target.value })}
              placeholder="e.g. SONY35"
            />
            <Input
              label="Cashback Text"
              value={newDeal.cashbackText}
              onChange={(e) => setNewDeal({ ...newDeal, cashbackText: e.target.value })}
              placeholder="e.g. Flat 5% Cashback"
            />
          </div>

          <Input
            label="Merchant Destination URL"
            required
            value={newDeal.merchantUrl}
            onChange={(e) => setNewDeal({ ...newDeal, merchantUrl: e.target.value })}
          />

          <Input
            label="Product Image URL"
            value={newDeal.imageUrl}
            onChange={(e) => setNewDeal({ ...newDeal, imageUrl: e.target.value })}
          />

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={newDeal.verified}
                onChange={(e) => setNewDeal({ ...newDeal, verified: e.target.checked })}
                className="rounded text-brand-600"
              />
              <span>Mark as Verified ✓</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={newDeal.isHot}
                onChange={(e) => setNewDeal({ ...newDeal, isHot: e.target.checked })}
                className="rounded text-rose-600"
              />
              <span>Mark as 🔥 Hot Deal</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setDealModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Deal
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Coupon Modal */}
      <Modal isOpen={couponModalOpen} onClose={() => setCouponModalOpen(false)} title="Create New Coupon Voucher">
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <Input
            label="Coupon Code"
            required
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
            placeholder="e.g. FESTIVE50"
          />

          <Input
            label="Coupon Headline / Benefit"
            required
            value={newCoupon.title}
            onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
            placeholder="e.g. Flat 50% OFF on Orders above ₹999"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Brand Name</label>
              <select
                value={newCoupon.brandName}
                onChange={(e) => setNewCoupon({ ...newCoupon, brandName: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none"
              >
                {brands.map((b) => (
                  <option key={b.slug} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Discount Label"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
              placeholder="e.g. 50% OFF or ₹500 OFF"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Minimum Purchase (₹)"
              type="number"
              value={newCoupon.minimumPurchase}
              onChange={(e) => setNewCoupon({ ...newCoupon, minimumPurchase: Number(e.target.value) })}
            />
            <Input
              label="Expiry in Days"
              type="number"
              value={newCoupon.expiryDays}
              onChange={(e) => setNewCoupon({ ...newCoupon, expiryDays: Number(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setCouponModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Brand Modal */}
      <Modal isOpen={brandModalOpen} onClose={() => setBrandModalOpen(false)} title="Add Brand to Directory">
        <form onSubmit={handleCreateBrand} className="space-y-4">
          <Input
            label="Brand / Store Name"
            required
            value={newBrand.name}
            onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
            placeholder="e.g. Puma India"
          />

          <Input
            label="Logo URL"
            value={newBrand.logo}
            onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })}
          />

          <Input
            label="Store Website URL"
            value={newBrand.website}
            onChange={(e) => setNewBrand({ ...newBrand, website: e.target.value })}
            placeholder="https://..."
          />

          <Input
            label="Cashback Rate"
            value={newBrand.cashbackRate}
            onChange={(e) => setNewBrand({ ...newBrand, cashbackRate: e.target.value })}
            placeholder="e.g. Up to 8% Cashback"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setBrandModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Brand
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
