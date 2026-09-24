'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({ currentPage, totalItems, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages = (): (number | '…')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const arr: (number | '…')[] = [1];
    let lo = Math.max(2, currentPage - 1);
    let hi = Math.min(totalPages - 1, currentPage + 1);
    if (currentPage <= 3) hi = 4;
    else if (currentPage >= totalPages - 2) lo = totalPages - 3;
    if (lo > 2) arr.push('…');
    for (let i = lo; i <= hi; i++) arr.push(i);
    if (hi < totalPages - 1) arr.push('…');
    arr.push(totalPages);
    return arr;
  };

  return (
    <nav aria-label="Pagination" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 px-1 mt-1">
      {/* Summary + page size */}
      <div className="flex items-center gap-4 text-sm text-text-muted">
        <span>
          {start}–{end} of <strong className="text-text-primary font-medium">{totalItems}</strong>
        </span>
        <div className="flex items-center gap-1.5">
          <label htmlFor="page-size" className="text-xs">Rows</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-7 px-2 bg-surface-raised border border-border rounded-md text-xs text-text-primary outline-none focus:border-accent cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-border bg-surface-raised text-text-muted hover:text-text-primary hover:border-border-strong disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>

        {pages().map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="w-8 text-center text-text-muted text-sm select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                p === currentPage
                  ? 'bg-accent text-white'
                  : 'bg-surface-raised border border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-border bg-surface-raised text-text-muted hover:text-text-primary hover:border-border-strong disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}