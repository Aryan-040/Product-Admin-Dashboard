'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/common/Header';
import { productService } from '@/services/productService';
import { useProductOverlay } from '@/context/ProductOverlayContext';
import { Product } from '@/types/product';
import {
  ArrowLeft,
  Star,
  Package,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Tag,
  Building,
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;

  const { getOverlayProductById, isDeleted } = useProductOverlay();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!idParam) return;
      const numId = Number(idParam);

      // Check if product was locally deleted
      if (!isNaN(numId) && isDeleted(numId)) {
        if (isMounted) {
          setIsNotFound(true);
          setIsLoading(false);
        }
        return;
      }

      // Check local overlay store first
      if (!isNaN(numId)) {
        const overlayItem = getOverlayProductById(numId);
        if (overlayItem && overlayItem.isLocal) {
          if (isMounted) {
            setProduct(overlayItem as Product);
            setSelectedImage(
              overlayItem.images?.[0] || overlayItem.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
            );
            setIsLoading(false);
          }
          return;
        }
      }

      try {
        const apiData = await productService.getProductById(idParam as string);
        if (isMounted) {
          // Merge local edits if any
          const overlayItem = !isNaN(numId) ? getOverlayProductById(numId) : null;
          const finalProduct = overlayItem ? { ...apiData, ...overlayItem } : apiData;

          setProduct(finalProduct);
          setSelectedImage(
            finalProduct.images?.[0] || finalProduct.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
          );
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        if (isMounted) {
          setIsNotFound(true);
          setIsLoading(false);
        }
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [idParam, getOverlayProductById, isDeleted]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* Back Navigation Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </button>
          </div>

          {isLoading ? (
            /* Skeleton Loading State */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
              <div className="w-full h-96 bg-slate-900 rounded-3xl border border-slate-800"></div>
              <div className="space-y-4">
                <div className="h-8 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="h-10 bg-slate-800 rounded w-1/3"></div>
                <div className="h-24 bg-slate-800 rounded w-full"></div>
              </div>
            </div>
          ) : isNotFound || !product ? (
            /* Not Found Screen */
            <div className="my-12 p-12 bg-slate-900/80 rounded-3xl border border-slate-800 text-center max-w-lg mx-auto space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">404 - Product Not Found</h2>
                <p className="text-sm text-slate-400">
                  The product with ID <code className="text-indigo-400 font-mono">#{idParam}</code> could not be found or has been removed.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Return to Catalog Dashboard</span>
              </Link>
            </div>
          ) : (
            /* Product Details Content */
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900/70 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
                {/* Left Column: Image Gallery */}
                <div className="space-y-4">
                  <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/80 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedImage || product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
                      }}
                    />
                    {product.isLocal && (
                      <span className="absolute top-3 left-3 flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Added Locally</span>
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                      {product.images.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(imgUrl)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-slate-800 flex-shrink-0 transition-all cursor-pointer ${
                            selectedImage === imgUrl ? 'border-indigo-500 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgUrl} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Information & Specs */}
                <div className="space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Category & Brand badges */}
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 capitalize">
                        {product.category}
                      </span>
                      {product.brand && (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          <Building className="w-3 h-3" />
                          <span>{product.brand}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {product.title}
                    </h1>

                    {/* Rating & Review summary */}
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center space-x-1 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-amber-200">
                          {product.rating ? Number(product.rating).toFixed(1) : '4.5'}
                        </span>
                      </div>
                      {product.reviews && (
                        <span className="text-xs text-slate-400">
                          ({product.reviews.length} customer reviews)
                        </span>
                      )}
                    </div>

                    {/* Price & Stock */}
                    <div className="flex items-baseline space-x-4 pt-2">
                      <span className="text-3xl font-extrabold font-mono text-white">
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                      </span>
                      {product.discountPercentage && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <Tag className="w-3 h-3" />
                          <span>{product.discountPercentage}% OFF</span>
                        </span>
                      )}
                    </div>

                    {/* Stock Status Badge */}
                    <div>
                      <span
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                          product.stock > 10
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : product.stock > 0
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                            : 'bg-red-950/60 text-red-400 border border-red-800/40'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{product.stock > 0 ? `In Stock (${product.stock} units left)` : 'Out of Stock'}</span>
                      </span>
                    </div>

                    {/* Description */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Description
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                        {product.description || 'No description provided for this catalog item.'}
                      </p>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
                    <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-center space-y-1">
                      <Truck className="w-4 h-4 text-indigo-400 mx-auto" />
                      <p className="text-[10px] text-slate-400">Shipping</p>
                      <p className="font-semibold text-slate-200 truncate">{product.shippingInformation || 'Standard'}</p>
                    </div>
                    <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-center space-y-1">
                      <ShieldCheck className="w-4 h-4 text-indigo-400 mx-auto" />
                      <p className="text-[10px] text-slate-400">Warranty</p>
                      <p className="font-semibold text-slate-200 truncate">{product.warrantyInformation || '1 Year'}</p>
                    </div>
                    <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-center space-y-1">
                      <RotateCcw className="w-4 h-4 text-indigo-400 mx-auto" />
                      <p className="text-[10px] text-slate-400">Returns</p>
                      <p className="font-semibold text-slate-200 truncate">{product.returnPolicy || '30 Days'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Reviews Section */}
              <div className="bg-slate-900/70 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Customer Reviews</h3>
                </div>

                {product.reviews && product.reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.reviews.map((rev, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-slate-200">{rev.reviewerName}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-slate-200">{rev.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 italic">&ldquo;{rev.comment}&rdquo;</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {new Date(rev.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No customer reviews yet for this product.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
