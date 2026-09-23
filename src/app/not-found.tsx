import Link from 'next/link';
import { PackageX, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/90 rounded-3xl p-8 border border-slate-800 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
          <PackageX className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">404 - Page Not Found</h1>
          <p className="text-sm text-slate-400">
            The page or product link you requested does not exist or has been moved.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Product Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
