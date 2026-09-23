'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  title = 'Failed to load products',
  message = 'An error occurred while fetching product data. Please check your internet connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="w-full my-8 p-8 rounded-2xl bg-red-950/20 border border-red-900/40 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
      <div className="w-12 h-12 rounded-full bg-red-900/40 border border-red-700/50 flex items-center justify-center text-red-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-red-200">{title}</h3>
        <p className="text-sm text-red-300/80 max-w-md mt-1">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all duration-150 shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Retry API Call</span>
      </button>
    </div>
  );
}
