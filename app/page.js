'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthProvider';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) return;

    if (isAuthenticated) {
      // Redirect to dashboard if authenticated
      router.replace('/dashboard');
    } else {
      // Redirect to login if not authenticated
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading...</p>
      </div>
    </div>
  );
}
