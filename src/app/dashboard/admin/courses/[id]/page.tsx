'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminApi } from '@/lib/api/admin';
import { courseApi } from '@/lib/api/course';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  DollarSign,
  Tag,
  Globe,
  Award,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  PlayCircle,
  FileText,
  List,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  thumbnail_url?: string;
  preview_video_url?: string;
  price: number;
  discount_price?: number;
  level: string;
  language: string;
  duration_hours: number;
  total_modules: number;
  total_lessons: number;
  total_enrolled: number;
  average_rating: number;
  total_reviews: number;
  is_featured: boolean;
  status: string;
  tutor_id: string;
  tutor_name: string;
  tutor_email: string;
  tutor_avatar?: string;
  tutor_bio?: string;
  category_id: string;
  category_name: string;
  requirements: string[];
  learning_outcomes: string[];
  tags: string[];
  modules: Array<{
    id: string;
    title: string;
    description: string;
    order_index: number;
    total_lessons: number;
    total_duration: number;
    is_preview: boolean;
    lessons: Array<{
      id: string;
      title: string;
      description: string;
      type: 'video' | 'text' | 'quiz' | 'assignment';
      duration_minutes: number;
      order_index: number;
      is_preview: boolean;
    }>;
  }>;
  created_at: string;
  published_at?: string;
  updated_at: string;
}

export default function AdminCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<CourseDetail | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const fetchCourseDetail = async () => {
    setLoading(true);
    try {
      const response = await courseApi.getCourseById(courseId);

      // Mock additional data for admin view
      const courseDetail: CourseDetail = {
        ...response.data,
        modules: response.data.modules || [],
      };

      setCourseData(courseDetail);

      // Expand first module by default
      if (courseDetail.modules && courseDetail.modules.length > 0) {
        setExpandedModules(new Set([courseDetail.modules[0].id]));
      }
    } catch (error) {
      console.error('Error fetching course detail:', error);
      alert('Gagal memuat detail kursus');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCourse = async () => {
    if (!confirm('Approve kursus ini? Kursus akan dipublikasikan.')) return;

    setActionLoading(true);
    try {
      await adminApi.approveCourse(courseId);
      alert('Kursus berhasil diapprove dan dipublikasikan');
      router.push('/dashboard/admin/courses');
    } catch (error) {
      console.error('Error approving course:', error);
      alert('Gagal approve kursus');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectCourse = async () => {
    const reason = prompt('Alasan reject:');
    if (!reason) return;

    setActionLoading(true);
    try {
      await adminApi.rejectCourse(courseId, reason);
      alert('Kursus berhasil direject');
      router.push('/dashboard/admin/courses');
    } catch (error) {
      console.error('Error rejecting course:', error);
      alert('Gagal reject kursus');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!confirm('Hapus kursus ini? Tindakan ini tidak dapat dibatalkan!')) return;

    setActionLoading(true);
    try {
      await adminApi.deleteCourse(courseId);
      alert('Kursus berhasil dihapus');
      router.push('/dashboard/admin/courses');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Gagal menghapus kursus');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft', icon: FileText },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Review', icon: AlertCircle },
      published: { bg: 'bg-green-100', text: 'text-green-700', label: 'Published', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: XCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  const getLessonIcon = (type: string) => {
    const icons = {
      video: PlayCircle,
      text: FileText,
      quiz: List,
      assignment: FileText,
    };
    const Icon = icons[type as keyof typeof icons] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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

  if (!courseData) {
    return (
      <DashboardLayout userRole="admin">
        <div className="text-center py-12">
          <p className="text-gray-600">Kursus tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push('/dashboard/admin/courses')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Kembali ke Course List</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Review</h1>
              <p className="text-gray-600">Detail lengkap kursus untuk review</p>
            </div>

            {courseData.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={handleApproveCourse}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ThumbsUp className="w-5 h-5" />
                  )}
                  Approve & Publish
                </button>

                <button
                  onClick={handleRejectCourse}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ThumbsDown className="w-5 h-5" />
                  )}
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Course Header Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Thumbnail */}
            <div className="lg:col-span-1">
              <img
                src={courseData.thumbnail_url || '/placeholder-course.jpg'}
                alt={courseData.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{courseData.title}</h2>
                  <p className="text-gray-600 mb-3">{courseData.short_description}</p>
                </div>
                {getStatusBadge(courseData.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(courseData.discount_price || courseData.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Enrolled</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {courseData.total_enrolled} students
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {courseData.average_rating > 0 ? courseData.average_rating.toFixed(1) : 'N/A'}{' '}
                      ({courseData.total_reviews})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Content</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {courseData.total_modules} modules • {courseData.total_lessons} lessons
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {courseData.duration_hours} hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Level</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">
                      {courseData.level}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tutor Info */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                {courseData.tutor_avatar ? (
                  <img
                    src={courseData.tutor_avatar}
                    alt={courseData.tutor_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    {courseData.tutor_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{courseData.tutor_name}</p>
                  <p className="text-xs text-gray-500">{courseData.tutor_email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{courseData.description}</p>
        </div>

        {/* Learning Outcomes & Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Outcomes */}
          {courseData.learning_outcomes && courseData.learning_outcomes.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What You'll Learn</h3>
              <ul className="space-y-2">
                {courseData.learning_outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {courseData.requirements && courseData.requirements.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-2">
                {courseData.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tags & Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {courseData.category_name}
                </span>
              </div>
            </div>

            {courseData.tags && courseData.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {courseData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Course Content</h3>

          <div className="space-y-3">
            {courseData.modules.map((module, index) => (
              <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                      <p className="text-sm text-gray-500">
                        {module.total_lessons} lessons • {module.total_duration} min
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedModules.has(module.id) ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {expandedModules.has(module.id) && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    {module.description && (
                      <p className="text-sm text-gray-700 mb-4">{module.description}</p>
                    )}
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="capitalize">{lesson.type}</span>
                              {lesson.duration_minutes > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{lesson.duration_minutes} min</span>
                                </>
                              )}
                              {lesson.is_preview && (
                                <>
                                  <span>•</span>
                                  <span className="text-blue-600 font-medium">Preview</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timestamps */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Created At</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {formatDate(courseData.created_at)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Updated</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {formatDate(courseData.updated_at)}
              </p>
            </div>
            {courseData.published_at && (
              <div>
                <p className="text-xs text-gray-500">Published At</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {formatDate(courseData.published_at)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-700 mb-4">
            Tindakan ini tidak dapat dibatalkan. Harap berhati-hati.
          </p>
          <button
            onClick={handleDeleteCourse}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete Course Permanently
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
