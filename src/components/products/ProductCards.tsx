'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Eye, Pencil, Trash2, Star, Sparkles } from 'lucide-react';

interface ProductCardsProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const FALLBACK = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';

export default function ProductCards({ products, onEdit, onDelete }: ProductCardsProps) {
  return (
    <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {products.map((product) => (
        <article key={product.id} className="card overflow-hidden flex flex-col">
          {/* Image */}
          <div className="relative h-44 bg-surface-inset overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.thumbnail || product.images?.[0] || FALLBACK}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
            />
            {/* Category pill */}
            <span className="absolute top-2 left-2 h-5 inline-flex items-center px-2 rounded-full text-[11px] font-medium bg-surface-raised/90 text-text-secondary border border-border backdrop-blur-sm capitalize">
              {product.category}
            </span>
            {product.isLocal && (
              <span className="absolute top-2 right-2 h-5 inline-flex items-center gap-1 px-2 rounded-full text-[11px] font-medium bg-accent text-white">
                <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
                New
              </span>
            )}
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col flex-1 gap-2">
            <div>
              <Link
                href={`/products/${product.id}`}
                className="text-sm font-medium text-text-primary hover:text-accent transition-colors line-clamp-1"
              >
                {product.title}
              </Link>
              <p className="text-xs text-text-muted mt-0.5">{product.brand}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-text-primary tabular-nums">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-warning text-warning" aria-hidden="true" />
                <span className="text-xs text-text-secondary tabular-nums">
                  {product.rating ? Number(product.rating).toFixed(1) : 'â€”'}
                </span>
              </div>
            </div>

            <div>
              {product.stock > 10 ? (
                <span className="inline-flex h-5 items-center px-2 rounded-full text-[11px] font-medium bg-success-surface text-success-text border border-success-border whitespace-nowrap">{product.stock} in stock</span>
              ) : product.stock > 0 ? (
                <span className="inline-flex h-5 items-center px-2 rounded-full text-[11px] font-medium bg-warning-surface text-warning-text border border-warning-border whitespace-nowrap">{product.stock} left</span>
              ) : (
                <span className="inline-flex h-5 items-center px-2 rounded-full text-[11px] font-medium bg-error-surface text-error-text border border-error-border whitespace-nowrap">Out of stock</span>
              )}
            </div>

            {/* Action row */}
            <div className="flex items-center justify-between pt-2 mt-auto border-t border-border">
              <Link
                href={`/products/${product.id}`}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
              >
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                View
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(product)}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
                  aria-label={`Edit ${product.title}`}
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-error hover:bg-error-surface transition-colors cursor-pointer"
                  aria-label={`Delete ${product.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}