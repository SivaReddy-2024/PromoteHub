import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import api from '../services/api';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { addToast } = useToast();

  const [savedDeals, setSavedDeals] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_saved_deals');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [savedCoupons, setSavedCoupons] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_saved_coupons');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [savedBrands, setSavedBrands] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_saved_brands');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [copiedCoupons, setCopiedCoupons] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_copied_coupons');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ph_saved_deals', JSON.stringify(savedDeals));
  }, [savedDeals]);

  useEffect(() => {
    localStorage.setItem('ph_saved_coupons', JSON.stringify(savedCoupons));
  }, [savedCoupons]);

  useEffect(() => {
    localStorage.setItem('ph_saved_brands', JSON.stringify(savedBrands));
  }, [savedBrands]);

  useEffect(() => {
    localStorage.setItem('ph_copied_coupons', JSON.stringify(copiedCoupons));
  }, [copiedCoupons]);

  // Toggle Favorite Deal
  const toggleFavoriteDeal = (deal) => {
    const dealId = deal._id || deal.slug;
    setSavedDeals((prev) => {
      const exists = prev.some((d) => (d._id || d.slug) === dealId);
      if (exists) {
        addToast(`Removed "${deal.brandName}" deal from favorites`, 'info');
        return prev.filter((d) => (d._id || d.slug) !== dealId);
      } else {
        addToast(`Saved deal to your favorites! ❤️`, 'success');
        return [...prev, deal];
      }
    });

    // Fire API async if logged in
    api.post('/hub-user/favorite', { type: 'deals', id: dealId }).catch(() => {});
  };

  const isDealFavorited = (idOrSlug) => {
    return savedDeals.some((d) => d._id === idOrSlug || d.slug === idOrSlug);
  };

  // Toggle Favorite Coupon
  const toggleFavoriteCoupon = (coupon) => {
    const couponId = coupon._id || coupon.code;
    setSavedCoupons((prev) => {
      const exists = prev.some((c) => (c._id || c.code) === couponId);
      if (exists) {
        addToast(`Removed coupon "${coupon.code}" from favorites`, 'info');
        return prev.filter((c) => (c._id || c.code) !== couponId);
      } else {
        addToast(`Saved coupon "${coupon.code}" to favorites! ❤️`, 'success');
        return [...prev, coupon];
      }
    });

    api.post('/hub-user/favorite', { type: 'coupons', id: couponId }).catch(() => {});
  };

  const isCouponFavorited = (idOrCode) => {
    return savedCoupons.some((c) => c._id === idOrCode || c.code === idOrCode);
  };

  // Toggle Favorite Brand
  const toggleFavoriteBrand = (brand) => {
    const brandId = brand._id || brand.slug;
    setSavedBrands((prev) => {
      const exists = prev.some((b) => (b._id || b.slug) === brandId);
      if (exists) {
        addToast(`Removed ${brand.name} from favorite brands`, 'info');
        return prev.filter((b) => (b._id || b.slug) !== brandId);
      } else {
        addToast(`Added ${brand.name} to favorite brands! ⭐`, 'success');
        return [...prev, brand];
      }
    });

    api.post('/hub-user/favorite', { type: 'brands', id: brandId }).catch(() => {});
  };

  const isBrandFavorited = (idOrSlug) => {
    return savedBrands.some((b) => b._id === idOrSlug || b.slug === idOrSlug);
  };

  // Record Copied Coupon
  const recordCopiedCoupon = (coupon) => {
    navigator.clipboard.writeText(coupon.code || coupon);
    addToast(`Coupon code ${coupon.code || coupon} copied to clipboard! 📋`, 'success');

    const entry = {
      code: coupon.code || coupon,
      brand: coupon.brandName || coupon.brand || 'PromoteHub',
      dealTitle: coupon.title || 'Special Promotion',
      copiedAt: new Date().toISOString()
    };

    setCopiedCoupons((prev) => [entry, ...prev.filter((c) => c.code !== entry.code)].slice(0, 20));

    api.post('/hub-user/copied-coupon', entry).catch(() => {});
  };

  return (
    <FavoritesContext.Provider
      value={{
        savedDeals,
        savedCoupons,
        savedBrands,
        copiedCoupons,
        toggleFavoriteDeal,
        isDealFavorited,
        toggleFavoriteCoupon,
        isCouponFavorited,
        toggleFavoriteBrand,
        isBrandFavorited,
        recordCopiedCoupon,
        favoritesCount: savedDeals.length + savedCoupons.length + savedBrands.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
