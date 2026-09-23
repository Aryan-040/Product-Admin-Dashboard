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

function ProductDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL search parameters safely
  const rawParams = Object.fromEntries(searchParams.entries());
  const filterParams = parseProductParams(rawParams);

  const { mergeWithOverlay, addLocalProduct, updateLocalProduct, deleteLocalProduct } = useProductOverlay();

  // Local state
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast Notification
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Ref to track latest request sequence to prevent race conditions
  const requestIdRef = useRef<number>(0);

  // Fetch Category List once on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const catList = await productService.getCategories();
        if (isMounted) {
          setCategories(catList);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Products function with AbortController for race condition protection
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const currentRequestId = ++requestIdRef.current;

    try {
      const data = await productService.getProducts(filterParams, controller.signal);

      // Only update state if this is still the latest request
      if (currentRequestId === requestIdRef.current) {
        // Merge API results with client local overlay (adds/edits/deletes)
        const { products: mergedList, total: mergedTotal } = mergeWithOverlay(
          data.products,
          data.total,
          filterParams.page
        );

        setProducts(mergedList);
        setTotalItems(mergedTotal);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      if (currentRequestId === requestIdRef.current) {
        if (err && typeof err === 'object' && 'name' in err && err.name === 'CanceledError') {
          // Request was aborted by rapid typing - ignore
          return;
        }
        console.error('Error fetching products:', err);
        setError('Unable to connect to DummyJSON server. Please try again.');
        setIsLoading(false);
      }
    }
  }, [filterParams, mergeWithOverlay]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // URL Parameter Update Handlers
  const updateUrlParams = (newParams: Partial<typeof filterParams>) => {
    const updated = { ...filterParams, ...newParams };
    const query = buildQueryString(updated);
    router.push(`/products${query}`);
  };

  const handleSearchChange = (query: string) => {
    // Reset to page 1 when search changes
    updateUrlParams({ q: query, page: 1 });
  };

  const handleCategoryChange = (category: string) => {
    // Reset to page 1 when category filter changes
    updateUrlParams({ category, page: 1 });
  };

  const handleSortChange = (sortBy: SortByOption | '', order: SortOrderOption) => {
    updateUrlParams({ sortBy, order });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const handlePageSizeChange = (newSize: number) => {
    updateUrlParams({ limit: newSize, page: 1 });
  };

  const handleClearAll = () => {
    router.push('/products');
  };

  // Add / Edit Handlers
  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setProductToEdit(product);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: ProductFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (productToEdit) {
        // Edit product
        await productService.updateProduct(productToEdit.id, formData);
        updateLocalProduct(productToEdit.id, formData);
        setToast({
          id: Date.now().toString(),
          type: 'success',
          title: 'Product Updated',
          message: `"${formData.title}" has been updated successfully.`,
        });
      } else {
        // Add new product
        const apiResult = await productService.addProduct(formData);
        addLocalProduct(formData, apiResult);
        setToast({
          id: Date.now().toString(),
          type: 'success',
          title: 'Product Added',
          message: `"${formData.title}" has been added to your dashboard.`,
        });
      }

      setIsFormModalOpen(false);
      fetchProducts(); // Refresh list view
    } catch (err) {
      console.error('Save product error:', err);
      // Fallback local persistence even if DummyJSON API fails
      if (productToEdit) {
        updateLocalProduct(productToEdit.id, formData);
      } else {
        addLocalProduct(formData);
      }
      setToast({
        id: Date.now().toString(),
        type: 'info',
        title: productToEdit ? 'Updated Locally' : 'Saved Locally',
        message: 'Saved to client overlay state.',
      });
      setIsFormModalOpen(false);
      fetchProducts();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handlers
  const handleOpenDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete || isDeleting) return;
    setIsDeleting(true);

    try {
      await productService.deleteProduct(productToDelete.id);
    } catch (err) {
      console.error('Delete product API error (fallback to local):', err);
    } finally {
      deleteLocalProduct(productToDelete.id);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Product Deleted',
        message: `"${productToDelete.title}" was deleted.`,
      });
      setProductToDelete(null);
      fetchProducts();
    }
  };

  const handleDelayToggle = (delay?: number) => {
    updateUrlParams({ delay });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Product Catalog</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage inventory, prices, search and filters in real-time
            </p>
          </div>
        </div>

        {/* Filters & Actions Bar */}
        <ProductFilters
          searchQuery={filterParams.q}
          selectedCategory={filterParams.category}
          sortBy={filterParams.sortBy}
          order={filterParams.order}
          delay={filterParams.delay}
          categories={categories}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onDelayToggle={handleDelayToggle}
          onAddProductClick={handleOpenAddModal}
          onClearAll={handleClearAll}
        />

        {/* Main Content Area: Loading, Error, Empty, or Data Views */}
        {isLoading ? (
          <div>
            <div className="hidden md:block">
              <TableSkeleton rows={filterParams.limit > 10 ? 8 : 5} />
            </div>
            <div className="md:hidden">
              <CardSkeleton cards={4} />
            </div>
          </div>
        ) : error ? (
          <ErrorState onRetry={fetchProducts} message={error} />
        ) : products.length === 0 ? (
          <EmptyState onClearFilters={handleClearAll} />
        ) : (
          <div>
            {/* Desktop Table View */}
            <ProductTable
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />

            {/* Mobile Cards View */}
            <ProductCards
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />

            {/* Custom Pagination Bar */}
            <Pagination
              currentPage={filterParams.page}
              totalItems={totalItems}
              pageSize={filterParams.limit}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </main>

      {/* Add / Edit Form Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        productToEdit={productToEdit}
        categories={categories}
        isSubmitting={isSubmitting}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.title}"? This will remove it from your product list.`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <p className="text-sm font-medium text-slate-400">Loading catalog...</p>
        </div>
      }>
        <ProductDashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
