'use client';

import React from 'react';

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full animate-pulse">
      <div className="bg-slate-800/60 rounded-t-xl border border-slate-700/60 overflow-hidden">
        {/* Table Header Skeleton */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-800/80 border-b border-slate-700/60">
          <div className="col-span-1 h-4 bg-slate-700 rounded"></div>
          <div className="col-span-4 h-4 bg-slate-700 rounded"></div>
          <div className="col-span-2 h-4 bg-slate-700 rounded"></div>
          <div className="col-span-2 h-4 bg-slate-700 rounded"></div>
          <div className="col-span-1 h-4 bg-slate-700 rounded"></div>
          <div className="col-span-2 h-4 bg-slate-700 rounded"></div>
        </div>

        {/* Rows Skeleton */}
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800/80 items-center"
          >
            <div className="col-span-1">
              <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
            </div>
            <div className="col-span-4 space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-800 rounded w-1/2"></div>
            </div>
            <div className="col-span-2">
              <div className="h-6 bg-slate-700/80 rounded-full w-20"></div>
            </div>
            <div className="col-span-2">
              <div className="h-5 bg-slate-700 rounded w-16 font-mono"></div>
            </div>
            <div className="col-span-1">
              <div className="h-4 bg-slate-700 rounded w-10"></div>
            </div>
            <div className="col-span-2 flex space-x-2">
              <div className="h-8 bg-slate-700 rounded-lg w-16"></div>
              <div className="h-8 bg-slate-700 rounded-lg w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: cards }).map((_, idx) => (
        <div
          key={idx}
          className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-4"
        >
          <div className="w-full h-40 bg-slate-700 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-slate-700 rounded w-20"></div>
            <div className="h-6 bg-slate-700 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
