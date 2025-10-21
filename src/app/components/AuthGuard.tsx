"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      // Login olmamış kullanıcıyı login sayfasına yönlendir
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  // Loading durumunda loading göster
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Auth gerekli ama kullanıcı login olmamışsa hiçbir şey gösterme
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
