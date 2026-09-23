'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category, ProductFormData } from '@/types/product';
import { X, Save, AlertCircle } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  categories: Category[];
  isSubmitting?: boolean;
  onSubmit: (formData: ProductFormData) => Promise<void>;
  onClose: () => void;
}

export default function ProductFormModal({
  isOpen,
  productToEdit,
  categories,
  isSubmitting = false,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    brand: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title || '',
        description: productToEdit.description || '',
        category: productToEdit.category || '',
        price: productToEdit.price || 0,
        stock: productToEdit.stock || 0,
        brand: productToEdit.brand || '',
        thumbnail: productToEdit.thumbnail || productToEdit.images?.[0] || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: categories.length > 0 ? (typeof categories[0] === 'string' ? categories[0] : categories[0].slug) : 'beauty',
        price: 29.99,
        stock: 50,
        brand: '',
        thumbnail: '',
      });
    }
    setErrors({});
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.price === undefined || formData.price === null || isNaN(formData.price)) {
      newErrors.price = 'Price is required';
    } else if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than $0';
    }

    if (formData.stock === undefined || formData.stock === null || isNaN(formData.stock)) {
      newErrors.stock = 'Stock is required';
    } else if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    await onSubmit(formData);
  };

  const isEditing = Boolean(productToEdit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEditing ? `Modify product #${productToEdit?.id}` : 'Create a new catalog item'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Premium Wireless Headphones"
              className={`w-full px-3.5 py-2 bg-slate-800 border rounded-xl text-sm text-slate-100 outline-none transition-colors ${
                errors.title ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Category & Brand Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 outline-none focus:border-indigo-500 capitalize cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => {
                  const slug = typeof cat === 'string' ? cat : cat.slug;
                  const name = typeof cat === 'string' ? cat : cat.name;
                  return (
                    <option key={slug} value={slug} className="capitalize">
                      {name}
                    </option>
                  );
                })}
              </select>
              {errors.category && (
                <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.category}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g., Apple, Sony, Nike"
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Price & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Price ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3.5 py-2 bg-slate-800 border rounded-xl text-sm text-slate-100 outline-none transition-colors ${
                  errors.price ? 'border-red-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.price && (
                <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.price}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Stock Quantity <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                className={`w-full px-3.5 py-2 bg-slate-800 border rounded-xl text-sm text-slate-100 outline-none transition-colors ${
                  errors.stock ? 'border-red-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.stock && (
                <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.stock}</span>
                </p>
              )}
            </div>
          </div>

          {/* Image Thumbnail URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product details and specifications..."
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-150 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
