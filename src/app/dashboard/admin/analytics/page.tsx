'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminApi } from '@/lib/api/admin';
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  Award,
  ShoppingCart,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Loader2,
  ArrowUp,
  ArrowDown,
  Target,
  Star,
  GraduationCap,
  CreditCard,
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    total_revenue: number;
    revenue_growth: number;
    total_users: number;
    user_growth: number;
    total_courses: number;
    course_growth: number;
    total_enrollments: number;
    enrollment_growth: number;
  };
  revenue_trend: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
  user_growth: Array<{
    date: string;
    students: number;
    tutors: number;
    total: number;
  }>;
  top_courses: Array<{
    id: string;
    title: string;
    tutor_name: string;
    total_enrolled: number;
    revenue: number;
    average_rating: number;
  }>;
  top_tutors: Array<{
    id: string;
    name: string;
    total_courses: number;
    total_students: number;
    total_revenue: number;
    average_rating: number;
  }>;
  enrollment_by_category: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | '1year'>('30days');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // In real implementation, this would fetch from API with time range
      // For now, using mock data structure
      const dashboardStats = await adminApi.getDashboardStats();

      // Mock analytics data - replace with actual API call
      const mockData: AnalyticsData = {
        overview: {
          total_revenue: dashboardStats.data.total_revenue || 125000000,
          revenue_growth: 12.5,
          total_users: dashboardStats.data.total_users || 2500,
          user_growth: 8.3,
          total_courses: dashboardStats.data.total_courses || 150,
          course_growth: 5.2,
          total_enrollments: dashboardStats.data.total_enrollments || 5000,
          enrollment_growth: 15.7,
        },
        revenue_trend: generateRevenueTrend(timeRange),
        user_growth: generateUserGrowth(timeRange),
        top_courses: [
          {
            id: '1',
            title: 'Fullstack Web Development',
            tutor_name: 'John Doe',
            total_enrolled: 450,
            revenue: 22500000,
            average_rating: 4.8,
          },
          {
            id: '2',
            title: 'React & Next.js Masterclass',
            tutor_name: 'Jane Smith',
            total_enrolled: 380,
            revenue: 19000000,
            average_rating: 4.9,
          },
          {
            id: '3',
            title: 'Node.js Backend Development',
            tutor_name: 'Bob Johnson',
            total_enrolled: 320,
            revenue: 16000000,
            average_rating: 4.7,
          },
          {
            id: '4',
            title: 'UI/UX Design Complete',
            tutor_name: 'Alice Brown',
            total_enrolled: 290,
            revenue: 14500000,
            average_rating: 4.6,
          },
          {
            id: '5',
            title: 'Mobile App Development',
            tutor_name: 'Charlie Wilson',
            total_enrolled: 250,
            revenue: 12500000,
            average_rating: 4.5,
          },
        ],
        top_tutors: [
          {
            id: '1',
            name: 'John Doe',
            total_courses: 8,
            total_students: 1200,
            total_revenue: 60000000,
            average_rating: 4.8,
          },
          {
            id: '2',
            name: 'Jane Smith',
            total_courses: 6,
            total_students: 980,
            total_revenue: 49000000,
            average_rating: 4.9,
          },
          {
            id: '3',
            name: 'Bob Johnson',
            total_courses: 5,
            total_students: 750,
            total_revenue: 37500000,
            average_rating: 4.7,
          },
        ],
        enrollment_by_category: [
          { category: 'Web Development', count: 1800, percentage: 36 },
          { category: 'Mobile Development', count: 1000, percentage: 20 },
          { category: 'UI/UX Design', count: 900, percentage: 18 },
          { category: 'Data Science', count: 700, percentage: 14 },
          { category: 'DevOps', count: 600, percentage: 12 },
        ],
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRevenueTrend = (range: string) => {
    const days = range === '7days' ? 7 : range === '30days' ? 30 : range === '90days' ? 90 : 365;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        revenue: Math.floor(Math.random() * 5000000) + 2000000,
        transactions: Math.floor(Math.random() * 50) + 10,
      });
    }
    return data;
  };

  const generateUserGrowth = (range: string) => {
    const days = range === '7days' ? 7 : range === '30days' ? 30 : range === '90days' ? 90 : 365;
    const data = [];
    const today = new Date();
    let totalStudents = 1000;
    let totalTutors = 50;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      totalStudents += Math.floor(Math.random() * 20) + 5;
      totalTutors += Math.floor(Math.random() * 3);

      data.push({
        date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        students: totalStudents,
        tutors: totalTutors,
        total: totalStudents + totalTutors,
      });
    }
    return data;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMaxRevenue = () => {
    if (!analyticsData?.revenue_trend) return 0;
    return Math.max(...analyticsData.revenue_trend.map((d) => d.revenue));
  };

  const getMaxUsers = () => {
    if (!analyticsData?.user_growth) return 0;
    return Math.max(...analyticsData.user_growth.map((d) => d.total));
  };

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const overview = analyticsData?.overview;

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Monitor platform performance dan growth</p>
          </div>

          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
              <option value="90days">90 Days</option>
              <option value="1year">1 Year</option>
            </select>

            <button
              onClick={fetchAnalytics}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              {overview && overview.revenue_growth > 0 ? (
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUp className="w-4 h-4" />
                  <span>{overview.revenue_growth}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm">
                  <ArrowDown className="w-4 h-4" />
                  <span>{Math.abs(overview?.revenue_growth || 0)}%</span>
                </div>
              )}
            </div>
            <p className="text-sm opacity-90">Total Revenue</p>
            <p className="text-3xl font-bold mt-2">
              {formatCurrency(overview?.total_revenue || 0)}
            </p>
            <p className="text-xs opacity-75 mt-1">vs last period</p>
          </div>

          {/* Total Users */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              {overview && overview.user_growth > 0 && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{overview.user_growth}%</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {(overview?.total_users || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">All registered users</p>
          </div>

          {/* Total Courses */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              {overview && overview.course_growth > 0 && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{overview.course_growth}%</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">Total Courses</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {overview?.total_courses || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Active courses</p>
          </div>

          {/* Total Enrollments */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              {overview && overview.enrollment_growth > 0 && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{overview.enrollment_growth}%</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">Total Enrollments</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {(overview?.total_enrollments || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Course enrollments</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                <p className="text-sm text-gray-600">Daily revenue over time</p>
              </div>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>

            <div className="h-64">
              {/* Bar Chart */}
              <div className="h-full flex items-end justify-between gap-1">
                {analyticsData?.revenue_trend.map((data, index) => {
                  const maxRevenue = getMaxRevenue();
                  const height = (data.revenue / maxRevenue) * 100;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full flex items-end justify-center h-48">
                        <div
                          className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t hover:from-green-600 hover:to-green-500 transition-all cursor-pointer"
                          style={{ height: `${height}%` }}
                        >
                          {/* Tooltip */}
                          <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                            <p className="font-semibold">{formatCurrency(data.revenue)}</p>
                            <p className="text-gray-300">{data.transactions} transactions</p>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 text-center">{data.date}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                <p className="text-sm text-gray-600">Students & Tutors over time</p>
              </div>
              <Users className="w-5 h-5 text-gray-400" />
            </div>

            <div className="h-64">
              {/* Line Chart Simulation */}
              <div className="h-full flex items-end justify-between gap-1">
                {analyticsData?.user_growth.map((data, index) => {
                  const maxUsers = getMaxUsers();
                  const studentHeight = (data.students / maxUsers) * 100;
                  const tutorHeight = (data.tutors / maxUsers) * 100;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full flex flex-col items-center justify-end h-48">
                        {/* Students */}
                        <div
                          className="w-full bg-blue-500 hover:bg-blue-600 transition-all cursor-pointer rounded-t"
                          style={{ height: `${studentHeight}%` }}
                        >
                          <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                            <p className="font-semibold">Students: {data.students}</p>
                            <p className="text-gray-300">Tutors: {data.tutors}</p>
                            <p className="text-gray-300">Total: {data.total}</p>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 text-center">{data.date}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs text-gray-600">Students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-xs text-gray-600">Tutors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Courses */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Top Courses</h3>
                <p className="text-sm text-gray-600">Best performing courses</p>
              </div>
              <Target className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {analyticsData?.top_courses.map((course, index) => (
                <div key={course.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{course.title}</p>
                    <p className="text-xs text-gray-500">by {course.tutor_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{course.total_enrolled} students</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{course.average_rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-sm font-bold text-green-600">
                      {formatCurrency(course.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Tutors */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Top Tutors</h3>
                <p className="text-sm text-gray-600">Best performing tutors</p>
              </div>
              <GraduationCap className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {analyticsData?.top_tutors.map((tutor, index) => (
                <div key={tutor.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{tutor.name}</p>
                    <p className="text-xs text-gray-500">
                      {tutor.total_courses} courses • {tutor.total_students} students
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{tutor.average_rating}</span>
                    </div>
                    <p className="text-sm font-bold text-green-600">
                      {formatCurrency(tutor.total_revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enrollment by Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Enrollment by Category</h3>
              <p className="text-sm text-gray-600">Distribution of course enrollments</p>
            </div>
            <BookOpen className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {analyticsData?.enrollment_by_category.map((category, index) => {
              const colors = [
                'bg-blue-600',
                'bg-purple-600',
                'bg-pink-600',
                'bg-orange-600',
                'bg-green-600',
              ];
              const bgColors = [
                'bg-blue-100',
                'bg-purple-100',
                'bg-pink-100',
                'bg-orange-100',
                'bg-green-100',
              ];

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                    <span className="text-sm text-gray-600">
                      {category.count.toLocaleString()} ({category.percentage}%)
                    </span>
                  </div>
                  <div className={`w-full ${bgColors[index]} rounded-full h-3`}>
                    <div
                      className={`${colors[index]} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
