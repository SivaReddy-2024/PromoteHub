import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...', fullPage = false }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-slate-200 border-t-brand-600 ${
          sizes[size] || sizes.md
        }`}
      ></div>
      {message && <p className="text-sm font-medium text-slate-500 animate-pulse">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        {spinner}
      </div>
    );
  }

  return <div className="py-8 flex justify-center">{spinner}</div>;
};

export default LoadingSpinner;
