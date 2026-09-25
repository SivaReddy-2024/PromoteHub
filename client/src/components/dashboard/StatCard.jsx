import React from 'react';
import Card from '../common/Card';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'brand',
  subtext
}) => {
  const colorMap = {
    brand: {
      bg: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100',
      text: 'text-indigo-600'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      text: 'text-emerald-600'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      text: 'text-amber-600'
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      text: 'text-blue-600'
    },
    slate: {
      bg: 'bg-slate-100 text-slate-600',
      border: 'border-slate-200',
      text: 'text-slate-600'
    }
  };

  const scheme = colorMap[color] || colorMap.brand;

  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold text-slate-900 font-display">
          {value !== undefined ? value : '—'}
        </h3>
        {subtext && (
          <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
            {subtext}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheme.bg} shadow-sm flex-shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </Card>
  );
};

export default StatCard;
