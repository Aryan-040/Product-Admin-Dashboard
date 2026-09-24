'use client';

import React from 'react';

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden mb-4 animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="border-b border-border bg-surface-inset px-5 py-3 grid grid-cols-12 gap-4">
        {[5,2,2,1,2].map((w, i) => (
          <div key={i} className={`col-span-${w} h-3 bg-surface-hover rounded`} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-5 py-3.5 grid grid-cols-12 gap-4 items-center border-b border-border last:border-0">
          <div className="col-span-1"><div className="w-10 h-10 rounded-lg bg-surface-hover" /></div>
          <div className="col-span-4 space-y-2">
            <div className="h-3.5 bg-surface-hover rounded w-3/4" />
            <div className="h-2.5 bg-surface-inset rounded w-1/2" />
          </div>
          <div className="col-span-2"><div className="h-5 bg-surface-hover rounded-full w-16" /></div>
          <div className="col-span-2"><div className="h-4 bg-surface-hover rounded w-14" /></div>
          <div className="col-span-1"><div className="h-4 bg-surface-hover rounded w-10" /></div>
          <div className="col-span-2 flex justify-end gap-1.5">
            {[1,2,3].map(j => <div key={j} className="w-7 h-7 bg-surface-hover rounded-md" />)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 animate-pulse" aria-busy="true" aria-label="Loading">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="h-44 bg-surface-hover" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-surface-hover rounded w-3/4" />
            <div className="h-3 bg-surface-inset rounded w-1/2" />
            <div className="flex justify-between pt-1">
              <div className="h-5 bg-surface-hover rounded w-20" />
              <div className="h-5 bg-surface-hover rounded-full w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}