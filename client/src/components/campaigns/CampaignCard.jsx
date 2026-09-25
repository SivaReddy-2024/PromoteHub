import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight, User } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from './StatusBadge';

const CampaignCard = ({ campaign, isOwner = false }) => {
  const {
    _id,
    title,
    description,
    imageUrl,
    category,
    startDate,
    endDate,
    status,
    user
  } = campaign;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card hoverEffect className="flex flex-col h-full overflow-hidden p-0 border border-slate-200/90 group">
      {/* Banner image with overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={title}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-md text-xs font-semibold text-slate-800 shadow-sm border border-slate-200/50">
            {category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
          {/* Timeline */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>
              {formatDate(startDate)} – {formatDate(endDate)}
            </span>
          </div>

          {/* Creator / Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User className="w-3 h-3" />
                </div>
              )}
              <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
                {user?.company || user?.name || 'Promoter'}
              </span>
            </div>

            <Link
              to={`/campaigns/${_id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:text-brand-700 hover:underline"
            >
              <span>{isOwner ? 'Manage' : 'View Offer'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CampaignCard;
