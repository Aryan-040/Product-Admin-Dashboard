'use client';

import React from 'react';
import { PackageSearch, XCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onClearFilters?: () => void;
}

export default function EmptyState({
  title = 'No products found',
  message = 'We could not find any products matching your search criteria or category filter.',
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="w-full my-8 p-10 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-center flex flex-col items-center justify-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
        <PackageSearch className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-200">{title}</h3>
        <p className="text-sm text-slate-400 max-w-md mt-1">{message}</p>
      </div>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
          <span>Clear All Filters</span>
        </button>
      )}
    </div>
  );
}
