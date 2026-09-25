import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Tag, Ticket, LayoutGrid, User, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../context/FavoritesContext';

const MobileBottomNav = () => {
  const { isAuthenticated } = useAuth();
  const { favoritesCount } = useFavorites();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/deals', label: 'Deals', icon: Tag },
    { to: '/coupons', label: 'Coupons', icon: Ticket },
    { to: '/categories', label: 'Categories', icon: LayoutGrid },
    {
      to: isAuthenticated ? '/account' : '/login',
      label: isAuthenticated ? 'Account' : 'Login',
      icon: User
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all relative ${
                  isActive
                    ? 'text-brand-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
