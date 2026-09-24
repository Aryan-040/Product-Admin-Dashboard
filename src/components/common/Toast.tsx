'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ toast, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  const cfg = {
    success: { icon: CheckCircle2, cls: 'bg-surface-raised border-success-border', iconCls: 'text-success' },
    error:   { icon: AlertCircle,  cls: 'bg-surface-raised border-error-border',   iconCls: 'text-error'   },
    info:    { icon: Info,         cls: 'bg-surface-raised border-accent-border',   iconCls: 'text-accent'  },
  }[toast.type];
  const Icon = cfg.icon;

  return (
    <div
      className="fixed bottom-5 right-4 sm:right-5 z-50 w-full max-w-xs"
      role="status"
      aria-live="polite"
    >
      <div className={`card flex items-start gap-3 px-4 py-3 shadow-lg ${cfg.cls}`}>
        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.iconCls}`} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">{toast.title}</p>
          {toast.message && <p className="text-xs text-text-muted mt-0.5">{toast.message}</p>}
        </div>
        <button
          onClick={onClose}
          className="w-5 h-5 flex items-center justify-center rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}