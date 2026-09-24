'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category, ProductFormData } from '@/types/product';
import { X, AlertCircle } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  categories: Category[];
  isSubmitting?: boolean;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onClose: () => void;
}

export default function ProductFormModal({
  isOpen, productToEdit, categories, isSubmitting = false, onSubmit, onClose,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>({
    title: '', description: '', category: '', price: 0, stock: 0, brand: '', thumbnail: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    if (productToEdit) {
      setForm({
        title: productToEdit.title || '',
        description: productToEdit.description || '',
        category: productToEdit.category || '',
        price: productToEdit.price || 0,
        stock: productToEdit.stock || 0,
        brand: productToEdit.brand || '',
        thumbnail: productToEdit.thumbnail || productToEdit.images?.[0] || '',
      });
    } else {
      setForm({
        title: '', description: '',
        category: categories.length > 0 ? (typeof categories[0] === 'string' ? categories[0] : categories[0].slug) : '',
        price: 29.99, stock: 50, brand: '', thumbnail: '',
      });
    }
    setErrors({});
  }, [isOpen, productToEdit, categories]);

  if (!isOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim() || form.title.trim().length < 3) e.title = 'At least 3 characters required';
    if (!form.category) e.category = 'Select a category';
    if (isNaN(form.price) || form.price <= 0) e.price = 'Must be greater than $0';
    if (isNaN(form.stock) || form.stock < 0) e.stock = 'Cannot be negative';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validate()) return;
    await onSubmit(form);
  };

  const isEditing = Boolean(productToEdit);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-text-primary/20 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}
    >
      <div className="w-full sm:max-w-lg card rounded-b-none sm:rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 id="modal-title" className="text-sm font-semibold text-text-primary">
              {isEditing ? 'Edit product' : 'Add product'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {isEditing ? `ID #${productToEdit?.id}` : 'New catalog item'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label htmlFor="f-title" className="block text-xs font-medium text-text-secondary mb-1">
              Title <span className="text-error">*</span>
            </label>
            <input
              id="f-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Product name"
              className={`input-base px-3.5 py-2 ${errors.title ? 'border-error' : ''}`}
            />
            {errors.title && <p className="mt-1 text-xs text-error-text flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.title}</p>}
          </div>

          {/* Category + Brand */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="f-category" className="block text-xs font-medium text-text-secondary mb-1">
                Category <span className="text-error">*</span>
              </label>
              <select
                id="f-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`input-base px-3.5 py-2 ${errors.category ? 'border-error' : ''}`}
              >
                <option value="">Selectâ€¦</option>
                {categories.map((cat) => {
                  const slug = typeof cat === 'string' ? cat : cat.slug;
                  const name = typeof cat === 'string' ? cat : cat.name;
                  return <option key={slug} value={slug}>{name}</option>;
                })}
              </select>
              {errors.category && <p className="mt-1 text-xs text-error-text flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="f-brand" className="block text-xs font-medium text-text-secondary mb-1">Brand</label>
              <input id="f-brand" type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Sony" className="input-base px-3.5 py-2" />
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="f-price" className="block text-xs font-medium text-text-secondary mb-1">
                Price ($) <span className="text-error">*</span>
              </label>
              <input
                id="f-price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className={`input-base px-3.5 py-2 ${errors.price ? 'border-error' : ''}`}
              />
              {errors.price && <p className="mt-1 text-xs text-error-text flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.price}</p>}
            </div>
            <div>
              <label htmlFor="f-stock" className="block text-xs font-medium text-text-secondary mb-1">
                Stock <span className="text-error">*</span>
              </label>
              <input
                id="f-stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value, 10) || 0 })}
                className={`input-base px-3.5 py-2 ${errors.stock ? 'border-error' : ''}`}
              />
              {errors.stock && <p className="mt-1 text-xs text-error-text flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.stock}</p>}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="f-img" className="block text-xs font-medium text-text-secondary mb-1">Image URL</label>
            <input id="f-img" type="url" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://â€¦" className="input-base px-3.5 py-2" />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="f-desc" className="block text-xs font-medium text-text-secondary mb-1">Description</label>
            <textarea
              id="f-desc"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Product descriptionâ€¦"
              className="input-base px-3.5 py-2 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-surface-inset">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="btn-ghost text-sm">
            Cancel
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="btn-primary text-sm"
          >
            {isSubmitting ? 'Savingâ€¦' : isEditing ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </div>
    </div>
  );
}