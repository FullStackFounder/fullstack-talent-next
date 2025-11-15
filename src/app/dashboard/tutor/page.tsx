'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { authApi } from '@/lib/api/auth';

export default function TutorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalCourses: 8,
    totalStudents: 245,
    totalEarnings: 125000000,
    averageRating: 4.8,
    pendingReviews: 12,
    activeStudents: 189,
  });

  useEffect(() => {
    const userData = authApi.getCurrentUser();
    setUser(userData);

    // TODO: Fetch real stats from API
    // fetchTutorStats();
  }, []);

  const recentStudents = [
    {
      id: 1,
      name: 'Ahmad Rizki',
      course: 'Fullstack Web Development',
      progress: 75,
      lastActive: '2 hours ago',
      avatar: 'AR',
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      course: 'React Native Development',
      progress: 45,
      lastActive: '5 hours ago',
      avatar: 'SN',
    },
    {
      id: 3,
      name: 'Budi Santoso',
      course: 'Data Science',
      progress: 90,
      lastActive: '1 day ago',
      avatar: 'BS',
    },
    {
      id: 4,
      name: 'Dewi Lestari',
      course: 'UI/UX Design',
      progress: 60,
      lastActive: '2 days ago',
      avatar: 'DL',
    },
  ];

  const myCourses = [
    {
      id: 1,
      title: 'Fullstack Web Development with React & Node.js',
      students: 89,
      rating: 4.9,
      revenue: 45000000,
      status: 'published',
    },
    {
      id: 2,
      title: 'Mobile App Development with React Native',
      students: 67,
      rating: 4.7,
      revenue: 35000000,
      status: 'published',
    },
    {
      id: 3,
      title: 'Advanced JavaScript & TypeScript',
      students: 54,
      rating: 4.8,
      revenue: 28000000,
      status: 'published',
    },
  ];

  const recentReviews = [
    {
      id: 1,
      student: 'Ahmad Rizki',
      course: 'Fullstack Web Development',
      rating: 5,
      comment: 'Excellent course! Very detailed and easy to follow.',
      date: '2 days ago',
    },
    {
      id: 2,
      student: 'Siti Nurhaliza',
      course: 'React Native Development',
      rating: 4,
      comment: 'Good course, but could use more practical examples.',
      date: '3 days ago',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout userRole="tutor">
      <div className="min-h-screen">
        <DashboardHeader
          title="Tutor Dashboard"
          subtitle="Kelola kursus dan student Anda"
        />

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Kursus"
              value={stats.totalCourses}
              icon="📚"
              color="blue"
            />
            <StatsCard
              title="Total Students"
              value={stats.totalStudents}
              icon="👥"
              color="green"
              change={{ value: 12, type: 'increase' }}
            />
            <StatsCard
              title="Total Earnings"
              value={formatCurrency(stats.totalEarnings)}
              icon="💰"
              color="purple"
              change={{ value: 8, type: 'increase' }}
            />
            <StatsCard
              title="Average Rating"
              value={stats.averageRating}
              icon="⭐"
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Courses */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Kursus Saya
                  </h2>
                  <a
                    href="/tutor/courses"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Lihat Semua →
                  </a>
                </div>

                <div className="space-y-4">
                  {myCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {course.title}
                          </h3>
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center text-xs text-gray-600">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                              </svg>
                              {course.students} students
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <svg
                                className="w-4 h-4 mr-1 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {course.rating}
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              {formatCurrency(course.revenue)}
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          {course.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium">
                  + Create New Course
                </button>
              </div>

              {/* Recent Students */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Students
                  </h2>
                  <a
                    href="/tutor/students"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All →
                  </a>
                </div>

                <div className="space-y-3">
                  {recentStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {student.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {student.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {student.course}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-900">
                          {student.progress}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.lastActive}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Earnings Summary */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-90 mb-2">
                  This Month Earnings
                </h3>
                <p className="text-3xl font-bold mb-4">
                  {formatCurrency(stats.totalEarnings * 0.3)}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-90">Course Sales</span>
                    <span className="font-semibold">
                      {formatCurrency(stats.totalEarnings * 0.25)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Private Classes</span>
                    <span className="font-semibold">
                      {formatCurrency(stats.totalEarnings * 0.05)}
                    </span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium transition-all">
                  View Details →
                </button>
              </div>

              {/* Recent Reviews */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Recent Reviews
                  </h2>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    {stats.pendingReviews} new
                  </span>
                </div>

                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {review.student}
                          </p>
                          <p className="text-xs text-gray-500">
                            {review.course}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {review.date}
                      </p>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All Reviews →
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <button className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    + Create Course
                  </button>
                  <button className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    View Analytics
                  </button>
                  <button className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Manage Students
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}