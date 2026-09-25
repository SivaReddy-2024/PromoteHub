import React, { useState } from 'react';
import { User } from 'lucide-react';

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
  '2xl': 'w-24 h-24 text-3xl'
};

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
  xl: 'w-10 h-10',
  '2xl': 'w-12 h-12'
};

const UserAvatar = ({
  user,
  name,
  avatar,
  size = 'sm',
  className = '',
  showInitial = true
}) => {
  const [imgError, setImgError] = useState(false);

  const userName = user?.name || name || 'User';
  const userAvatar = user?.avatar !== undefined ? user?.avatar : avatar;
  
  // Filter out any unwanted external stock photo placeholders (like unsplash)
  const isStockPhoto = typeof userAvatar === 'string' && userAvatar.includes('unsplash.com');
  const hasValidImage = userAvatar && !imgError && !isStockPhoto;

  const initial = userName?.trim()?.charAt(0)?.toUpperCase() || 'U';

  const baseSize = sizeClasses[size] || sizeClasses.sm;
  const iconSize = iconSizes[size] || iconSizes.sm;

  if (hasValidImage) {
    return (
      <img
        src={userAvatar}
        alt={userName}
        onError={() => setImgError(true)}
        className={`${baseSize} rounded-xl object-cover border border-amber-400/40 shadow-sm ${className}`}
      />
    );
  }

  // Default DP with NO image: Sleek geometric monogram / silhouette with amber aura
  return (
    <div
      title={userName}
      className={`${baseSize} rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black flex items-center justify-center border border-amber-300/50 shadow-md shadow-amber-500/20 shrink-0 select-none relative overflow-hidden ${className}`}
    >
      {/* Subtle inner reflection highlight */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/25 pointer-events-none" />
      {showInitial && initial ? (
        <span className="relative z-10 font-mono tracking-tighter drop-shadow-sm font-black">
          {initial}
        </span>
      ) : (
        <User className={`${iconSize} relative z-10 text-slate-950`} />
      )}
    </div>
  );
};

export default UserAvatar;
