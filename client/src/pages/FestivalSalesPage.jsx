import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Tag, Calendar } from 'lucide-react';
import hubService from '../services/hubService';
import FestivalBanner from '../components/campaigns/FestivalBanner';
import SEO from '../components/common/SEO';

const FestivalSalesPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const data = await hubService.getFestivalCampaigns();
        setCampaigns(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SEO
        title="Indian Festival Sales & Seasonal Promotions 2026"
        description="Diwali Mega Dhamaka, Great Indian Shopping Festival, Dussehra, End of Season, and Black Friday deals in India."
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
          <span>Mega Festive Savings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Festival & Seasonal Promotional Campaigns
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
          Track upcoming and live blockbuster seasonal sales. Discover exclusive bank tie-ups, exchange bonuses, and midnight flash sales.
        </p>
      </div>

      {/* Campaigns List */}
      <div className="space-y-8">
        {campaigns.map((camp) => (
          <FestivalBanner key={camp._id || camp.slug} campaign={camp} />
        ))}
      </div>
    </div>
  );
};

export default FestivalSalesPage;
