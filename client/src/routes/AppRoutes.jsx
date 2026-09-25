import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Promotional Hub Pages
import HomePage from '../pages/HomePage';
import DealsListPage from '../pages/DealsListPage';
import DealDetailPage from '../pages/DealDetailPage';
import CouponsPage from '../pages/CouponsPage';
import CashbackPage from '../pages/CashbackPage';
import BankOffersPage from '../pages/BankOffersPage';
import CategoriesPage from '../pages/CategoriesPage';
import CategoryDetailPage from '../pages/CategoryDetailPage';
import BrandsPage from '../pages/BrandsPage';
import BrandDetailPage from '../pages/BrandDetailPage';
import FestivalSalesPage from '../pages/FestivalSalesPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import BlogListPage from '../pages/BlogListPage';
import BlogPostPage from '../pages/BlogPostPage';
import FavoritesPage from '../pages/FavoritesPage';
import AccountPage from '../pages/AccountPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';

// Auth & Existing Creator Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CampaignsListPage from '../pages/CampaignsListPage';
import CampaignDetailPage from '../pages/CampaignDetailPage';
import DashboardPage from '../pages/DashboardPage';
import MyCampaignsPage from '../pages/MyCampaignsPage';
import CreateCampaignPage from '../pages/CreateCampaignPage';
import EditCampaignPage from '../pages/EditCampaignPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* 1. Core Promotional Hub Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/deals" element={<DealsListPage />} />
      <Route path="/deal/:slug" element={<DealDetailPage />} />
      <Route path="/deals/:id" element={<DealDetailPage />} />
      <Route path="/coupons" element={<CouponsPage />} />
      <Route path="/cashback" element={<CashbackPage />} />
      <Route path="/bank-offers" element={<BankOffersPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/category/:slug" element={<CategoryDetailPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/brand/:slug" element={<BrandDetailPage />} />
      <Route path="/festivals" element={<FestivalSalesPage />} />
      <Route path="/trending" element={<DealsListPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<AdminDashboardPage />} />

      {/* User Account / Profile */}
      <Route path="/account" element={<AccountPage />} />
      <Route path="/profile" element={<AccountPage />} />

      {/* Auth Pages */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/account" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/account" replace /> : <RegisterPage />}
      />

      {/* Creator Campaign Pages (Preserved) */}
      <Route path="/campaigns" element={<CampaignsListPage />} />
      <Route path="/campaigns/:id" element={<CampaignDetailPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/my-campaigns" element={<MyCampaignsPage />} />
        <Route path="/campaigns/create" element={<CreateCampaignPage />} />
        <Route path="/campaigns/:id/edit" element={<EditCampaignPage />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
