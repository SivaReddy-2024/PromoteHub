import React, { useState, useEffect } from 'react';
import { LayoutGrid, Tag, ArrowRight } from 'lucide-react';
import hubService from '../services/hubService';
import CategoryCard from '../components/categories/CategoryCard';
import SEO from '../components/common/SEO';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      setLoading(true);
      try {
        const data = await hubService.getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title="Browse Deals by Category | Electronics, Fashion, Mobiles, Food"
        description="Explore 16 top shopping categories on PromoteHub with active coupons, flash discounts, and bank cashback."
      />

      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Category Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          All Deal Categories
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
          Discover verified deals, promo codes, and merchant cashbacks organized across 16 core Indian consumer sectors.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
