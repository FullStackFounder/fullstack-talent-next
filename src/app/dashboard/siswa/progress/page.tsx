'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { enrollmentApi } from '@/lib/api/enrollment';
import {
  TrendingUp,
  Clock,
  BookOpen,
  Award,
  Calendar,
  Target,
  Flame,
  BarChart3,
  CheckCircle,
  Play,
  Loader2,
  ChevronRight,
  Activity
} from 'lucide-react';

interface CourseProgress {
  id: string;
  course_title: string;
  course_slug: string;
  thumbnail_url?: string;
  progress_percentage: number;
  status: string;
  progress_stats?: {
    total_lessons: number;
    completed_lessons: number;
    in_progress_lessons: number;
    remaining_lessons: number;
    time_spent_hours: number;
    days_since_enrollment: number;
  };
}

interface DashboardStats {
  active_courses: number;
  completed_courses: number;
  total_time_spent_hours: number;
  current_streak_days: number;
  recent_enrollments: any[];
  learning_activity_7days: Array<{
    date: string;
    lessons_completed: number;
    minutes_spent: number;
  }>;
}

export default function StudentProgressPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard statistics
      const dashboardResponse = await enrollmentApi.getDashboard();
      setStats(dashboardResponse.data);

      // Fetch all enrolled courses for detailed progress
      const coursesResponse = await enrollmentApi.getMyCourses();
      setCourses(coursesResponse.data || []);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalLessons = () => {
    return courses.reduce((sum, course) => sum + (course.progress_stats?.total_lessons || 0), 0);
  };

  const calculateCompletedLessons = () => {
    return courses.reduce((sum, course) => sum + (course.progress_stats?.completed_lessons || 0), 0);
  };

  const calculateAverageProgress = () => {
    if (courses.length === 0) return 0;
    const total = courses.reduce((sum, course) => sum + course.progress_percentage, 0);
    return Math.round(total / courses.length);
  };

  const getWeekdayName = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[date.getDay()];
  };

  const getMaxMinutes = () => {
    if (!stats?.learning_activity_7days) return 100;
    return Math.max(...stats.learning_activity_7days.map(a => a.minutes_spent), 100);
  };

  return (
    <DashboardLayout userRole="siswa">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Belajar</h1>
          <p className="text-gray-600 mt-1">Pantau perkembangan pembelajaran Anda</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Top Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Active Courses */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm opacity-90">Kursus Aktif</p>
                <p className="text-4xl font-bold mt-2">{stats?.active_courses || 0}</p>
                <p className="text-xs opacity-75 mt-1">Sedang dipelajari</p>
              </div>

              {/* Completed Courses */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Kursus Selesai</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats?.completed_courses || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total diselesaikan</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Total Time Spent */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Waktu Belajar</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats?.total_time_spent_hours.toFixed(1) || 0}h
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total jam belajar</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Learning Streak */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Streak Belajar</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats?.current_streak_days || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Hari berturut-turut</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Activity Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-bold text-gray-900">Aktivitas Belajar (7 Hari Terakhir)</h2>
                </div>
              </div>

              {stats?.learning_activity_7days && stats.learning_activity_7days.length > 0 ? (
                <div className="space-y-4">
                  {/* Bar Chart */}
                  <div className="flex items-end justify-between gap-2 h-48">
                    {stats.learning_activity_7days.map((activity, index) => {
                      const height = (activity.minutes_spent / getMaxMinutes()) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex items-end justify-center h-40">
                            <div
                              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 cursor-pointer relative group"
                              style={{ height: `${height}%`, minHeight: activity.minutes_spent > 0 ? '8px' : '0' }}
                            >
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                                  <p className="font-medium">{activity.lessons_completed} lessons</p>
                                  <p>{activity.minutes_spent} menit</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center mt-2">
                            <p className="text-xs font-medium text-gray-900">
                              {getWeekdayName(activity.date)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.date).getDate()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-sm text-gray-600">Waktu Belajar (menit)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">Belum ada aktivitas belajar</p>
                </div>
              )}
            </div>

            {/* Overall Progress Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lessons Progress */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Progress Lessons</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Lessons</span>
                    <span className="text-2xl font-bold text-gray-900">{calculateTotalLessons()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Selesai</span>
                    <span className="text-2xl font-bold text-green-600">{calculateCompletedLessons()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tersisa</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {calculateTotalLessons() - calculateCompletedLessons()}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="text-sm font-bold text-gray-900">
                        {calculateTotalLessons() > 0
                          ? Math.round((calculateCompletedLessons() / calculateTotalLessons()) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                        style={{
                          width: `${
                            calculateTotalLessons() > 0
                              ? (calculateCompletedLessons() / calculateTotalLessons()) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Average Progress */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Rata-rata Progress</h3>
                </div>

                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {/* Circular Progress */}
                    <svg className="transform -rotate-90 w-48 h-48">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - calculateAverageProgress() / 100)}`}
                        className="text-blue-600 transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-5xl font-bold text-gray-900">{calculateAverageProgress()}%</span>
                      <span className="text-sm text-gray-600 mt-1">Semua Kursus</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Progress List */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Progress per Kursus</h2>
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Belum ada kursus yang diikuti</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/dashboard/siswa/courses/${course.id}/progress`)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600">
                          {course.thumbnail_url ? (
                            <img
                              src={course.thumbnail_url}
                              alt={course.course_title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white opacity-50" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-2">{course.course_title}</h3>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-bold text-gray-900">
                                {Math.round(course.progress_percentage)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${course.progress_percentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Stats */}
                          {course.progress_stats && (
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>
                                  {course.progress_stats.completed_lessons}/{course.progress_stats.total_lessons}{' '}
                                  lessons
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{course.progress_stats.time_spent_hours.toFixed(1)}h</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{course.progress_stats.days_since_enrollment} hari</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action */}
                        <div className="flex items-center gap-2">
                          {course.status === 'completed' ? (
                            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              Selesai
                            </div>
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
