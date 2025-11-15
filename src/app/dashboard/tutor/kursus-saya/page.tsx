'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Users,
  Star,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Upload,
  AlertCircle
} from 'lucide-react';
import { courseApi, Course } from '@/lib/api/course';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function MyCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'price' | 'title' | 'average_rating' | 'total_enrolled'>('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  // Dropdown menu state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        per_page: 12,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await courseApi.getMyCourses(params);
      setCourses(response.data);
      setTotalPages(response.meta.total_pages);
      setTotalCourses(response.meta.total);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat kursus');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (courseId: string) => {
    try {
      await courseApi.publishCourse(courseId);
      fetchCourses();
    } catch (err: any) {
      alert(err.message || 'Gagal mempublikasi kursus');
    }
  };

  const handleDelete = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kursus "${courseTitle}"?`)) {
      return;
    }

    try {
      await courseApi.deleteCourse(courseId);
      fetchCourses();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus kursus');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (course: Course) => {
    if (course.status === 'published') {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Dipublikasi</span>;
    } else if (course.status === 'archived') {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Diarsipkan</span>;
    } else if (course.status === 'pending_review') {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Menunggu Review</span>;
    } else if (course.status === 'approved') {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Disetujui</span>;
    } else if (course.status === 'rejected') {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Ditolak</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Draft</span>;
    }
  };

  return (
    <DashboardLayout role="tutor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kursus Saya</h1>
            <p className="text-gray-600 mt-1">
              Kelola dan pantau semua kursus Anda {totalCourses > 0 && `(${totalCourses} kursus)`}
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/tutor/kursus-saya/buat')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Buat Kursus Baru
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari kursus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="published">Dipublikasi</option>
                <option value="draft">Draft</option>
                <option value="archived">Diarsipkan</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">Tanggal Dibuat</option>
                <option value="title">Judul (A-Z)</option>
                <option value="price">Harga</option>
                <option value="average_rating">Rating</option>
                <option value="total_enrolled">Jumlah Siswa</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="DESC">Menurun</option>
                <option value="ASC">Menaik</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Memuat kursus...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Gagal memuat kursus</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button
                onClick={fetchCourses}
                className="text-red-700 text-sm font-medium mt-2 hover:underline"
              >
                Coba lagi
              </button>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mt-4">Belum ada kursus</h3>
            <p className="text-gray-600 mt-2">
              Mulai buat kursus pertama Anda dan bagikan pengetahuan Anda dengan siswa
            </p>
            <button
              onClick={() => router.push('/dashboard/tutor/kursus-saya/buat')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-6"
            >
              <Plus className="w-5 h-5" />
              Buat Kursus Baru
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(course)}
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === course.id ? null : course.id)}
                          className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-700" />
                        </button>

                        {activeDropdown === course.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => {
                                router.push(`/dashboard/tutor/kursus-saya/${course.id}`);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Lihat Detail
                            </button>
                            <button
                              onClick={() => {
                                router.push(`/dashboard/tutor/kursus-saya/${course.id}/edit`);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Kursus
                            </button>
                            {course.status === 'draft' && (
                              <button
                                onClick={() => {
                                  handlePublish(course.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                              >
                                <Upload className="w-4 h-4" />
                                Publikasikan
                              </button>
                            )}
                            <hr className="my-1" />
                            <button
                              onClick={() => {
                                handleDelete(course.id, course.title);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelBadgeColor(course.level)}`}>
                        {course.level === 'beginner' ? 'Pemula' : course.level === 'intermediate' ? 'Menengah' : 'Lanjutan'}
                      </span>
                      {course.category && (
                        <span className="text-xs text-gray-600">{course.category.name}</span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.short_description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                          <Users className="w-4 h-4" />
                          {course.total_enrolled}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Siswa</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {course.average_rating.toFixed(1)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Rating</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                          <BookOpen className="w-4 h-4" />
                          {course.total_lessons}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Pelajaran</p>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        {course.discount_price && course.discount_price < course.price ? (
                          <div>
                            <p className="text-xs text-gray-500 line-through">
                              {formatCurrency(course.price)}
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                              {formatCurrency(course.discount_price)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-lg font-bold text-blue-600">
                            {formatCurrency(course.price)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => router.push(`/dashboard/tutor/kursus-saya/${course.id}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Kelola
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
