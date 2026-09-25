import React from 'react';

export const DealCardSkeleton = () => (
  <div className="bg-[#1A1D27] rounded-3xl border border-white/8 p-4 shadow-md space-y-4 overflow-hidden">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl skeleton-dark shrink-0" />
      <div className="space-y-1.5 flex-1">
        <div className="h-4 skeleton-dark rounded-lg w-1/3" />
        <div className="h-3 skeleton-dark rounded-lg w-1/2" />
      </div>
      <div className="w-8 h-8 rounded-xl skeleton-dark" />
    </div>
    <div className="h-40 skeleton-dark rounded-2xl" />
    <div className="space-y-2">
      <div className="h-4 skeleton-dark rounded-lg w-3/4" />
      <div className="h-3 skeleton-dark rounded-lg w-full" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <div className="h-6 skeleton-dark rounded-lg w-1/3" />
      <div className="h-8 skeleton-dark rounded-xl w-1/4" />
    </div>
  </div>
);

export const CouponCardSkeleton = () => (
  <div className="bg-[#1A1D27] rounded-3xl border border-white/8 p-5 shadow-md space-y-4 overflow-hidden">
    <div className="flex items-center justify-between">
      <div className="w-14 h-14 rounded-2xl skeleton-dark" />
      <div className="h-6 skeleton-dark rounded-full w-24" />
    </div>
    <div className="space-y-2">
      <div className="h-5 skeleton-dark rounded-lg w-2/3" />
      <div className="h-3 skeleton-dark rounded-lg w-5/6" />
    </div>
    <div className="h-10 skeleton-dark rounded-xl" />
    <div className="h-10 skeleton-dark rounded-xl" />
  </div>
);

export const BrandCardSkeleton = () => (
  <div className="bg-[#1A1D27] rounded-3xl border border-white/8 p-4 shadow-md flex flex-col items-center space-y-3">
    <div className="w-16 h-16 rounded-2xl skeleton-dark" />
    <div className="h-4 skeleton-dark rounded-lg w-2/3" />
    <div className="h-3 skeleton-dark rounded-lg w-1/2" />
  </div>
);

export default {
  DealCardSkeleton,
  CouponCardSkeleton,
  BrandCardSkeleton
};
