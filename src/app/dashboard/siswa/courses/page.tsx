'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { enrollmentApi, Enrollment } from '@/lib/api/enrollment';
import {
  BookOpen,
  Clock,
  Play,
  CheckCircle,
  Search,
  Filter,
  ChevronDown,
  Loader2,
  TrendingUp,
  Award,
  BarChart3,
  Calendar,
  Star,
  User
} from 'lucide-react';

interface EnrollmentWithProgress extends Enrollment {
  progress_stats?: {
    total_lessons: number;
    completed_lessons: number;
    in_progress_lessons: number;
    remaining_lessons: number;
    progress_percentage: number;
    time_spent_hours: number;
    days_since_enrollment: number;
  };
  next_lesson?: {
    id: string;
    title: string;
    type: string;
    duration_minutes: number;
    module_title: string;
  };
}

export default function StudentCoursesPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<EnrollmentWithProgress[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<EnrollmentWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'title'>('recent');

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    avgProgress: 0,
  });

  useEffect(() => {
    fetchMyCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [enrollments, searchQuery, statusFilter, sortBy]);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const response = await enrollmentApi.getMyCourses();
      const courses = response.data || [];
      setEnrollments(courses);

      // Calculate statistics
      const total = courses.length;
      const active = courses.filter((c: Enrollment) => c.status === 'active').length;
      const completed = courses.filter((c: Enrollment) => c.status === 'completed').length;
      const avgProgress =
        total > 0
          ? courses.reduce((sum: number, c: Enrollment) => sum + c.progress_percentage, 0) / total
          : 0;

      setStats({
        total,
        active,
        completed,
        avgProgress: Math.round(avgProgress),
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...enrollments];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (enrollment) =>
          enrollment.course_title?.toLowerCase().includes(query) ||
          enrollment.tutor_name?.toLowerCase().includes(query) ||
          enrollment.category_name?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((enrollment) => enrollment.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.course_title || '').localeCompare(b.course_title || '');
        case 'progress':
          return b.progress_percentage - a.progress_percentage;
        case 'recent':
        default:
          return new Date(b.started_at).getTime() - new Date(a.started_at).getTime();
      }
    });

    setFilteredEnrollments(filtered);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
      expired: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Expired' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const handleContinueLearning = (enrollment: EnrollmentWithProgress) => {
    // Navigate to course learning page
    router.push(`/dashboard/siswa/courses/${enrollment.enrollable_id}/learn`);
  };

  const handleViewProgress = (enrollment: EnrollmentWithProgress) => {
    // Navigate to progress detail page
    router.push(`/dashboard/siswa/courses/${enrollment.enrollable_id}/progress`);
  };

  return (
    <DashboardLayout userRole="siswa">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kursus Saya</h1>
          <p className="text-gray-600 mt-1">Kelola dan lanjutkan pembelajaran Anda</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Kursus</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sedang Belajar</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : stats.active}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : stats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rata-rata Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : `${stats.avgProgress}%`}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kursus, tutor, kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="recent">Terbaru</option>
                <option value="title">Judul (A-Z)</option>
                <option value="progress">Progress Tertinggi</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Course List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {searchQuery || statusFilter !== 'all'
                ? 'Tidak ada kursus yang sesuai dengan filter'
                : 'Anda belum mendaftar kursus apapun'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => router.push('/courses')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Jelajahi Kursus
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                  {enrollment.thumbnail_url ? (
                    <img
                      src={enrollment.thumbnail_url}
                      alt={enrollment.course_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <BookOpen className="w-16 h-16 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(enrollment.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {enrollment.course_title}
                  </h3>

                  {/* Tutor & Category */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{enrollment.tutor_name}</span>
                    </div>
                    {enrollment.category_name && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{enrollment.category_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-gray-900">
                        {Math.round(enrollment.progress_percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Lessons</p>
                      <p className="text-sm font-bold text-gray-900">
                        {enrollment.progress_stats?.completed_lessons || 0}/
                        {enrollment.total_lessons || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Durasi</p>
                      <p className="text-sm font-bold text-gray-900">
                        {enrollment.duration_hours || 0}h
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Level</p>
                      <p className="text-sm font-bold text-gray-900 capitalize">
                        {enrollment.level || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Next Lesson */}
                  {enrollment.next_lesson && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium mb-1">Selanjutnya:</p>
                      <p className="text-sm text-gray-900 font-medium line-clamp-1">
                        {enrollment.next_lesson.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {enrollment.next_lesson.module_title}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {enrollment.status === 'active' ? (
                      <button
                        onClick={() => handleContinueLearning(enrollment)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Lanjutkan Belajar
                      </button>
                    ) : enrollment.status === 'completed' ? (
                      <button
                        onClick={() => router.push(`/dashboard/siswa/courses/${enrollment.enrollable_id}/certificate`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Award className="w-4 h-4" />
                        Lihat Sertifikat
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                      >
                        Tidak Tersedia
                      </button>
                    )}

                    <button
                      onClick={() => handleViewProgress(enrollment)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Lihat Progress"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Enrollment Date */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Mulai: {formatDate(enrollment.started_at)}</span>
                    </div>
                    {enrollment.progress_stats && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{enrollment.progress_stats.time_spent_hours.toFixed(1)}h belajar</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results count */}
        {!loading && filteredEnrollments.length > 0 && (
          <p className="text-sm text-gray-600 text-center">
            Menampilkan {filteredEnrollments.length} dari {enrollments.length} kursus
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
