'use client';

import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api/auth';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const userData = authApi.getCurrentUser();
    setUser(userData);

    // Update time
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      setCurrentTime(now.toLocaleDateString('id-ID', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {/* Date */}
          <div className="text-right">
            <p className="text-xs text-gray-500">{currentTime}</p>
            <p className="text-sm font-medium text-gray-900">
              {getGreeting()}, {user?.full_name?.split(' ')[0] || 'User'}!
            </p>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
}