'use client';

import React from 'react';
import { TriangleAlert, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  title = 'Failed to load products',
  message = 'Check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="card p-10 text-center flex flex-col items-center gap-4 my-6" role="alert">
      <div className="w-10 h-10 rounded-xl bg-error-surface border border-error-border flex items-center justify-center text-error">
        <TriangleAlert className="w-5 h-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-sm text-text-muted mt-1">{message}</p>
      </div>
      <button onClick={onRetry} className="btn-ghost text-sm">
        <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}