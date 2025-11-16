'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminApi, AdminCourse } from '@/lib/api/admin';
import {
  BookOpen,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Star,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Tag,
} from 'lucide-react';

interface CourseFilters {
  status: 'all' | 'draft' | 'pending' | 'published' | 'rejected';
  search: string;
  tutor_id?: string;
  page: number;
  per_page: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  thumbnail_url?: string;
  tutor_id: string;
  tutor_name: string;
  tutor_avatar?: string;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  price: number;
  discount_price?: number;
  level: string;
  total_enrolled: number;
  total_modules: number;
  total_lessons: number;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  category_name?: string;
}

export default function AdminCoursesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });

  const [filters, setFilters] = useState<CourseFilters>({
    status: 'all',
    search: '',
    page: 1,
    per_page: 10,
  });

  const [stats, setStats] = useState({
    total_courses: 0,
    pending_courses: 0,
    published_courses: 0,
    draft_courses: 0,
  });

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [filters.page, filters.status]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getCourses(filters);

      // Mock data for demonstration - replace with actual API response
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Complete Web Development Bootcamp 2025',
          slug: 'complete-web-development-bootcamp-2025',
          thumbnail_url: 'https://via.placeholder.com/400x250',
          tutor_id: 'tutor-1',
          tutor_name: 'John Doe',
          tutor_avatar: 'https://via.placeholder.com/50',
          status: 'pending',
          price: 499000,
          discount_price: 299000,
          level: 'beginner',
          total_enrolled: 0,
          total_modules: 12,
          total_lessons: 120,
          average_rating: 0,
          total_reviews: 0,
          created_at: '2025-01-10 10:00:00',
          updated_at: '2025-01-15 14:30:00',
          category_name: 'Web Development',
        },
        {
          id: '2',
          title: 'React & Next.js Masterclass',
          slug: 'react-nextjs-masterclass',
          thumbnail_url: 'https://via.placeholder.com/400x250',
          tutor_id: 'tutor-2',
          tutor_name: 'Jane Smith',
          tutor_avatar: 'https://via.placeholder.com/50',
          status: 'published',
          price: 599000,
          discount_price: 399000,
          level: 'intermediate',
          total_enrolled: 450,
          total_modules: 15,
          total_lessons: 150,
          average_rating: 4.8,
          total_reviews: 120,
          created_at: '2025-01-01 10:00:00',
          updated_at: '2025-01-05 14:30:00',
          published_at: '2025-01-05 15:00:00',
          category_name: 'Web Development',
        },
        {
          id: '3',
          title: 'Node.js Backend Development',
          slug: 'nodejs-backend-development',
          thumbnail_url: 'https://via.placeholder.com/400x250',
          tutor_id: 'tutor-3',
          tutor_name: 'Bob Johnson',
          tutor_avatar: 'https://via.placeholder.com/50',
          status: 'pending',
          price: 450000,
          level: 'intermediate',
          total_enrolled: 0,
          total_modules: 10,
          total_lessons: 100,
          average_rating: 0,
          total_reviews: 0,
          created_at: '2025-01-12 10:00:00',
          updated_at: '2025-01-16 14:30:00',
          category_name: 'Backend Development',
        },
        {
          id: '4',
          title: 'UI/UX Design Complete Guide',
          slug: 'ui-ux-design-complete-guide',
          thumbnail_url: 'https://via.placeholder.com/400x250',
          tutor_id: 'tutor-4',
          tutor_name: 'Alice Brown',
          tutor_avatar: 'https://via.placeholder.com/50',
          status: 'draft',
          price: 399000,
          level: 'beginner',
          total_enrolled: 0,
          total_modules: 8,
          total_lessons: 80,
          average_rating: 0,
          total_reviews: 0,
          created_at: '2025-01-14 10:00:00',
          updated_at: '2025-01-14 14:30:00',
          category_name: 'Design',
        },
      ];

      // Filter by status
      let filtered = mockCourses;
      if (filters.status !== 'all') {
        filtered = mockCourses.filter(c => c.status === filters.status);
      }

      // Filter by search
      if (filters.search) {
        filtered = filtered.filter(c =>
          c.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          c.tutor_name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setCourses(filtered);
      setPagination({
        current_page: 1,
        per_page: 10,
        total: filtered.length,
        total_pages: Math.ceil(filtered.length / 10),
      });

      // Calculate stats
      setStats({
        total_courses: mockCourses.length,
        pending_courses: mockCourses.filter(c => c.status === 'pending').length,
        published_courses: mockCourses.filter(c => c.status === 'published').length,
        draft_courses: mockCourses.filter(c => c.status === 'draft').length,
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key: keyof CourseFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleApproveCourse = async (courseId: string) => {
    if (!confirm('Approve kursus ini?')) return;

    setActionLoading(courseId);
    try {
      await adminApi.approveCourse(courseId);
      alert('Kursus berhasil diapprove');
      fetchCourses();
    } catch (error) {
      console.error('Error approving course:', error);
      alert('Gagal approve kursus');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectCourse = async (courseId: string) => {
    const reason = prompt('Alasan reject:');
    if (!reason) return;

    setActionLoading(courseId);
    try {
      await adminApi.rejectCourse(courseId, reason);
      alert('Kursus berhasil direject');
      fetchCourses();
    } catch (error) {
      console.error('Error rejecting course:', error);
      alert('Gagal reject kursus');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Hapus kursus ini? Tindakan ini tidak dapat dibatalkan!')) return;

    setActionLoading(courseId);
    try {
      await adminApi.deleteCourse(courseId);
      alert('Kursus berhasil dihapus');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Gagal menghapus kursus');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Review' },
      published: { bg: 'bg-green-100', text: 'text-green-700', label: 'Published' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getLevelBadge = (level: string) => {
    const badges = {
      beginner: { bg: 'bg-blue-100', text: 'text-blue-700' },
      intermediate: { bg: 'bg-purple-100', text: 'text-purple-700' },
      advanced: { bg: 'bg-red-100', text: 'text-red-700' },
    };
    const badge = badges[level as keyof typeof badges] || badges.beginner;

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text} capitalize`}>
        {level}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-600">Kelola dan review kursus platform</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchCourses}
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_courses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending_courses}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.published_courses}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.draft_courses}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul kursus atau tutor..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchCourses()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="bg-white rounded-lg border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Tidak ada kursus ditemukan</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-6">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        <img
                          src={course.thumbnail_url || '/placeholder-course.jpg'}
                          alt={course.title}
                          className="w-48 h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {course.title}
                              </h3>
                              {getStatusBadge(course.status)}
                              {getLevelBadge(course.level)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{course.tutor_name}</span>
                              </div>
                              {course.category_name && (
                                <div className="flex items-center gap-1">
                                  <Tag className="w-4 h-4" />
                                  <span>{course.category_name}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(course.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(course.discount_price || course.price)}
                              {course.discount_price && (
                                <span className="ml-2 text-xs text-gray-400 line-through">
                                  {formatCurrency(course.price)}
                                </span>
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Content</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {course.total_modules} modules • {course.total_lessons} lessons
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Students</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {course.total_enrolled} enrolled
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-semibold text-gray-900">
                                {course.average_rating > 0 ? course.average_rating.toFixed(1) : 'N/A'}
                              </span>
                              {course.total_reviews > 0 && (
                                <span className="text-xs text-gray-500">
                                  ({course.total_reviews})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/admin/courses/${course.id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {course.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveCourse(course.id)}
                                disabled={actionLoading === course.id}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {actionLoading === course.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <ThumbsUp className="w-4 h-4" />
                                )}
                                Approve
                              </button>

                              <button
                                onClick={() => handleRejectCourse(course.id)}
                                disabled={actionLoading === course.id}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                {actionLoading === course.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <ThumbsDown className="w-4 h-4" />
                                )}
                                Reject
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            disabled={actionLoading === course.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
                    {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                    {pagination.total} courses
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                      Page {pagination.current_page} of {pagination.total_pages}
                    </span>

                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.total_pages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
