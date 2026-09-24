'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/common/Header';
import ProductFilters from '@/components/products/ProductFilters';
import ProductTable from '@/components/products/ProductTable';
import ProductCards from '@/components/products/ProductCards';
import Pagination from '@/components/products/Pagination';
import ProductFormModal from '@/components/products/ProductFormModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { TableSkeleton, CardSkeleton } from '@/components/common/Skeleton';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { useProductOverlay } from '@/context/ProductOverlayContext';
import { productService } from '@/services/productService';
import { Product, Category, ProductFormData, SortByOption, SortOrderOption } from '@/types/product';
import { parseProductParams, buildQueryString } from '@/utils/urlParams';
import { Plus, Search } from 'lucide-react';

function ProductDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawParams = Object.fromEntries(searchParams.entries());
  const filterParams = parseProductParams(rawParams);

  const { mergeWithOverlay, addLocalProduct, updateLocalProduct, deleteLocalProduct } = useProductOverlay();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const requestIdRef = useRef<number>(0);

  useEffect(() => {
    let alive = true;
    productService.getCategories()
      .then((cats) => { if (alive) setCategories(cats); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const { page, limit, q, category, sortBy, order, delay } = filterParams;

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const controller = new AbortController();
    const rid = ++requestIdRef.current;
    try {
      const data = await productService.getProducts({ page, limit, q, category, sortBy, order, delay }, controller.signal);
      if (rid === requestIdRef.current) {
        const { products: list, total } = mergeWithOverlay(data.products, data.total, page);
        setProducts(list);
        setTotalItems(total);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      if (rid === requestIdRef.current) {
        if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'CanceledError') return;
        setError('Unable to connect to DummyJSON. Please try again.');
        setIsLoading(false);
      }
    }
  }, [page, limit, q, category, sortBy, order, delay, mergeWithOverlay]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const push = (p: Partial<typeof filterParams>) => {
    router.push(`/products${buildQueryString({ ...filterParams, ...p })}`);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (productToEdit) {
        await productService.updateProduct(productToEdit.id, data);
        updateLocalProduct(productToEdit.id, data);
        setToast({ id: Date.now().toString(), type: 'success', title: 'Product updated', message: `"${data.title}" saved.` });
      } else {
        const res = await productService.addProduct(data);
        addLocalProduct(data, res);
        setToast({ id: Date.now().toString(), type: 'success', title: 'Product added', message: `"${data.title}" added to catalog.` });
      }
      setIsFormModalOpen(false);
      fetchProducts();
    } catch {
      if (productToEdit) updateLocalProduct(productToEdit.id, data);
      else addLocalProduct(data);
      setToast({ id: Date.now().toString(), type: 'info', title: 'Saved locally', message: 'API unavailable - saved in session.' });
      setIsFormModalOpen(false);
      fetchProducts();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete || isDeleting) return;
    setIsDeleting(true);
    try { await productService.deleteProduct(productToDelete.id); } catch { /* ignore */ }
    deleteLocalProduct(productToDelete.id);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setToast({ id: Date.now().toString(), type: 'error', title: 'Deleted', message: `"${productToDelete.title}" removed.` });
    setProductToDelete(null);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-surface pb-16">
      <Header />

      <div className="px-4 pt-3">
        {/* Page title */}
        <div className="mb-3">
          <h1 className="text-lg font-semibold text-text-primary leading-none">Products</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {!isLoading && totalItems > 0 ? `${totalItems.toLocaleString()} items` : 'Your catalog'}
          </p>
        </div>

        {/* Two-column layout: sidebar filters + main content */}
        <div className="flex gap-5 items-start">

          {/* Left sidebar — filters (desktop only; mobile handled inside component) */}
          <aside className="hidden md:block w-56 shrink-0 sticky top-20">
            <ProductFilters
              searchQuery={filterParams.q}
              selectedCategory={filterParams.category}
              sortBy={filterParams.sortBy}
              order={filterParams.order}
              delay={filterParams.delay}
              categories={categories}
              onSearchChange={(q) => push({ q, page: 1 })}
              onCategoryChange={(category) => push({ category, page: 1 })}
              onSortChange={(sortBy, order) => push({ sortBy, order })}
              onDelayToggle={(d) => push({ delay: d })}
              onAddProductClick={() => { setProductToEdit(null); setIsFormModalOpen(true); }}
              onClearAll={() => router.push('/products')}
            />
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar: search + add product */}
            <div className="hidden md:flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  value={filterParams.q}
                  onChange={(e) => push({ q: e.target.value, page: 1 })}
                  placeholder="Search products…"
                  aria-label="Search products"
                  className="w-full h-9 pl-9 pr-3 bg-surface-raised border border-border rounded-lg text-sm text-text-primary placeholder:text-text-placeholder outline-none focus:border-accent focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors"
                />
              </div>
              <button
                onClick={() => { setProductToEdit(null); setIsFormModalOpen(true); }}
                className="btn-primary text-sm shrink-0"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Add product
              </button>
            </div>

            {/* Mobile filters */}
            <div className="md:hidden mb-4">
              <ProductFilters
                searchQuery={filterParams.q}
                selectedCategory={filterParams.category}
                sortBy={filterParams.sortBy}
                order={filterParams.order}
                delay={filterParams.delay}
                categories={categories}
                onSearchChange={(q) => push({ q, page: 1 })}
                onCategoryChange={(category) => push({ category, page: 1 })}
                onSortChange={(sortBy, order) => push({ sortBy, order })}
                onDelayToggle={(d) => push({ delay: d })}
                onAddProductClick={() => { setProductToEdit(null); setIsFormModalOpen(true); }}
                onClearAll={() => router.push('/products')}
              />
            </div>

            {isLoading ? (
              <>
                <div className="hidden md:block"><TableSkeleton rows={filterParams.limit > 10 ? 8 : 5} /></div>
                <div className="md:hidden"><CardSkeleton cards={4} /></div>
              </>
            ) : error ? (
              <ErrorState onRetry={fetchProducts} message={error} />
            ) : products.length === 0 ? (
              <EmptyState onClearFilters={() => router.push('/products')} />
            ) : (
              <>
                <ProductTable
                  products={products}
                  onEdit={(p) => { setProductToEdit(p); setIsFormModalOpen(true); }}
                  onDelete={(p) => { setProductToDelete(p); setIsDeleteModalOpen(true); }}
                />
                <ProductCards
                  products={products}
                  onEdit={(p) => { setProductToEdit(p); setIsFormModalOpen(true); }}
                  onDelete={(p) => { setProductToDelete(p); setIsDeleteModalOpen(true); }}
                />
                <Pagination
                  currentPage={filterParams.page}
                  totalItems={totalItems}
                  pageSize={filterParams.limit}
                  onPageChange={(p) => push({ page: p })}
                  onPageSizeChange={(l) => push({ limit: l, page: 1 })}
                />
              </>
            )}
          </main>
        </div>
      </div>

      <ProductFormModal
        isOpen={isFormModalOpen}
        productToEdit={productToEdit}
        categories={categories}
        isSubmitting={isSubmitting}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormModalOpen(false)}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete product"
        message={`Remove "${productToDelete?.title}" from your catalog? This cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      }>
        <ProductDashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}