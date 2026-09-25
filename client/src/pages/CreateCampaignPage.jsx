import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import campaignService from '../services/campaignService';
import CampaignForm from '../components/campaigns/CampaignForm';
import { Megaphone, ArrowLeft } from 'lucide-react';

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await campaignService.createCampaign(formData);
      navigate('/my-campaigns', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
          <Megaphone className="w-4 h-4" />
          <span>Launch Promotion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create New Campaign
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Craft your promotional announcement, discount codes, and creative media.
        </p>
      </div>

      {/* Campaign Form */}
      <CampaignForm onSubmit={handleSubmit} isLoading={isLoading} isEdit={false} />
    </div>
  );
};

export default CreateCampaignPage;
