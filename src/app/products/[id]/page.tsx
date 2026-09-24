'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/common/Header';
import { productService } from '@/services/productService';
import { useProductOverlay } from '@/context/ProductOverlayContext';
import { Product } from '@/types/product';
import { ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Sparkles, AlertCircle, Tag, Building } from 'lucide-react';
import Link from 'next/link';

const FALLBACK = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const { getOverlayProductById, isDeleted } = useProductOverlay();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!idParam) return;
      const numId = Number(idParam);
      if (!isNaN(numId) && isDeleted(numId)) {
        if (alive) { setIsNotFound(true); setIsLoading(false); }
        return;
      }
      if (!isNaN(numId)) {
        const ov = getOverlayProductById(numId);
        if (ov?.isLocal) {
          if (alive) {
            setProduct(ov as Product);
            setSelectedImage(ov.images?.[0] || ov.thumbnail || FALLBACK);
            setIsLoading(false);
          }
          return;
        }
      }
      try {
        const data = await productService.getProductById(idParam as string);
        if (alive) {
          const ov = !isNaN(numId) ? getOverlayProductById(numId) : null;
          const final = ov ? { ...data, ...ov } : data;
          setProduct(final);
          setSelectedImage(final.images?.[0] || final.thumbnail || FALLBACK);
          setIsLoading(false);
        }
      } catch {
        if (alive) { setIsNotFound(true); setIsLoading(false); }
      }
    }
    load();
    return () => { alive = false; };
  }, [idParam, getOverlayProductById, isDeleted]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-surface pb-20">
        <Header />
        <main className="max-w-screen-xl mx-auto px-4 sm:px-5 pt-6">

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back
          </button>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
              <div className="aspect-square rounded-xl bg-surface-inset" />
              <div className="space-y-4 pt-2">
                <div className="h-6 bg-surface-inset rounded w-2/3" />
                <div className="h-4 bg-surface-inset rounded w-1/3" />
                <div className="h-10 bg-surface-inset rounded w-1/4 mt-6" />
                <div className="h-20 bg-surface-inset rounded mt-4" />
              </div>
            </div>
          ) : isNotFound || !product ? (
            <div className="card p-10 text-center max-w-sm mx-auto mt-16 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-error-surface border border-error-border text-error flex items-center justify-center mx-auto">
                <AlertCircle className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-text-primary">Product not found</p>
                <p className="text-sm text-text-muted mt-1">
                  ID <code className="font-mono bg-surface-inset px-1 rounded">#{idParam}</code> does not exist or was removed.
                </p>
              </div>
              <Link href="/products" className="btn-primary text-sm w-full justify-center">
                Back to catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main product card */}
              <div className="card overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image column */}
                  <div className="bg-surface-inset border-b lg:border-b-0 lg:border-r border-border p-6 flex flex-col gap-4">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-raised flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedImage || product.thumbnail || FALLBACK}
                        alt={product.title}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                      />
                      {product.isLocal && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-medium bg-accent text-white">
                          <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
                          Added locally
                        </span>
                      )}
                    </div>
                    {product.images && product.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {product.images.map((url, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedImage(url)}
                            aria-label={`Image ${i + 1}`}
                            className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              selectedImage === url
                                ? 'border-accent'
                                : 'border-border hover:border-border-strong opacity-70 hover:opacity-100'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info column */}
                  <div className="p-6 flex flex-col gap-5">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className="h-6 inline-flex items-center px-2.5 rounded-full text-xs font-medium bg-accent-surface text-accent-text border border-accent-border capitalize">
                        {product.category}
                      </span>
                      {product.brand && (
                        <span className="h-6 inline-flex items-center gap-1 px-2.5 rounded-full text-xs font-medium bg-surface-inset text-text-muted border border-border">
                          <Building className="w-3 h-3" aria-hidden="true" />
                          {product.brand}
                        </span>
                      )}
                    </div>

                    <h1 className="text-xl font-semibold text-text-primary leading-tight">
                      {product.title}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`w-4 h-4 ${
                              n <= Math.round(product.rating ?? 0)
                                ? 'fill-warning text-warning'
                                : 'fill-surface-inset text-border-strong'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-text-primary">
                        {product.rating ? Number(product.rating).toFixed(1) : '—'}
                      </span>
                      {product.reviews && (
                        <span className="text-sm text-text-muted">
                          ({product.reviews.length} reviews)
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-text-primary tabular-nums">
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                      </span>
                      {product.discountPercentage && (
                        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-medium bg-success-surface text-success-text border border-success-border whitespace-nowrap">
                          <Tag className="w-3 h-3" aria-hidden="true" />
                          {product.discountPercentage}% off
                        </span>
                      )}
                    </div>

                    {/* Stock */}
                    <div>
                      {product.stock > 10 ? (
                        <span className="h-6 inline-flex items-center px-2.5 rounded-full text-xs font-medium bg-success-surface text-success-text border border-success-border whitespace-nowrap">
                          {product.stock} in stock
                        </span>
                      ) : product.stock > 0 ? (
                        <span className="h-6 inline-flex items-center px-2.5 rounded-full text-xs font-medium bg-warning-surface text-warning-text border border-warning-border whitespace-nowrap">
                          {product.stock} remaining
                        </span>
                      ) : (
                        <span className="h-6 inline-flex items-center px-2.5 rounded-full text-xs font-medium bg-error-surface text-error-text border border-error-border whitespace-nowrap">
                          Out of stock
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    {/* Specs grid */}
                    <div className="grid grid-cols-3 gap-3 mt-auto pt-4 border-t border-border">
                      {[
                        { icon: Truck,       label: 'Shipping', value: product.shippingInformation || 'Standard' },
                        { icon: ShieldCheck, label: 'Warranty', value: product.warrantyInformation || '1 Year'  },
                        { icon: RotateCcw,   label: 'Returns',  value: product.returnPolicy || '30 Days'        },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="text-center space-y-1">
                          <Icon className="w-4 h-4 text-text-muted mx-auto" aria-hidden="true" />
                          <p className="text-[10px] text-text-muted uppercase tracking-wide">{label}</p>
                          <p className="text-xs font-medium text-text-secondary truncate" title={value}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="card p-6 space-y-4">
                  <h2 className="text-sm font-semibold text-text-primary">
                    Customer reviews
                    <span className="ml-2 text-text-muted font-normal">({product.reviews.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.reviews.map((rev, i) => (
                      <div key={i} className="p-4 bg-surface-inset rounded-xl border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-text-primary">{rev.reviewerName}</p>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                className={`w-3 h-3 ${
                                  n <= rev.rating ? 'fill-warning text-warning' : 'fill-surface-hover text-border'
                                }`}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{rev.comment}</p>
                        <time className="text-[10px] text-text-muted font-mono" dateTime={rev.date}>
                          {new Date(rev.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </time>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}