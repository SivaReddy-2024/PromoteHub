import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import campaignService from '../services/campaignService';
import {
  Megaphone,
  FolderKanban,
  FileText,
  CheckCircle,
  PlusCircle,
  TrendingUp,
  Compass,
  Sparkles,
  BarChart3
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentCampaignsList from '../components/dashboard/RecentCampaignsList';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    paused: 0,
    completed: 0
  });
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await campaignService.getUserCampaignStats();
        setStats(data.stats || {});
        setRecentCampaigns(data.recentCampaigns || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading executive dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Marketing Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Marketer'}!
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm max-w-xl">
            Track your promotional campaign milestones, update offers, and expand your audience reach.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/campaigns/create">
            <Button
              variant="primary"
              size="md"
              className="bg-white text-brand-900 hover:bg-slate-100 shadow-none font-bold"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              New Campaign
            </Button>
          </Link>
          <Link to="/my-campaigns">
            <Button
              variant="outline"
              size="md"
              className="border-indigo-400/40 text-white bg-white/10 hover:bg-white/20"
            >
              <FolderKanban className="w-4 h-4 mr-1.5" />
              My Campaigns
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Campaigns"
          value={stats.total}
          icon={FolderKanban}
          color="brand"
          subtext="All campaign records"
        />
        <StatCard
          title="Active Campaigns"
          value={stats.active}
          icon={Megaphone}
          color="emerald"
          subtext="Publicly accessible"
        />
        <StatCard
          title="Draft Campaigns"
          value={stats.draft}
          icon={FileText}
          color="slate"
          subtext="In preparation"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="blue"
          subtext="Concluded promotions"
        />
      </div>

      {/* Main Content: Recent Campaigns + Extensible Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Recent Campaigns Table */}
        <div className="lg:col-span-2">
          <RecentCampaignsList campaigns={recentCampaigns} />
        </div>

        {/* Right Column: Platform Analytics Extensibility Preview */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-slate-50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-600" />
                Performance Metrics
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
                Live Status
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Active Engagement Ratio</span>
                <span className="font-bold text-slate-900">
                  {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%`
                  }}
                ></div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  PromoteHub's schema is structured to accommodate future click tracking, impression counters, and Stripe monetization without architecture refactoring.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Quick Navigation</h4>
            <div className="space-y-2 text-xs">
              <Link
                to="/campaigns"
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-brand-600" />
                  Explore Public Marketplace
                </span>
                <span>→</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  Account Profile & Bio
                </span>
                <span>→</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
