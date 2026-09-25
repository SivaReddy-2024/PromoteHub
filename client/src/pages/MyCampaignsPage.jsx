import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import campaignService from '../services/campaignService';
import { useDebounce } from '../hooks/useDebounce';
import {
  FolderKanban,
  PlusCircle,
  Search,
  X,
  ExternalLink,
  Edit3,
  Trash2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import StatusBadge from '../components/campaigns/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';

const STATUS_TABS = [
  { id: 'all', label: 'All Campaigns' },
  { id: 'active', label: 'Active' },
  { id: 'draft', label: 'Drafts' },
  { id: 'paused', label: 'Paused' },
  { id: 'completed', label: 'Completed' }
];

const MyCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const fetchUserCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const data = await campaignService.getUserCampaigns({
        status: status !== 'all' ? status : undefined,
        search: debouncedSearch || undefined,
        limit: 50
      });
      setCampaigns(data.campaigns || []);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, [status, debouncedSearch]);

  useEffect(() => {
    fetchUserCampaigns();
  }, [fetchUserCampaigns]);

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    try {
      setIsDeleting(true);
      await campaignService.deleteCampaign(campaignToDelete._id);
      setCampaigns((prev) => prev.filter((c) => c._id !== campaignToDelete._id));
      setCampaignToDelete(null);
    } catch (err) {
      alert(err.message || 'Failed to delete campaign');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>Campaign Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Your Campaigns
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Publish, edit, and organize all your marketing promotions.
          </p>
        </div>

        <Link to="/campaigns/create">
          <Button variant="primary" size="md" className="gap-2 shadow-md shadow-brand-500/20">
            <PlusCircle className="w-4 h-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                status === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title..."
            className="block w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Campaigns Table / Cards */}
      {loading ? (
        <LoadingSpinner message="Loading your campaigns..." />
      ) : campaigns.length > 0 ? (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Campaign Info</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Dates</th>
                  <th className="px-6 py-3.5">Budget</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((camp) => (
                  <tr key={camp._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={camp.imageUrl}
                          alt={camp.title}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=100&q=80';
                          }}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                        />
                        <div>
                          <Link
                            to={`/campaigns/${camp._id}`}
                            className="font-bold text-slate-900 hover:text-brand-600 line-clamp-1"
                          >
                            {camp.title}
                          </Link>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {camp.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                        {camp.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={camp.status} size="sm" />
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(camp.startDate).toLocaleDateString()} –{' '}
                      {new Date(camp.endDate).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-slate-800">
                      {camp.budget > 0 ? `$${camp.budget.toLocaleString()}` : '—'}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/campaigns/${camp._id}`}
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                          title="Preview Campaign"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/campaigns/${camp._id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                          title="Edit Campaign"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setCampaignToDelete(camp)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          title="No campaigns found"
          description={
            status !== 'all' || search
              ? 'No campaigns match the current filter criteria.'
              : "You haven't launched any promotional campaigns yet. Start spreading your message now."
          }
          actionLabel={status === 'all' && !search ? 'Create New Campaign' : 'Clear Filters'}
          onAction={() => {
            if (status === 'all' && !search) {
              window.location.href = '/campaigns/create';
            } else {
              setStatus('all');
              setSearch('');
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(campaignToDelete)}
        onClose={() => setCampaignToDelete(null)}
        title="Delete Campaign"
        description="Are you sure you want to permanently delete this campaign?"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>
              This will remove "<strong>{campaignToDelete?.title}</strong>" and its promotional content permanently.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCampaignToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={confirmDelete}
              isLoading={isDeleting}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyCampaignsPage;
