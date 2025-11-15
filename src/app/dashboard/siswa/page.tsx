'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import { authApi } from '@/lib/api/auth';

export default function SiswaDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    enrolledCourses: 5,
    completedCourses: 2,
    inProgressCourses: 3,
    certificates: 2,
    totalHours: 48,
    averageProgress: 65,
  });

  useEffect(() => {
    const userData = authApi.getCurrentUser();
    setUser(userData);

    // TODO: Fetch real stats from API
    // fetchUserStats();
  }, []);

  const recentCourses = [
    {
      id: 1,
      title: 'Fullstack Web Development with React & Node.js',
      progress: 75,
      instructor: 'John Doe',
      thumbnail: '/placeholder-course.jpg',
      lastAccessed: '2 hours ago',
    },
    {
      id: 2,
      title: 'Mobile App Development with React Native',
      progress: 45,
      instructor: 'Jane Smith',
      thumbnail: '/placeholder-course.jpg',
      lastAccessed: '1 day ago',
    },
    {
      id: 3,
      title: 'Data Science & Machine Learning',
      progress: 30,
      instructor: 'Bob Johnson',
      thumbnail: '/placeholder-course.jpg',
      lastAccessed: '3 days ago',
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'React Final Project',
      course: 'Fullstack Web Development',
      dueDate: '2 days',
      type: 'assignment',
    },
    {
      id: 2,
      title: 'JavaScript Quiz',
      course: 'Web Development Fundamentals',
      dueDate: '5 days',
      type: 'quiz',
    },
    {
      id: 3,
      title: 'Database Design Project',
      course: 'Backend Development',
      dueDate: '1 week',
      type: 'project',
    },
  ];

  return (
    <DashboardLayout userRole="siswa">
      <div className="min-h-screen">
        <DashboardHeader
          title="Dashboard"
          subtitle="Selamat datang di dashboard pembelajaran Anda"
        />

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Kursus Aktif"
              value={stats.inProgressCourses}
              icon="📚"
              color="blue"
              change={{ value: 20, type: 'increase' }}
            />
            <StatsCard
              title="Kursus Selesai"
              value={stats.completedCourses}
              icon="✅"
              color="green"
              change={{ value: 15, type: 'increase' }}
            />
            <StatsCard
              title="Total Jam Belajar"
              value={`${stats.totalHours}h`}
              icon="⏱️"
              color="purple"
            />
            <StatsCard
              title="Sertifikat"
              value={stats.certificates}
              icon="🏆"
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Courses */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Kursus Terakhir
                  </h2>
                  <a
                    href="/siswa/courses"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Lihat Semua →
                  </a>
                </div>

                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {course.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          by {course.instructor}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-gray-900 font-medium">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Last accessed {course.lastAccessed}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Progress */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Progress Pembelajaran
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Overall Progress
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {stats.averageProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                        style={{ width: `${stats.averageProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.enrolledCourses}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Total Kursus
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {Math.round((stats.completedCourses / stats.enrolledCourses) * 100)}%
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Completion Rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Deadline Terdekat
                </h2>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {deadline.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {deadline.course}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            deadline.type === 'assignment'
                              ? 'bg-blue-100 text-blue-700'
                              : deadline.type === 'quiz'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {deadline.type}
                        </span>
                      </div>
                      <div className="flex items-center mt-3 text-xs">
                        <svg
                          className="w-4 h-4 text-orange-500 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-orange-600 font-medium">
                          Due in {deadline.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 mt-6 text-white">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left text-sm font-medium transition-all">
                    📚 Browse All Courses
                  </button>
                  <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left text-sm font-medium transition-all">
                    🎓 View Certificates
                  </button>
                  <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left text-sm font-medium transition-all">
                    👤 Edit Profile
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