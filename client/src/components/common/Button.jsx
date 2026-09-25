import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f1117] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';

  const variants = {
    primary:
      'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/25 focus:ring-amber-400',
    secondary:
      'bg-[#232838] text-slate-100 hover:bg-[#2e3448] border border-white/10 shadow-sm focus:ring-slate-400',
    outline:
      'border border-amber-500/40 bg-amber-500/5 text-amber-400 hover:bg-amber-500/15 hover:border-amber-400 focus:ring-amber-500',
    emerald:
      'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/25 focus:ring-emerald-400',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20 focus:ring-rose-500',
    ghost:
      'text-slate-300 hover:text-white hover:bg-white/8 shadow-none focus:ring-amber-400/50'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
