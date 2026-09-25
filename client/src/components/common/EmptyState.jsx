import React from 'react';
import { Layers } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Layers,
  title = 'No records found',
  description = 'There are no items to display at this moment.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-slate-300 max-w-xl mx-auto my-6 ${className}`}>
      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-600 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
