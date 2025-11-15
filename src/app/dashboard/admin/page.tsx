'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { authApi } from '@/lib/api/auth';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 1245,
    totalCourses: 156,
    totalRevenue: 850000000,
    activeUsers: 892,
    pendingApprovals: 12,
    totalPayments: 2450,
  });

  useEffect(() => {
    const userData = authApi.getCurrentUser();
    setUser(userData);

    // TODO: Fetch real stats from API
    // fetchAdminStats();
  }, []);

  const recentUsers = [
    {
      id: 1,
      name: 'Ahmad Rizki',
      email: 'ahmad@example.com',
      role: 'siswa',
      joinDate: '2 days ago',
      status: 'active',
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      role: 'tutor',
      joinDate: '3 days ago',
      status: 'active',
    },
    {
      id: 3,
      name: 'Budi Santoso',
      email: 'budi@example.com',
      role: 'siswa',
      joinDate: '5 days ago',
      status: 'active',
    },
  ];

  const pendingCourses = [
    {
      id: 1,
      title: 'Advanced JavaScript & TypeScript',
      tutor: 'John Doe',
      submittedDate: '1 day ago',
      status: 'pending_review',
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      tutor: 'Jane Smith',
      submittedDate: '2 days ago',
      status: 'pending_review',
    },
  ];

  const recentPayments = [
    {
      id: 1,
      user: 'Ahmad Rizki',
      course: 'Fullstack Web Development',
      amount: 500000,
      status: 'completed',
      date: '2 hours ago',
    },
    {
      id: 2,
      user: 'Siti Nurhaliza',
      course: 'React Native Development',
      amount: 450000,
      status: 'completed',
      date: '5 hours ago',
    },
    {
      id: 3,
      user: 'Budi Santoso',
      course: 'Data Science',
      amount: 600000,
      status: 'pending',
      date: '1 day ago',
    },
  ];

  const systemHealth = [
    { name: 'API Server', status: 'healthy', uptime: '99.9%' },
    { name: 'Database', status: 'healthy', uptime: '99.8%' },
    { name: 'Storage', status: 'warning', uptime: '98.5%' },
    { name: 'CDN', status: 'healthy', uptime: '99.9%' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="min-h-screen">
        <DashboardHeader
          title="Admin Dashboard"
          subtitle="System overview and management"
        />

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon="👥"
              color="blue"
              change={{ value: 15, type: 'increase' }}
            />
            <StatsCard
              title="Total Courses"
              value={stats.totalCourses}
              icon="📚"
              color="green"
              change={{ value: 8, type: 'increase' }}
            />
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon="💰"
              color="purple"
              change={{ value: 12, type: 'increase' }}
            />
            <StatsCard
              title="Active Users"
              value={stats.activeUsers}
              icon="⚡"
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Users */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Users
                  </h2>
                  <a
                    href="/admin/users"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All →
                  </a>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase py-3">
                          User
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase py-3">
                          Role
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase py-3">
                          Join Date
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase py-3">
                          Status
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.role === 'tutor'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-600">
                            {user.joinDate}
                          </td>
                          <td className="py-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Course Approvals */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      Pending Approvals
                    </h2>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                      {stats.pendingApprovals}
                    </span>
                  </div>
                  <a
                    href="/admin/courses"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All →
                  </a>
                </div>

                <div className="space-y-4">
                  {pendingCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {course.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            by {course.tutor} • Submitted {course.submittedDate}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                          {course.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                          Approve
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                          Reject
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Payments */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Payments
                  </h2>
                  <a
                    href="/admin/payments"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All →
                  </a>
                </div>

                <div className="space-y-3">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {payment.user}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.course}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* System Health */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  System Health
                </h2>
                <div className="space-y-3">
                  {systemHealth.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.status === 'healthy'
                              ? 'bg-green-500'
                              : item.status === 'warning'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600">
                        {item.uptime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h2 className="text-lg font-bold mb-4">Platform Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white border-opacity-20">
                    <span className="text-sm opacity-90">Total Revenue</span>
                    <span className="font-bold">
                      {formatCurrency(stats.totalRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white border-opacity-20">
                    <span className="text-sm opacity-90">Total Payments</span>
                    <span className="font-bold">{stats.totalPayments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Active Users</span>
                    <span className="font-bold">{stats.activeUsers}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <button className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-left">
                    + Add New User
                  </button>
                  <button className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-left">
                    📊 View Analytics
                  </button>
                  <button className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-left">
                    ⚙️ System Settings
                  </button>
                  <button className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-left">
                    📝 Content Management
                  </button>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-orange-900">
                      Action Required
                    </h3>
                    <p className="text-xs text-orange-700 mt-1">
                      {stats.pendingApprovals} courses waiting for review
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}