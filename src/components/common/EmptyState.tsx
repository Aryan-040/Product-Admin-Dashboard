'use client';

import React from 'react';
import { PackageSearch, X } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onClearFilters?: () => void;
}

export default function EmptyState({
  title = 'No products found',
  message = "Nothing matches your current filters. Try adjusting your search or clearing the filters.",
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="card p-10 text-center flex flex-col items-center gap-4 my-6">
      <div className="w-10 h-10 rounded-xl bg-surface-inset border border-border flex items-center justify-center text-text-muted">
        <PackageSearch className="w-5 h-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto">{message}</p>
      </div>
      {onClearFilters && (
        <button onClick={onClearFilters} className="btn-ghost text-sm">
          <X className="w-3.5 h-3.5" aria-hidden="true" />
          Clear filters
        </button>
      )}
    </div>
  );
}