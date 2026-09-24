'use client';

import React from 'react';
import { Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen, title = 'Delete product',
  message = 'This will remove the product from your dashboard. This action cannot be undone.',
  confirmText = 'Delete', cancelText = 'Cancel', isDeleting = false,
  onConfirm, onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/20 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="card w-full max-w-sm p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h2 id="confirm-title" className="text-sm font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="w-6 h-6 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors -mt-0.5 -mr-0.5"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm text-text-muted leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button onClick={onClose} disabled={isDeleting} className="btn-ghost text-sm">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-error hover:bg-error/90 text-white text-sm font-medium rounded-lg border-none cursor-pointer transition-colors disabled:opacity-50 active:scale-[0.98]"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            {isDeleting ? 'Deleting…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}