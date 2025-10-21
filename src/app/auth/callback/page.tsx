"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      const success = searchParams.get('success');

      if (error) {
        // Hata durumunda login sayfasına yönlendir
        router.push(`/auth/login?error=${encodeURIComponent(error)}`);
        return;
      }

      if (token && success === 'true') {
        try {
          // Token'dan user bilgilerini decode et (basit bir şekilde)
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          
          const user = {
            id: tokenPayload.sub || tokenPayload.nameid,
            name: tokenPayload.name || 'Google User',
            lastName: tokenPayload.family_name || '',
            email: tokenPayload.email,
            phone: tokenPayload.phone || ''
          };

          // AuthContext'e login et
          login(user, token, true);
          
          // Workspaces sayfasına yönlendir
          router.push('/workspaces');
        } catch (error) {
          console.error('Token parsing error:', error);
          router.push('/auth/login?error=Invalid+token');
        }
      } else {
        // Token yoksa login sayfasına yönlendir
        router.push('/auth/login?error=No+token+received');
      }
    };

    handleCallback();
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-pulse">
          <span className="text-2xl font-bold text-white">Z</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Giriş yapılıyor...</h2>
        <p className="text-gray-600">Lütfen bekleyin, Google hesabınızla giriş yapılıyor.</p>
        
        {/* Loading spinner */}
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
