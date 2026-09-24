import Link from 'next/link';
import { PackageX, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-surface text-text-primary flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-surface-raised rounded-2xl p-8 border border-border text-center space-y-6 shadow-lg'>
        <div className='w-14 h-14 rounded-2xl bg-accent-surface border border-accent-border text-accent-text flex items-center justify-center mx-auto'>
          <PackageX className='w-7 h-7' aria-hidden='true' />
        </div>
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight text-text-primary'>Page not found</h1>
          <p className='text-sm text-text-muted'>
            The page or product you requested doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href='/products'
          className='inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl shadow-md transition-colors'
        >
          <Home className='w-4 h-4' aria-hidden='true' />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
