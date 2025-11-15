'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  ArrowLeft,
  Edit,
  Eye,
  Upload,
  Settings,
  BarChart3,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { courseApi, Course } from '@/lib/api/course';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CourseContentTab from '@/components/tutor/CourseContentTab';
import CourseStudentsTab from '@/components/tutor/CourseStudentsTab';
import CourseAnalyticsTab from '@/components/tutor/CourseAnalyticsTab';
import CourseSettingsTab from '@/components/tutor/CourseSettingsTab';

type TabType = 'overview' | 'content' | 'students' | 'analytics' | 'settings';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseApi.getCourseById(courseId);
      setCourse(response.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat detail kursus');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!course) return;

    try {
      await courseApi.publishCourse(course.id);
      fetchCourseDetail();
    } catch (err: any) {
      alert(err.message || 'Gagal mempublikasi kursus');
    }
  };

  const handleDelete = async () => {
    if (!course) return;

    if (!confirm(`Apakah Anda yakin ingin menghapus kursus "${course.title}"?`)) {
      return;
    }

    try {
      await courseApi.deleteCourse(course.id);
      router.push('/dashboard/tutor/kursus-saya');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Pemula';
      case 'intermediate':
        return 'Menengah';
      case 'advanced':
        return 'Lanjutan';
      default:
        return level;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">Dipublikasi</span>;
      case 'draft':
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">Draft</span>;
      case 'pending_review':
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">Menunggu Review</span>;
      case 'approved':
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">Disetujui</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">Ditolak</span>;
      case 'archived':
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">Diarsipkan</span>;
      default:
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="tutor">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Memuat detail kursus...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout userRole="tutor">
        <div className="max-w-4xl mx-auto py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium text-lg">Gagal memuat kursus</h3>
              <p className="text-red-700 mt-1">{error || 'Kursus tidak ditemukan'}</p>
              <button
                onClick={() => router.push('/dashboard/tutor/kursus-saya')}
                className="mt-4 text-red-700 font-medium hover:underline"
              >
                Kembali ke Kursus Saya
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate revenue (mock for now - will be from API)
  const estimatedRevenue = course.total_enrolled * (course.discount_price || course.price);
  const completionRate = 0; // Will be from analytics API

  return (
    <DashboardLayout userRole="tutor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/tutor/kursus-saya')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{course.title}</h1>
              {getStatusBadge(course.status)}
            </div>
            <p className="text-gray-600 mt-1">Kelola dan pantau kursus Anda</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push(`/dashboard/tutor/kursus-saya/${course.id}/edit`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Kursus
          </button>

          {course.status === 'draft' && (
            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Publikasikan
            </button>
          )}

          <button
            onClick={() => window.open(`/courses/${course.slug}`, '_blank')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Lihat sebagai Siswa
          </button>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Siswa</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{course.total_enrolled}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Aktif terdaftar
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendapatan</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(estimatedRevenue)}
                </p>
                <p className="text-xs text-gray-500 mt-2">Estimasi total</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {course.average_rating.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Dari {course.total_reviews} ulasan
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tingkat Selesai</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{completionRate}%</p>
                <p className="text-xs text-gray-500 mt-2">Rata-rata siswa</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Overview
                </div>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'content'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Konten ({course.total_modules} Modul)
                </div>
              </button>

              <button
                onClick={() => setActiveTab('students')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'students'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Siswa ({course.total_enrolled})
                </div>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </div>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Course Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kursus</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Level</label>
                      <p className="text-gray-900 mt-1">{getLevelLabel(course.level)}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Bahasa</label>
                      <p className="text-gray-900 mt-1">{course.language}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Harga</label>
                      <div className="mt-1">
                        {course.discount_price && course.discount_price < course.price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 line-through text-sm">
                              {formatCurrency(course.price)}
                            </span>
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(course.discount_price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(course.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Kategori</label>
                      <p className="text-gray-900 mt-1">{course.category_name || '-'}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Total Modul</label>
                      <p className="text-gray-900 mt-1">{course.total_modules} modul</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Total Pelajaran</label>
                      <p className="text-gray-900 mt-1">{course.total_lessons} pelajaran</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Dibuat</label>
                      <p className="text-gray-900 mt-1">{formatDate(course.created_at)}</p>
                    </div>

                    {course.published_at && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Dipublikasi</label>
                        <p className="text-gray-900 mt-1">{formatDate(course.published_at)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{course.description}</p>
                </div>

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Persyaratan</h3>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Learning Outcomes */}
                {course.learning_outcomes && course.learning_outcomes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Hasil Pembelajaran</h3>
                    <ul className="space-y-2">
                      {course.learning_outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'content' && (
              <CourseContentTab courseId={course.id} />
            )}

            {activeTab === 'students' && (
              <CourseStudentsTab courseId={course.id} />
            )}

            {activeTab === 'analytics' && (
              <CourseAnalyticsTab courseId={course.id} />
            )}

            {activeTab === 'settings' && (
              <CourseSettingsTab courseId={course.id} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
