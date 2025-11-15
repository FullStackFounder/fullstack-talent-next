'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Award,
  BookOpen,
  Calendar,
  Eye,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface CourseAnalyticsTabProps {
  courseId: string;
}

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: Array<{ month: string; amount: number }>;
    growth_percentage: number;
  };
  students: {
    total_enrolled: number;
    active_students: number;
    completed_students: number;
    enrollment_trend: Array<{ month: string; count: number }>;
  };
  engagement: {
    average_completion_rate: number;
    average_time_spent_hours: number;
    average_rating: number;
    total_reviews: number;
  };
  popular_lessons: Array<{
    lesson_id: string;
    lesson_title: string;
    module_title: string;
    view_count: number;
    completion_rate: number;
  }>;
  completion_stats: {
    completed: number;
    in_progress: number;
    not_started: number;
  };
}

export default function CourseAnalyticsTab({ courseId }: CourseAnalyticsTabProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    if (courseId) {
      fetchAnalytics();
    }
  }, [courseId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await courseApi.getAnalytics(courseId, { range: timeRange });
      // setAnalytics(response.data);

      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalytics({
        revenue: {
          total: 15750000,
          monthly: [
            { month: 'Jan', amount: 2500000 },
            { month: 'Feb', amount: 3200000 },
            { month: 'Mar', amount: 2800000 },
            { month: 'Apr', amount: 3500000 },
            { month: 'May', amount: 3750000 },
          ],
          growth_percentage: 12.5,
        },
        students: {
          total_enrolled: 245,
          active_students: 187,
          completed_students: 58,
          enrollment_trend: [
            { month: 'Jan', count: 45 },
            { month: 'Feb', count: 52 },
            { month: 'Mar', count: 48 },
            { month: 'Apr', count: 55 },
            { month: 'May', count: 45 },
          ],
        },
        engagement: {
          average_completion_rate: 68.5,
          average_time_spent_hours: 12.3,
          average_rating: 4.7,
          total_reviews: 142,
        },
        popular_lessons: [
          {
            lesson_id: '1',
            lesson_title: 'Introduction to React Hooks',
            module_title: 'React Fundamentals',
            view_count: 234,
            completion_rate: 92.5,
          },
          {
            lesson_id: '2',
            lesson_title: 'State Management with Redux',
            module_title: 'Advanced React',
            view_count: 198,
            completion_rate: 85.3,
          },
          {
            lesson_id: '3',
            lesson_title: 'Building REST APIs',
            module_title: 'Backend Development',
            view_count: 176,
            completion_rate: 78.9,
          },
          {
            lesson_id: '4',
            lesson_title: 'Database Design Principles',
            module_title: 'Database Management',
            view_count: 165,
            completion_rate: 81.2,
          },
        ],
        completion_stats: {
          completed: 58,
          in_progress: 129,
          not_started: 58,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Gagal memuat analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600 mt-4">Memuat analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Gagal memuat analytics</h3>
            <p className="text-red-700 mt-1">{error || 'Data tidak tersedia'}</p>
            <button
              onClick={fetchAnalytics}
              className="mt-3 text-red-700 font-medium hover:underline"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === 'all' ? 'Semua' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Pendapatan</h3>
              <p className="text-sm text-gray-600">Dari semua enrollment</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.revenue.total)}</p>
            <div className="flex items-center gap-1 text-sm mt-1">
              {analytics.revenue.growth_percentage >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">+{analytics.revenue.growth_percentage}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 font-medium">{analytics.revenue.growth_percentage}%</span>
                </>
              )}
              <span className="text-gray-500">vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Revenue Chart (Simple Bar Chart) */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Pendapatan Bulanan</h4>
          <div className="flex items-end gap-2 h-48">
            {analytics.revenue.monthly.map((month, index) => {
              const maxAmount = Math.max(...analytics.revenue.monthly.map(m => m.amount));
              const heightPercentage = (month.amount / maxAmount) * 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '100%' }}>
                    <div
                      className="w-full bg-green-500 rounded-t absolute bottom-0 transition-all hover:bg-green-600"
                      style={{ height: `${heightPercentage}%` }}
                      title={formatCurrency(month.amount)}
                    />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{month.month}</span>
                  <span className="text-xs text-gray-500">{formatCurrency(month.amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Siswa</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.students.total_enrolled)}</p>
          <p className="text-sm text-gray-500 mt-2">
            {formatNumber(analytics.students.active_students)} aktif belajar
          </p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Tingkat Selesai</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.engagement.average_completion_rate}%</p>
          <p className="text-sm text-gray-500 mt-2">
            {formatNumber(analytics.students.completed_students)} siswa selesai
          </p>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Rating Rata-rata</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.engagement.average_rating.toFixed(1)}</p>
          <p className="text-sm text-gray-500 mt-2">
            Dari {formatNumber(analytics.engagement.total_reviews)} ulasan
          </p>
        </div>

        {/* Average Time Spent */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Waktu Belajar</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.engagement.average_time_spent_hours}h</p>
          <p className="text-sm text-gray-500 mt-2">Rata-rata per siswa</p>
        </div>
      </div>

      {/* Enrollment Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tren Enrollment</h3>
            <p className="text-sm text-gray-600">Jumlah siswa baru per bulan</p>
          </div>
        </div>

        <div className="flex items-end gap-2 h-40">
          {analytics.students.enrollment_trend.map((month, index) => {
            const maxCount = Math.max(...analytics.students.enrollment_trend.map(m => m.count));
            const heightPercentage = (month.count / maxCount) * 100;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '100%' }}>
                  <div
                    className="w-full bg-blue-500 rounded-t absolute bottom-0 transition-all hover:bg-blue-600"
                    style={{ height: `${heightPercentage}%` }}
                    title={`${month.count} siswa`}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">{month.month}</span>
                <span className="text-xs text-gray-500">{month.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Status Pembelajaran</h3>
            <p className="text-sm text-gray-600">Distribusi progress siswa</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Completed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Selesai</span>
              <span className="text-sm font-bold text-green-600">
                {analytics.completion_stats.completed} siswa
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{
                  width: `${(analytics.completion_stats.completed / analytics.students.total_enrolled) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* In Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Sedang Belajar</span>
              <span className="text-sm font-bold text-blue-600">
                {analytics.completion_stats.in_progress} siswa
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{
                  width: `${(analytics.completion_stats.in_progress / analytics.students.total_enrolled) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Not Started */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Belum Mulai</span>
              <span className="text-sm font-bold text-gray-600">
                {analytics.completion_stats.not_started} siswa
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gray-400 h-3 rounded-full"
                style={{
                  width: `${(analytics.completion_stats.not_started / analytics.students.total_enrolled) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Popular Lessons */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Lesson Paling Populer</h3>
            <p className="text-sm text-gray-600">Berdasarkan views dan completion rate</p>
          </div>
        </div>

        <div className="space-y-3">
          {analytics.popular_lessons.map((lesson, index) => (
            <div key={lesson.lesson_id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{lesson.lesson_title}</h4>
                <p className="text-xs text-gray-500">{lesson.module_title}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{formatNumber(lesson.view_count)}</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">{lesson.completion_rate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}