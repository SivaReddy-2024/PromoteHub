import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Edit3, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../campaigns/StatusBadge';
import Button from '../common/Button';

const RecentCampaignsList = ({ campaigns = [] }) => {
  if (!campaigns || campaigns.length === 0) {
    return (
      <Card className="text-center py-10">
        <p className="text-sm text-slate-500 mb-3">
          You haven't launched any promotional campaigns yet.
        </p>
        <Link to="/campaigns/create">
          <Button variant="primary" size="sm">
            Create Your First Campaign
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-900">Recent Campaigns</h4>
          <p className="text-xs text-slate-500">Quick overview of your latest marketing campaigns</p>
        </div>
        <Link
          to="/my-campaigns"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/75 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
            <tr>
              <th className="px-5 py-3">Campaign</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Timeline</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.map((camp) => (
              <tr key={camp._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={camp.imageUrl}
                      alt={camp.title}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=100&q=80';
                      }}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div>
                      <Link
                        to={`/campaigns/${camp._id}`}
                        className="font-medium text-slate-900 hover:text-brand-600 line-clamp-1"
                      >
                        {camp.title}
                      </Link>
                      <span className="text-[11px] text-slate-400">
                        Audience: {camp.targetAudience}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {camp.category}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={camp.status} size="sm" />
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                  {new Date(camp.startDate).toLocaleDateString()} – {new Date(camp.endDate).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/campaigns/${camp._id}`}
                      className="p-1.5 text-slate-400 hover:text-brand-600 rounded-md hover:bg-slate-100"
                      title="View Public Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/campaigns/${camp._id}/edit`}
                      className="p-1.5 text-slate-400 hover:text-slate-900 rounded-md hover:bg-slate-100"
                      title="Edit Campaign"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentCampaignsList;
