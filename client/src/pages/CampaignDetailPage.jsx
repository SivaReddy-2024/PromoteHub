import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import campaignService from '../services/campaignService';
import {
  Calendar,
  Tag,
  Users,
  DollarSign,
  Copy,
  Check,
  Edit3,
  Trash2,
  ArrowLeft,
  Share2,
  AlertTriangle,
  Building,
  User as UserIcon
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import StatusBadge from '../components/campaigns/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import Modal from '../components/common/Modal';
import UserAvatar from '../components/common/UserAvatar';

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const data = await campaignService.getCampaignById(id);
        setCampaign(data.campaign);
      } catch (err) {
        setError(err.message || 'Unable to retrieve campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleCopyOffer = () => {
    if (!campaign?.promotionalContent) return;
    navigator.clipboard.writeText(campaign.promotionalContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await campaignService.deleteCampaign(id);
      setShowDeleteModal(false);
      navigate('/my-campaigns', { replace: true });
    } catch (err) {
      alert(err.message || 'Failed to delete campaign');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading campaign details..." />;
  }

  if (error || !campaign) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Alert
          type="error"
          title="Campaign Unavailable"
          message={error || 'The requested campaign was not found or is in private draft mode.'}
          className="mb-6"
        />
        <Link to="/campaigns">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner = Boolean(user && campaign.user && (user.id === campaign.user._id || user._id === campaign.user._id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {isOwner && (
          <div className="flex items-center gap-2">
            <Link to={`/campaigns/${campaign._id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                Edit Campaign
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-64 sm:h-96 w-full shadow-lg border border-slate-200">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
          }}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6 sm:p-10">
          <div className="space-y-3 text-white max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-semibold uppercase tracking-wider text-white border border-white/20">
                {campaign.category}
              </span>
              <StatusBadge status={campaign.status} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              {campaign.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Promo Offer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Promotional Offer Box */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-brand-50 border border-indigo-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Exclusive Promotional Offer
              </span>
              <button
                type="button"
                onClick={handleCopyOffer}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-brand-600 border border-brand-200 hover:bg-brand-50 shadow-sm transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Offer</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-white rounded-xl p-4 border border-brand-100 text-slate-800 text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {campaign.promotionalContent}
            </div>
          </div>

          {/* Campaign Description */}
          <Card>
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              About This Campaign
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {campaign.description}
            </p>
          </Card>
        </div>

        {/* Right Column: Meta Info & Creator */}
        <div className="space-y-6">
          {/* Timeline & Targeting Card */}
          <Card>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Campaign Specifications
            </h4>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-slate-400">Campaign Timeline</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {new Date(campaign.startDate).toLocaleDateString()} –{' '}
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-slate-400">Target Audience</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {campaign.targetAudience}
                  </div>
                </div>
              </div>

              {campaign.budget > 0 && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-slate-400">Budget Allocation</div>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      ${campaign.budget.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Promoter Card */}
          <Card>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Promoter Information
            </h4>

            <div className="flex items-center gap-3">
              <UserAvatar user={campaign.user} size="lg" />
              <div>
                <h5 className="font-bold text-slate-900 text-sm">
                  {campaign.user?.name || 'Verified Promoter'}
                </h5>
                {campaign.user?.company && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3" />
                    {campaign.user.company}
                  </p>
                )}
              </div>
            </div>

            {campaign.user?.bio && (
              <p className="mt-3 text-xs text-slate-600 italic border-t border-slate-100 pt-3">
                "{campaign.user.bio}"
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Campaign"
        description="Are you sure you want to delete this promotional campaign?"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>
              This will permanently delete "<strong>{campaign.title}</strong>". This action cannot be undone.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignDetailPage;
