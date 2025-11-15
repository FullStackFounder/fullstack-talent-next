'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
  userRole,
}: {
  children: React.ReactNode;
  userRole: 'siswa' | 'tutor' | 'admin';
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated
      if (!authApi.isAuthenticated()) {
        router.push('/login');
        return;
      }

      // Check if user has correct role
      const user = authApi.getCurrentUser();
      if (user.role !== userRole) {
        // Redirect to correct dashboard based on role
        router.push(`/${user.role}/dashboard`);
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, userRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userRole={userRole} />

      {/* Main Content */}
      <div className="md:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}