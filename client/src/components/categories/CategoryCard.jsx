import React from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Shirt,
  Sparkles,
  ShoppingBag,
  Utensils,
  Plane,
  Smartphone,
  Home,
  Zap,
  CreditCard,
  Film,
  HeartPulse,
  GraduationCap,
  Car,
  Code,
  LayoutGrid
} from 'lucide-react';

const iconMap = {
  Laptop,
  Shirt,
  Sparkles,
  ShoppingBag,
  Utensils,
  Plane,
  Smartphone,
  Home,
  Zap,
  CreditCard,
  Film,
  HeartPulse,
  GraduationCap,
  Car,
  Code,
  Grid: LayoutGrid
};

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.icon] || LayoutGrid;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative bg-white hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/50 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-brand-300 p-4 sm:p-5 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 card-hover"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50/80 group-hover:bg-gradient-to-tr group-hover:from-brand-600 group-hover:to-indigo-500 text-brand-600 group-hover:text-white flex items-center justify-center transition-all duration-300 mb-3 shadow-sm group-hover:scale-110">
        <IconComponent className="w-6 h-6 transition-transform group-hover:scale-105" />
      </div>

      <h3 className="font-display font-bold text-xs sm:text-sm text-slate-800 group-hover:text-brand-700 transition-colors line-clamp-1">
        {category.name}
      </h3>

      <span className="text-[11px] text-slate-400 group-hover:text-slate-500 font-medium mt-0.5">
        {category.offerCount || 24}+ Offers
      </span>
    </Link>
  );
};

export default CategoryCard;
