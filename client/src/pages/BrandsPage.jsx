import React, { useState, useEffect } from 'react';
import { Building2, Search, Filter } from 'lucide-react';
import hubService from '../services/hubService';
import BrandCard from '../components/brands/BrandCard';
import SEO from '../components/common/SEO';
import { BrandCardSkeleton } from '../components/common/SkeletonLoader';

const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await hubService.getCategories();
        setCategories(cats || []);
      } catch (e) {}
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const params = {
          letter: selectedLetter !== 'All' ? selectedLetter : undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          limit: 50
        };
        const res = await hubService.getBrands(params);
        setBrands(res.brands || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [selectedLetter, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title="All Brands & Stores Directory (A-Z) | Amazon, Flipkart, Myntra"
        description="Browse all 500+ Indian merchant stores and brands on PromoteHub. Find active coupon codes, discount sales, and cashback rates."
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
          <Building2 className="w-3.5 h-3.5" />
          <span>Brand Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Partner Stores & Brands Directory
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
          Browse by store name or filter alphabetically from A to Z to discover coupons and exclusive cashback rates.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store name (e.g. Amazon, Nike, Swiggy)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-brand-500 shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 outline-none cursor-pointer shadow-sm"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Alphabet A-Z bar */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-y border-slate-100">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`w-8 h-8 rounded-xl text-xs font-extrabold flex items-center justify-center shrink-0 transition-all ${
                selectedLetter === letter
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <BrandCardSkeleton key={n} />
          ))}
        </div>
      ) : brands.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <BrandCard key={brand._id || brand.slug} brand={brand} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 font-display">No Brands Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No brand names matched letter "{selectedLetter}" or query "{searchQuery}".
          </p>
          <button
            onClick={() => { setSelectedLetter('All'); setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandsPage;
