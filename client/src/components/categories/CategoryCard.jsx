import React, { useState, useRef } from 'react';
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
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Percent coordinates for radial glow
    const xPct = Math.round((x / rect.width) * 100);
    const yPct = Math.round((y / rect.height) * 100);
    setGlowPos({ x: xPct, y: yPct });

    // 3D Tilt calculation (max 10 degrees)
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 10;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <Link
      ref={cardRef}
      to={`/category/${category.slug}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(600px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-6px) scale(1.02)`
          : 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="group relative bg-[#1A1D27] hover:bg-[#202534] rounded-2xl sm:rounded-3xl border border-white/8 hover:border-amber-400/40 p-4 sm:p-5 flex flex-col items-center text-center shadow-md hover:shadow-2xl overflow-hidden will-change-transform"
    >
      {/* Interactive Cursor-Tracked Radial Glow */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(circle 90px at ${glowPos.x}% ${glowPos.y}%, rgba(245, 158, 11, 0.22) 0%, transparent 80%)`,
          }}
        />
      )}

      {/* Icon with Amber Glow */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400/10 group-hover:bg-gradient-to-tr group-hover:from-amber-400 group-hover:to-amber-500 text-amber-400 group-hover:text-slate-950 flex items-center justify-center transition-all duration-300 mb-3 shadow-md group-hover:scale-110 relative z-10">
        <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
      </div>

      <h3 className="font-display font-bold text-xs sm:text-sm text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1 relative z-10">
        {category.name}
      </h3>

      <span className="text-[11px] text-slate-400 group-hover:text-amber-300 font-mono mt-0.5 relative z-10">
        {category.offerCount || 24}+ Offers
      </span>
    </Link>
  );
};

export default CategoryCard;
