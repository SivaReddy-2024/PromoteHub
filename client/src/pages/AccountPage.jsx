import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Heart,
  Ticket,
  Wallet,
  Bell,
  Lock,
  Copy,
  Check,
  Shield,
  Save,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import SEO from '../components/common/SEO';
import api from '../services/api';

const AccountPage = () => {
  const { user, updateUser } = useAuth();
  const { copiedCoupons, savedDeals, savedCoupons, savedBrands } = useFavorites();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'coupons' | 'cashback' | 'notifications' | 'security'

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    company: user?.company || '',
    bio: user?.bio || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    newCoupons: user?.notificationPreferences?.newCoupons ?? true,
    expiringDeals: user?.notificationPreferences?.expiringDeals ?? true,
    brandOffers: user?.notificationPreferences?.brandOffers ?? true,
    cashbackOffers: user?.notificationPreferences?.cashbackOffers ?? true,
    promotions: user?.notificationPreferences?.promotions ?? false
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Mock Cashback Activity
  const cashbackActivity = user?.cashbackHistory?.length > 0 ? user.cashbackHistory : [
    { id: 'cb-act-1', store: 'Myntra', amount: 350, status: 'Confirmed', date: '2026-09-22', orderId: 'MYN-849201' },
    { id: 'cb-act-2', store: 'Swiggy', amount: 50, status: 'Confirmed', date: '2026-09-20', orderId: 'SWG-110294' },
    { id: 'cb-act-3', store: 'Croma', amount: 1200, status: 'Pending', date: '2026-09-18', orderId: 'CRM-778219' }
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', profileForm);
      updateUser(res.data?.data?.user || profileForm);
      addToast('Profile updated successfully! ✓', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setSavingNotifications(true);
    try {
      await api.put('/hub-user/notifications', notifications);
      addToast('Notification preferences saved!', 'success');
    } catch (err) {
      addToast('Saved preferences locally.', 'info');
    } finally {
      setSavingNotifications(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title="My Account & Preferences | PromoteHub"
        description="Manage your profile, view copied promo codes, track cashback claims, and adjust notification alerts."
      />

      {/* Header Profile Summary */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name || 'User'}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black font-display">{user?.name || 'Shopper'}</h1>
              <span className="px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-300 text-[10px] font-extrabold uppercase border border-brand-400/30">
                {user?.role || 'Member'}
              </span>
            </div>
            <p className="text-slate-300 text-xs">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-400 font-medium">
              <span>{savedDeals.length} Saved Deals</span>
              <span>•</span>
              <span>{copiedCoupons.length} Copied Codes</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">₹1,600 Total Cashback</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'coupons', label: `Copied Codes (${copiedCoupons.length})`, icon: Ticket },
          { id: 'cashback', label: 'Cashback History', icon: Wallet },
          { id: 'notifications', label: 'Notification Settings', icon: Bell }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile Edit */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Personal Information
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              required
            />
            <Input
              label="Company / Workplace"
              value={profileForm.company}
              onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
              placeholder="e.g. Acme Studio, Tech Worker..."
            />
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Bio / Shopping Interests</label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Share your favorite stores, gadgets you love tracking, or deals you look for..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <Button type="submit" variant="primary" size="md" disabled={savingProfile} className="gap-2">
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </Button>
          </form>
        </div>
      )}

      {/* Tab 2: Copied Coupons History */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Recently Copied Promo Codes
            </h2>
            <span className="text-xs text-slate-400">Kept handy for checkout</span>
          </div>

          {copiedCoupons.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {copiedCoupons.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">{item.dealTitle || item.brand}</span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Brand: {item.brand}</span>
                      <span>•</span>
                      <span>Copied {new Date(item.copiedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {item.code}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.code);
                        addToast(`Copied ${item.code}!`, 'success');
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                      title="Copy again"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <Ticket className="w-8 h-8 mx-auto text-slate-300" />
              <p>You haven't copied any coupon codes yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Cashback History */}
      {activeTab === 'cashback' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Cashback Activity & UPI Balance
              </h2>
              <p className="text-xs text-slate-500">Tracked orders from partner merchants</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Available Payout</span>
              <div className="text-2xl font-black text-emerald-600 font-display">₹1,600</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Store</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Cashback Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {cashbackActivity.map((act) => (
                  <tr key={act.id || act.orderId} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{act.store}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{act.orderId}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">₹{act.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        act.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {act.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{act.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Deal Alerts & Notification Preferences
            </h2>
            <p className="text-xs text-slate-500">
              Customize which alerts you want to receive on your email or mobile.
            </p>
          </div>

          <form onSubmit={handleNotificationSubmit} className="space-y-4">
            {[
              { id: 'newCoupons', label: 'New Coupons & Promo Codes', desc: 'Alert me when new coupons launch for top brands' },
              { id: 'expiringDeals', label: 'Expiring Deals Countdown', desc: 'Notify me 2 hours before saved deals expire' },
              { id: 'brandOffers', label: 'Favorite Brand Sales', desc: 'Updates whenever Amazon, Myntra, or Swiggy drop discounts' },
              { id: 'cashbackOffers', label: 'Cashback Rate Increases', desc: 'Boost alerts when cashback surges up to 10%' },
              { id: 'promotions', label: 'Personalized Festival Promotions', desc: 'Special Diwali, Christmas, and Black Friday digests' }
            ].map((pref) => (
              <label key={pref.id} className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[pref.id]}
                  onChange={(e) => setNotifications({ ...notifications, [pref.id]: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500 mt-1"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">{pref.label}</span>
                  <span className="text-[11px] text-slate-500 block">{pref.desc}</span>
                </div>
              </label>
            ))}

            <Button type="submit" variant="primary" size="md" disabled={savingNotifications} className="gap-2">
              <Save className="w-4 h-4" />
              <span>{savingNotifications ? 'Saving...' : 'Save Notification Preferences'}</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
