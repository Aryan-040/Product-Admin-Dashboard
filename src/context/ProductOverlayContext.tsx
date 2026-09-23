'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductFormData } from '@/types/product';

interface ProductOverlayContextType {
  addedProducts: Product[];
  editedProducts: Record<number, Partial<Product>>;
  deletedProductIds: number[];
  addLocalProduct: (data: ProductFormData, apiReturnedProduct?: Partial<Product>) => Product;
  updateLocalProduct: (id: number, data: Partial<ProductFormData>) => void;
  deleteLocalProduct: (id: number) => void;
  mergeWithOverlay: (apiProducts: Product[], totalCount: number, page: number) => { products: Product[]; total: number };
  getOverlayProductById: (id: number) => Partial<Product> | null;
  isDeleted: (id: number) => boolean;
}

const ProductOverlayContext = createContext<ProductOverlayContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'product_dashboard_overlay_v1';

export function ProductOverlayProvider({ children }: { children: React.ReactNode }) {
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [editedProducts, setEditedProducts] = useState<Record<number, Partial<Product>>>({});
  const [deletedProductIds, setDeletedProductIds] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load overlay state from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAddedProducts(parsed.addedProducts || []);
        setEditedProducts(parsed.editedProducts || {});
        setDeletedProductIds(parsed.deletedProductIds || []);
      }
    } catch (err) {
      console.error('Error loading product overlay:', err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save overlay state to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          addedProducts,
          editedProducts,
          deletedProductIds,
        })
      );
    } catch (err) {
      console.error('Error saving product overlay:', err);
    }
  }, [addedProducts, editedProducts, deletedProductIds, isInitialized]);

  const addLocalProduct = (data: ProductFormData, apiReturnedProduct?: Partial<Product>): Product => {
    const newProduct: Product = {
      id: apiReturnedProduct?.id || Date.now(), // Generate unique numeric ID
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      stock: data.stock,
      rating: apiReturnedProduct?.rating || 4.5,
      brand: data.brand || 'Generic',
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      images: [data.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
      isLocal: true,
      ...apiReturnedProduct,
    };

    setAddedProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateLocalProduct = (id: number, data: Partial<ProductFormData>) => {
    // If it's a locally added product, update it in addedProducts
    setAddedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );

    // Also update in editedProducts map
    setEditedProducts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        ...data,
      },
    }));
  };

  const deleteLocalProduct = (id: number) => {
    // Remove from added products if locally created
    setAddedProducts((prev) => prev.filter((p) => p.id !== id));
    // Add to deleted IDs array
    setDeletedProductIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const mergeWithOverlay = (
    apiProducts: Product[],
    totalCount: number,
    page: number
  ): { products: Product[]; total: number } => {
    // 1. Filter out deleted products
    let list = apiProducts.filter((p) => !deletedProductIds.includes(p.id));

    // 2. Apply local edits to remaining items
    list = list.map((p) => {
      if (editedProducts[p.id]) {
        return {
          ...p,
          ...editedProducts[p.id],
        };
      }
      return p;
    });

    // 3. Prepend newly added local products on Page 1
    if (page === 1 && addedProducts.length > 0) {
      // Filter out any added items that might have been deleted
      const activeAdded = addedProducts.filter((p) => !deletedProductIds.includes(p.id));
      list = [...activeAdded, ...list];
    }

    const activeAddedCount = addedProducts.filter((p) => !deletedProductIds.includes(p.id)).length;
    const netTotal = Math.max(0, totalCount + activeAddedCount - deletedProductIds.length);

    return {
      products: list,
      total: netTotal,
    };
  };

  const getOverlayProductById = (id: number): Partial<Product> | null => {
    const localAdded = addedProducts.find((p) => p.id === id);
    if (localAdded) return localAdded;

    if (editedProducts[id]) {
      return editedProducts[id];
    }

    return null;
  };

  const isDeleted = (id: number): boolean => deletedProductIds.includes(id);

  return (
    <ProductOverlayContext.Provider
      value={{
        addedProducts,
        editedProducts,
        deletedProductIds,
        addLocalProduct,
        updateLocalProduct,
        deleteLocalProduct,
        mergeWithOverlay,
        getOverlayProductById,
        isDeleted,
      }}
    >
      {children}
    </ProductOverlayContext.Provider>
  );
}

export function useProductOverlay() {
  const context = useContext(ProductOverlayContext);
  if (!context) {
    throw new Error('useProductOverlay must be used within a ProductOverlayProvider');
  }
  return context;
}
