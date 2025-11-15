'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!authApi.isAuthenticated()) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    // Get user data and redirect based on role
    const user = authApi.getCurrentUser();
    
    if (!user || !user.role) {
      router.push('/login');
      return;
    }

    // Redirect to appropriate dashboard
    switch (user.role) {
      case 'siswa':
        router.push('/siswa/dashboard');
        break;
      case 'tutor':
        router.push('/tutor/dashboard');
        break;
      case 'admin':
        router.push('/admin/dashboard');
        break;
      default:
        router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}