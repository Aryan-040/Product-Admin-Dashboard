'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      router.push(isAuthenticated ? '/products' : '/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className='min-h-screen bg-surface flex items-center justify-center'>
      <div className='text-center space-y-2'>
        <div className='w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto' />
        <p className='text-xs text-text-muted'>Redirecting...</p>
      </div>
    </div>
  );
}
