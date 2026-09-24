'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, Eye, EyeOff, LayoutGrid } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';

function LoginForm() {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, loginError, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '/products';
  const isExpired = searchParams.get('expired') === 'true';

  useEffect(() => {
    if (isAuthenticated) router.push('/products');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    clearError();
    const ok = await login({ username, password });
    setIsSubmitting(false);
    if (ok) router.push(redirectUrl);
  };

  return (
    <div className="card p-8 space-y-5">
      {isExpired && (
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-warning-surface border border-warning-border text-warning-text text-sm" role="alert">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>Your session expired. Sign in again to continue.</span>
        </div>
      )}
      {loginError && (
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-error-surface border border-error-border text-error-text text-sm" role="alert" aria-live="polite">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{loginError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Username */}
        <div className="space-y-1.5">
          <label htmlFor="username" className="text-sm font-medium text-text-secondary">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => { setUsername(e.target.value); if (loginError) clearError(); }}
            placeholder="emilys"
            className="input-base px-3.5 py-2"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-text-secondary">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (loginError) clearError(); }}
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              className="input-base px-3.5 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-secondary transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword
                ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                : <Eye className="w-4 h-4" aria-hidden="true" />
              }
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full mt-2 h-10 text-sm"
        >
          {isSubmitting ? 'Signing inâ€¦' : 'Sign in'}
        </button>
      </form>

      <div className="pt-1 border-t border-border">
        <p className="text-xs text-text-muted text-center">
          Demo credentials are pre-filled
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left panel â€” decorative, desktop only */}
      <div className="hidden lg:flex flex-col w-[480px] shrink-0 bg-accent p-10 relative overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <LayoutGrid className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            </div>
            <span className="text-white font-semibold text-sm">CatalogHub</span>
          </div>

          <div className="mt-auto">
            <blockquote className="text-white/90 text-lg font-medium leading-relaxed">
              &ldquo;Manage your entire product catalog with confidence â€” search, filter, and update in real time.&rdquo;
            </blockquote>
            <p className="text-white/50 text-sm mt-4">Product Admin Dashboard</p>
          </div>

          {/* Decorative circles */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/5" aria-hidden="true" />
          <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5" aria-hidden="true" />
        </div>
      </div>

      {/* Right panel â€” form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
              <div className="inline-flex w-12 h-12 rounded-xl bg-accent items-center justify-center mb-4">
                <LayoutGrid className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-xl font-semibold text-text-primary">Sign in to CatalogHub</h1>
              <p className="text-sm text-text-muted mt-1.5">
                Access your product admin console
              </p>
            </div>

            <Suspense fallback={
              <div className="card p-8 text-center text-sm text-text-muted">Loadingâ€¦</div>
            }>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}