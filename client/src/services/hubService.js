import api from './api';
import {
  mockCategories,
  mockBrands,
  mockDeals,
  mockCoupons,
  mockBankOffers,
  mockCashbackOffers,
  mockFestivalCampaigns,
  mockBlogPosts
} from '../data/mockHubData';

const hubService = {
  // Deals
  async getDeals(params = {}) {
    try {
      const res = await api.get('/deals', { params });
      if (res.data?.data?.deals) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('API /deals failed, using fallback data:', err.message);
    }
    // Filter fallback
    let filtered = [...mockDeals];
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(d => d.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.brand && params.brand !== 'All') {
      filtered = filtered.filter(d => d.brandSlug === params.brand.toLowerCase() || d.brandName.toLowerCase() === params.brand.toLowerCase());
    }
    if (params.isHot) filtered = filtered.filter(d => d.isHot);
    if (params.isFlash) filtered = filtered.filter(d => d.isFlash);
    if (params.featured) filtered = filtered.filter(d => d.featured);
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(d => d.title.toLowerCase().includes(q) || d.brandName.toLowerCase().includes(q));
    }
    return {
      deals: filtered,
      pagination: { total: filtered.length, page: 1, limit: 12, totalPages: 1 }
    };
  },

  async getDealByIdOrSlug(identifier) {
    try {
      const res = await api.get(`/deals/${identifier}`);
      if (res.data?.data?.deal) {
        return res.data.data;
      }
    } catch (err) {
      console.warn(`API /deals/${identifier} failed, checking fallback:`, err.message);
    }
    const found = mockDeals.find(d => d.slug === identifier || d._id === identifier) || mockDeals[0];
    const related = mockDeals.filter(d => d.category === found.category && d._id !== found._id).slice(0, 4);
    return { deal: found, relatedDeals: related };
  },

  async recordDealClick(id) {
    try {
      const res = await api.post(`/deals/${id}/track-click`);
      return res.data?.data;
    } catch (err) {
      return { clicks: 1 };
    }
  },

  // Coupons
  async getCoupons(params = {}) {
    try {
      const res = await api.get('/coupons', { params });
      if (res.data?.data?.coupons) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('API /coupons failed, using fallback data:', err.message);
    }
    let filtered = [...mockCoupons];
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(c => c.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.brand && params.brand !== 'All') {
      filtered = filtered.filter(c => c.brandSlug === params.brand.toLowerCase() || c.brandName.toLowerCase() === params.brand.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.brandName.toLowerCase().includes(q));
    }
    return {
      coupons: filtered,
      pagination: { total: filtered.length, page: 1, limit: 12, totalPages: 1 }
    };
  },

  async recordCouponCopy(id) {
    try {
      const res = await api.post(`/coupons/${id}/copy`);
      return res.data?.data;
    } catch (err) {
      return { copies: 1 };
    }
  },

  // Brands
  async getBrands(params = {}) {
    try {
      const res = await api.get('/brands', { params });
      if (res.data?.data?.brands) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('API /brands failed, using fallback data:', err.message);
    }
    let filtered = [...mockBrands];
    if (params.letter && params.letter !== 'All') {
      filtered = filtered.filter(b => b.name.toUpperCase().startsWith(params.letter.toUpperCase()));
    }
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(b => b.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(b => b.name.toLowerCase().includes(q));
    }
    return {
      brands: filtered,
      pagination: { total: filtered.length, page: 1, limit: 24, totalPages: 1 }
    };
  },

  async getBrandBySlug(slug) {
    try {
      const res = await api.get(`/brands/${slug}`);
      if (res.data?.data?.brand) {
        return res.data.data;
      }
    } catch (err) {
      console.warn(`API /brands/${slug} failed, checking fallback:`, err.message);
    }
    const brand = mockBrands.find(b => b.slug === slug.toLowerCase()) || mockBrands[0];
    const deals = mockDeals.filter(d => d.brandSlug === brand.slug);
    const coupons = mockCoupons.filter(c => c.brandSlug === brand.slug);
    return { brand, deals, coupons };
  },

  // Categories
  async getCategories() {
    try {
      const res = await api.get('/categories');
      if (res.data?.data?.categories) {
        return res.data.data.categories;
      }
    } catch (err) {
      console.warn('API /categories failed, using fallback data:', err.message);
    }
    return mockCategories;
  },

  async getCategoryBySlug(slug) {
    try {
      const res = await api.get(`/categories/${slug}`);
      if (res.data?.data?.category) {
        return res.data.data;
      }
    } catch (err) {
      console.warn(`API /categories/${slug} failed, checking fallback:`, err.message);
    }
    const category = mockCategories.find(c => c.slug === slug.toLowerCase()) || mockCategories[0];
    const deals = mockDeals.filter(d => d.category.toLowerCase() === category.name.toLowerCase());
    const coupons = mockCoupons.filter(c => c.category.toLowerCase() === category.name.toLowerCase());
    const brands = mockBrands.filter(b => b.category.toLowerCase() === category.name.toLowerCase());
    return { category, deals, coupons, brands };
  },

  // Bank Offers
  async getBankOffers() {
    try {
      const res = await api.get('/bank-offers');
      if (res.data?.data?.bankOffers) {
        return res.data.data.bankOffers;
      }
    } catch (err) {
      console.warn('API /bank-offers failed, using fallback data:', err.message);
    }
    return mockBankOffers;
  },

  // Cashback Offers
  async getCashbackOffers() {
    try {
      const res = await api.get('/cashback');
      if (res.data?.data?.cashbackOffers) {
        return res.data.data.cashbackOffers;
      }
    } catch (err) {
      console.warn('API /cashback failed, using fallback data:', err.message);
    }
    return mockCashbackOffers;
  },

  // Festival Campaigns
  async getFestivalCampaigns() {
    try {
      const res = await api.get('/festivals');
      if (res.data?.data?.campaigns) {
        return res.data.data.campaigns;
      }
    } catch (err) {
      console.warn('API /festivals failed, using fallback data:', err.message);
    }
    return mockFestivalCampaigns;
  },

  // Blog Posts
  async getBlogPosts() {
    try {
      const res = await api.get('/blog');
      if (res.data?.data?.posts) {
        return res.data.data.posts;
      }
    } catch (err) {
      console.warn('API /blog failed, using fallback data:', err.message);
    }
    return mockBlogPosts;
  },

  async getBlogPostBySlug(slug) {
    try {
      const res = await api.get(`/blog/${slug}`);
      if (res.data?.data?.post) {
        return res.data.data.post;
      }
    } catch (err) {
      console.warn(`API /blog/${slug} failed:`, err.message);
    }
    return mockBlogPosts.find(p => p.slug === slug) || mockBlogPosts[0];
  },

  // Global Search Autocomplete
  async search(query) {
    if (!query || query.trim().length < 2) {
      return { deals: [], coupons: [], brands: [], categories: [], totalResults: 0 };
    }
    try {
      const res = await api.get('/search', { params: { q: query } });
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('API /search failed, searching local fallback:', err.message);
    }
    const q = query.toLowerCase();
    const deals = mockDeals.filter(d => d.title.toLowerCase().includes(q) || d.brandName.toLowerCase().includes(q)).slice(0, 5);
    const coupons = mockCoupons.filter(c => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)).slice(0, 5);
    const brands = mockBrands.filter(b => b.name.toLowerCase().includes(q)).slice(0, 4);
    const categories = mockCategories.filter(c => c.name.toLowerCase().includes(q)).slice(0, 4);
    return {
      query,
      deals,
      coupons,
      brands,
      categories,
      totalResults: deals.length + coupons.length + brands.length + categories.length
    };
  },

  // Admin Analytics
  async getAdminAnalytics() {
    try {
      const res = await api.get('/admin/analytics');
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('API /admin/analytics failed, using fallback metrics:', err.message);
    }
    return {
      kpi: {
        totalUsers: 1420,
        totalDeals: 20,
        activeDeals: 20,
        totalCoupons: 15,
        activeCoupons: 15,
        totalBrands: 12,
        totalClicks: 14850,
        couponCopies: 4920,
        conversionRate: '33.1%'
      },
      popularBrands: mockBrands.slice(0, 6),
      categoryStats: [
        { _id: 'Electronics', count: 48, totalClicks: 4210 },
        { _id: 'Fashion', count: 65, totalClicks: 3890 },
        { _id: 'Mobiles', count: 54, totalClicks: 3120 },
        { _id: 'Food', count: 42, totalClicks: 2150 },
        { _id: 'Travel', count: 31, totalClicks: 1480 }
      ]
    };
  },

  // Admin CRUD operations
  async createDeal(data) {
    const res = await api.post('/deals', data);
    return res.data;
  },
  async updateDeal(id, data) {
    const res = await api.put(`/deals/${id}`, data);
    return res.data;
  },
  async deleteDeal(id) {
    const res = await api.delete(`/deals/${id}`);
    return res.data;
  },

  async createCoupon(data) {
    const res = await api.post('/coupons', data);
    return res.data;
  },
  async updateCoupon(id, data) {
    const res = await api.put(`/coupons/${id}`, data);
    return res.data;
  },
  async deleteCoupon(id) {
    const res = await api.delete(`/coupons/${id}`);
    return res.data;
  },

  async createBrand(data) {
    const res = await api.post('/brands', data);
    return res.data;
  }
};

export default hubService;
