'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LayoutGrid, LogOut } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function Header() {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '';

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-raised h-14 flex items-center">
      <div className="w-full px-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/products"
          className="flex items-center gap-2 shrink-0 focus-visible:outline-none"
        >
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <LayoutGrid className="w-3.5 h-3.5 text-white" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-text-primary tracking-tight whitespace-nowrap">
            CatalogHub
          </span>
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-inset text-text-muted border border-border leading-none">
            Admin
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />

          {user && (
            <>
              <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-border">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-border"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[11px] font-bold text-white shrink-0 select-none">
                    {initials}
                  </div>
                )}
                <div className="leading-tight">
                  <p className="text-[13px] font-medium text-text-primary leading-none">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">@{user.username}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-muted hover:text-error rounded-lg hover:bg-error-surface transition-colors cursor-pointer"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}