import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  className = ''
}) => {
  const configs = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: Info,
      iconColor: 'text-blue-500'
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: CheckCircle,
      iconColor: 'text-emerald-500'
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-500'
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: AlertCircle,
      iconColor: 'text-rose-500'
    }
  };

  const config = configs[type] || configs.info;
  const IconComponent = config.icon;

  return (
    <div
      className={`rounded-lg border p-4 shadow-sm flex items-start gap-3.5 transition-all ${config.container} ${className}`}
      role="alert"
    >
      <IconComponent className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1 text-sm">
        {title && <h5 className="font-semibold mb-0.5 leading-snug">{title}</h5>}
        <div className="text-slate-700">{message}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-0.5 rounded-md hover:bg-black/5"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
