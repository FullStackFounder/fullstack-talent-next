'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

interface SidebarProps {
  userRole: 'siswa' | 'tutor' | 'admin';
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const userData = authApi.getCurrentUser();
    setUser(userData);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Menu items based on role
  const menuItems = {
    siswa: [
      {
        icon: '🏠',
        label: 'Dashboard',
        href: '/siswa/dashboard',
      },
      {
        icon: '📚',
        label: 'Kursus Saya',
        href: '/siswa/courses',
      },
      {
        icon: '📊',
        label: 'Progress',
        href: '/siswa/progress',
      },
      {
        icon: '🎓',
        label: 'Sertifikat',
        href: '/siswa/certificates',
      },
      {
        icon: '👤',
        label: 'Profile',
        href: '/siswa/profile',
      },
      {
        icon: '⚙️',
        label: 'Settings',
        href: '/siswa/settings',
      },
    ],
    tutor: [
      {
        icon: '🏠',
        label: 'Dashboard',
        href: '/tutor/dashboard',
      },
      {
        icon: '📚',
        label: 'Kursus Saya',
        href: '/tutor/courses',
      },
      {
        icon: '👥',
        label: 'Students',
        href: '/tutor/students',
      },
      {
        icon: '💰',
        label: 'Earnings',
        href: '/tutor/earnings',
      },
      {
        icon: '⭐',
        label: 'Reviews',
        href: '/tutor/reviews',
      },
      {
        icon: '👤',
        label: 'Profile',
        href: '/tutor/profile',
      },
      {
        icon: '⚙️',
        label: 'Settings',
        href: '/tutor/settings',
      },
    ],
    admin: [
      {
        icon: '🏠',
        label: 'Dashboard',
        href: '/admin/dashboard',
      },
      {
        icon: '👥',
        label: 'Users',
        href: '/admin/users',
      },
      {
        icon: '📚',
        label: 'Courses',
        href: '/admin/courses',
      },
      {
        icon: '💳',
        label: 'Payments',
        href: '/admin/payments',
      },
      {
        icon: '📊',
        label: 'Analytics',
        href: '/admin/analytics',
      },
      {
        icon: '📝',
        label: 'Content',
        href: '/admin/content',
      },
      {
        icon: '⚙️',
        label: 'Settings',
        href: '/admin/settings',
      },
    ],
  };

  const items = menuItems[userRole] || [];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } hidden md:block`}
      >
        <div className="flex h-full flex-col bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FT</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  FullstackTalent
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userRole}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {!isCollapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - will be implemented with mobile menu */}
    </>
  );
}