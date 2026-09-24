'use client';

import React, { useState, useEffect } from 'react';
import { Category, SortByOption, SortOrderOption } from '@/types/product';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: SortByOption | '';
  order: SortOrderOption;
  delay?: number;
  categories: Category[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: SortByOption | '', order: SortOrderOption) => void;
  onDelayToggle?: (delay?: number) => void;
  onAddProductClick: () => void;
  onClearAll: () => void;
}

const SORT_OPTIONS = [
  { value: '',           label: 'Default'          },
  { value: 'price-asc',  label: 'Price: Low–High'  },
  { value: 'price-desc', label: 'Price: High–Low'  },
  { value: 'rating-desc',label: 'Top rated'        },
  { value: 'title-asc',  label: 'Name: A–Z'        },
  { value: 'title-desc', label: 'Name: Z–A'        },
];

function Section({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hover:text-text-primary transition-colors cursor-pointer"
      >
        {title}
        {open
          ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
          : <ChevronDown className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
        }
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function ProductFilters({
  searchQuery, selectedCategory, sortBy, order, delay, categories,
  onSearchChange, onCategoryChange, onSortChange, onDelayToggle,
  onClearAll,
}: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);



  const sortValue = sortBy ? `${sortBy}-${order}` : '';
  const activeCount = [searchQuery, selectedCategory, sortBy].filter(Boolean).length;

  const handleSortSelect = (value: string) => {
    if (!value) { onSortChange('', 'asc'); return; }
    const [field, ord] = value.split('-') as [SortByOption, SortOrderOption];
    onSortChange(field, ord);
  };

  const sidebarContent = (
    <div className="card overflow-hidden">

      {/* Sort */}
      <Section title="Sort by">
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSortSelect(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                sortValue === opt.value
                  ? 'bg-accent-surface text-accent-text font-medium'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Category */}
      <Section title="Category">
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
              selectedCategory === ''
                ? 'bg-accent-surface text-accent-text font-medium'
                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
            }`}
          >
            All categories
          </button>
          {categories.map((cat) => {
            const name = typeof cat === 'string' ? cat : cat.name;
            const slug = typeof cat === 'string' ? cat : cat.slug;
            return (
              <button
                key={slug}
                onClick={() => onCategoryChange(slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors cursor-pointer ${
                  selectedCategory === slug
                    ? 'bg-accent-surface text-accent-text font-medium'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Dev tools */}
      {onDelayToggle && (
        <Section title="Dev tools" defaultOpen={false}>
          <button
            onClick={() => onDelayToggle(delay ? undefined : 2000)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
              delay
                ? 'bg-warning-surface text-warning-text'
                : 'text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {delay ? '2s delay: on' : 'Simulate slow network'}
          </button>
        </Section>
      )}

      {/* Clear */}
      {activeCount > 0 && (
        <div className="p-4 border-t border-border">
          <button
            onClick={onClearAll}
            className="w-full text-sm text-text-muted hover:text-error transition-colors cursor-pointer text-center"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden mb-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-ghost text-sm w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Filters {activeCount > 0 && <span className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold">{activeCount}</span>}
          </span>
          {mobileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {mobileOpen && <div className="mt-3">{sidebarContent}</div>}
      </div>

      {/* Desktop sidebar — rendered by parent layout, just export the content */}
      <div className="hidden md:block">
        {sidebarContent}
      </div>
    </>
  );
}