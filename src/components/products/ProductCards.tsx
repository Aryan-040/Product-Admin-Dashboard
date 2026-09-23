'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Eye, Edit2, Trash2, Star, Sparkles } from 'lucide-react';

interface ProductCardsProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductCards({ products, onEdit, onDelete }: ProductCardsProps) {
  return (
    <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
        >
          <div className="space-y-3">
            {/* Image & Category Badge */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
                }}
              />
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-900/90 text-indigo-300 border border-slate-700 backdrop-blur-md capitalize">
                {product.category}
              </span>
              {product.isLocal && (
                <span className="absolute top-2 right-2 flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white shadow-md">
                  <Sparkles className="w-3 h-3" />
                  <span>Added</span>
                </span>
              )}
            </div>

            {/* Title & Brand */}
            <div>
              <Link
                href={`/products/${product.id}`}
                className="font-bold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1 text-base"
              >
                {product.title}
              </Link>
              <p className="text-xs text-slate-400 mt-0.5">{product.brand || product.category}</p>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-mono font-bold text-lg text-white">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </span>
              <div className="flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-slate-200">
                  {product.rating ? Number(product.rating).toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>

            {/* Stock Badge */}
            <div>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                  product.stock > 10
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : product.stock > 0
                    ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                    : 'bg-red-950/60 text-red-400 border border-red-800/40'
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <Link
              href={`/products/${product.id}`}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </Link>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="p-2 text-slate-400 hover:text-amber-400 bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Edit product"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(product)}
                className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Delete product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
