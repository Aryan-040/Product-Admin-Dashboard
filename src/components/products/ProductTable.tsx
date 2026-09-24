'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Eye, Pencil, Trash2, Star, Sparkles } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const FALLBACK = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';

function StockBadge({ stock }: { stock: number }) {
  if (stock > 10)
    return <span className="inline-flex h-5 items-center px-2 rounded-full text-[11px] font-medium bg-success-surface text-success-text border border-success-border whitespace-nowrap">{stock} in stock</span>;
  if (stock > 0)
    return <span className="inline-flex h-5 items-center px-2 rounded-full text-[11px] font-medium bg-warning-surface text-warning-text border border-warning-border whitespace-nowrap">{stock} left</span>;
  return <span className="inline-flex h-5 items-center px-2 rounded-full text-[11px] font-medium bg-error-surface text-error-text border border-error-border whitespace-nowrap">Out of stock</span>;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="hidden md:block card overflow-hidden mb-4">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-surface-inset">
            <th className="px-4 py-2.5 text-xs font-medium text-text-muted w-full">Product</th>
            <th className="px-4 py-2.5 text-xs font-medium text-text-muted whitespace-nowrap">Category</th>
            <th className="px-4 py-2.5 text-xs font-medium text-text-muted whitespace-nowrap">Price</th>
            <th className="px-4 py-2.5 text-xs font-medium text-text-muted whitespace-nowrap">Rating</th>
            <th className="px-4 py-2.5 text-xs font-medium text-text-muted whitespace-nowrap">Stock</th>
            <th className="px-4 py-2.5 text-xs font-medium text-text-muted text-right whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => (
            <tr
              key={product.id}
              className={`group border-b border-border hover:bg-surface-hover transition-colors ${i === products.length - 1 ? 'border-b-0' : ''}`}
            >
              {/* Product */}
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-inset border border-border shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.thumbnail || product.images?.[0] || FALLBACK}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-medium text-text-primary hover:text-accent transition-colors truncate max-w-[200px] block"
                        title={product.title}
                      >
                        {product.title}
                      </Link>
                      {product.isLocal && (
                        <span className="inline-flex items-center gap-1 px-1.5 h-4 text-[10px] font-medium bg-accent-surface text-accent-text border border-accent-border rounded-full shrink-0">
                          <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted truncate max-w-[200px] mt-0.5">
                      {product.brand}
                    </p>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-4 py-2.5">
                <span className="text-xs text-text-muted capitalize">{product.category}</span>
              </td>

              {/* Price */}
              <td className="px-4 py-2.5">
                <span className="text-sm font-semibold text-text-primary tabular-nums">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </span>
              </td>

              {/* Rating */}
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-warning text-warning shrink-0" aria-hidden="true" />
                  <span className="text-sm text-text-secondary tabular-nums">
                    {product.rating ? Number(product.rating).toFixed(1) : 'Ã¢â‚¬â€'}
                  </span>
                </div>
              </td>

              {/* Stock */}
              <td className="px-4 py-2.5">
                <StockBadge stock={product.stock} />
              </td>

              {/* Actions */}
              <td className="px-4 py-2.5">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/products/${product.id}`}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-accent hover:bg-accent-surface transition-colors"
                    aria-label={`View ${product.title}`}
                  >
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}