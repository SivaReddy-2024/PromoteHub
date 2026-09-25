import React from 'react';

export const DealCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm animate-pulse space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-slate-200" />
      <div className="space-y-1.5 flex-1">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-100" />
    </div>
    <div className="h-40 bg-slate-100 rounded-xl" />
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-full" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <div className="h-6 bg-slate-200 rounded w-1/3" />
      <div className="h-8 bg-slate-200 rounded w-1/4" />
    </div>
  </div>
);

export const CouponCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="w-14 h-14 rounded-xl bg-slate-200" />
      <div className="h-6 bg-slate-200 rounded-full w-24" />
    </div>
    <div className="space-y-2">
      <div className="h-5 bg-slate-200 rounded w-2/3" />
      <div className="h-3 bg-slate-100 rounded w-5/6" />
    </div>
    <div className="h-10 bg-slate-100 rounded-xl border border-dashed border-slate-200" />
    <div className="h-9 bg-slate-200 rounded-xl" />
  </div>
);

export const BrandCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm animate-pulse flex flex-col items-center space-y-3">
    <div className="w-16 h-16 rounded-2xl bg-slate-200" />
    <div className="h-4 bg-slate-200 rounded w-2/3" />
    <div className="h-3 bg-slate-100 rounded w-1/2" />
  </div>
);

export default {
  DealCardSkeleton,
  CouponCardSkeleton,
  BrandCardSkeleton
};
