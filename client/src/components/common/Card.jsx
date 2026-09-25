import React from 'react';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'default',
  onClick,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer' : ''
      } ${paddingStyles[padding] || paddingStyles.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
