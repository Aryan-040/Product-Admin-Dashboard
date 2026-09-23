'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Eye, Edit2, Trash2, Star, Sparkles } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th scope="col" className="py-4 px-6">Product</th>
              <th scope="col" className="py-4 px-6">Category</th>
              <th scope="col" className="py-4 px-6">Price</th>
              <th scope="col" className="py-4 px-6">Rating</th>
              <th scope="col" className="py-4 px-6">Stock</th>
              <th scope="col" className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-800/40 transition-colors duration-150 group"
              >
                {/* Product Image & Title */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 flex-shrink-0 group-hover:border-indigo-500/50 transition-colors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-semibold text-slate-100 hover:text-indigo-400 transition-colors truncate max-w-xs block"
                          title={product.title}
                        >
                          {product.title}
                        </Link>
                        {product.isLocal && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>New</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                        {product.brand || product.category}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700 capitalize">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="py-4 px-6">
                  <span className="font-mono font-bold text-slate-100 text-base">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </span>
                </td>

                {/* Rating */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-200 text-xs">
                      {product.rating ? Number(product.rating).toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </td>

                {/* Stock */}
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                      product.stock > 10
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        : product.stock > 0
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                        : 'bg-red-950/60 text-red-400 border border-red-800/40'
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="View product details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
