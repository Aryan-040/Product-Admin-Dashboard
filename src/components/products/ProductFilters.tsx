'use client';

import React, { useState, useEffect } from 'react';
import { Category, SortByOption, SortOrderOption } from '@/types/product';
import { Search, X, Filter, ArrowUpDown, Plus } from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: SortByOption | '';
  order: SortOrderOption;
  categories: Category[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: SortByOption | '', order: SortOrderOption) => void;
  onAddProductClick: () => void;
  onClearAll: () => void;
}

export default function ProductFilters({
  searchQuery,
  selectedCategory,
  sortBy,
  order,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onAddProductClick,
  onClearAll,
}: ProductFiltersProps) {
  // Local input state for immediate typing response, debounced before firing parent callback
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 400); // 400ms debounce delay

    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, onSearchChange]);

  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      onSortChange('', 'asc');
      return;
    }
    const [field, sortOrder] = value.split('-') as [SortByOption, SortOrderOption];
    onSortChange(field, sortOrder);
  };

  const sortValue = sortBy ? `${sortBy}-${order}` : '';

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || sortBy);

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input with Debounce */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products by title, brand..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-sm text-slate-100 placeholder-slate-400 outline-none transition-all"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                onSearchChange('');
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="relative min-w-[160px] flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-800/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs font-medium text-slate-200 outline-none appearance-none cursor-pointer capitalize"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => {
                const name = typeof cat === 'string' ? cat : cat.name;
                const slug = typeof cat === 'string' ? cat : cat.slug;
                return (
                  <option key={slug} value={slug} className="bg-slate-900 capitalize">
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[170px] flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortValue}
              onChange={handleSortSelect}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-800/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs font-medium text-slate-200 outline-none appearance-none cursor-pointer"
            >
              <option value="">Default Sort</option>
              <option value="price-asc" className="bg-slate-900">Price: Low to High</option>
              <option value="price-desc" className="bg-slate-900">Price: High to Low</option>
              <option value="rating-desc" className="bg-slate-900">Rating: High to Low</option>
              <option value="title-asc" className="bg-slate-900">Title: A to Z</option>
              <option value="title-desc" className="bg-slate-900">Title: Z to A</option>
            </select>
          </div>

          {/* Add Product Button */}
          <button
            onClick={onAddProductClick}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-150 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips / Clear Button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span>Active filters:</span>
            {searchQuery && (
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md font-mono">
                q: {searchQuery}
              </span>
            )}
            {selectedCategory && (
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md capitalize">
                category: {selectedCategory}
              </span>
            )}
            {sortBy && (
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md capitalize">
                sort: {sortBy} ({order})
              </span>
            )}
          </div>
          <button
            onClick={onClearAll}
            className="text-slate-400 hover:text-white underline text-xs transition-colors cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
