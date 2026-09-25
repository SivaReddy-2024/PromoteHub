import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import campaignService from '../services/campaignService';
import CampaignForm from '../components/campaigns/CampaignForm';
import { Edit3, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';

const EditCampaignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const data = await campaignService.getCampaignById(id);
        setCampaign(data.campaign);
      } catch (err) {
        setError(err.message || 'Unable to load campaign for editing');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await campaignService.updateCampaign(id, formData);
      navigate('/my-campaigns', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading campaign details..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Alert type="error" title="Error" message={error} className="mb-4" />
        <button
          type="button"
          onClick={() => navigate('/my-campaigns')}
          className="text-xs font-semibold text-brand-600 hover:underline"
        >
          ← Return to My Campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
          <Edit3 className="w-4 h-4" />
          <span>Editor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Edit Campaign
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update promotional messaging, schedule, or media assets.
        </p>
      </div>

      <CampaignForm
        initialData={campaign}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        isEdit={true}
      />
    </div>
  );
};

export default EditCampaignPage;
