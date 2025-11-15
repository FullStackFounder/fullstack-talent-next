'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Award,
  Clock,
  CheckCircle,
  Eye,
  Loader2,
  AlertCircle,
  TrendingUp,
  Calendar,
  Mail,
  User,
  X,
} from 'lucide-react';
import { enrollmentApi, Enrollment, EnrollmentProgressDetail } from '@/lib/api/enrollment';

interface CourseStudentsTabProps {
  courseId: string;
}

export default function CourseStudentsTab({ courseId }: CourseStudentsTabProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [studentProgress, setStudentProgress] = useState<EnrollmentProgressDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [showProgressModal, setShowProgressModal] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchEnrollments();
    }
  }, [courseId, currentPage, statusFilter]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        per_page: 20,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await enrollmentApi.getCourseEnrollments(courseId, params);
      setEnrollments(response.data);

      if (response.meta) {
        setTotalPages(response.meta.total_pages);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data siswa');
    } finally {
      setLoading(false);
    }
  };

  const viewStudentProgress = async (enrollment: Enrollment) => {
    try {
      setSelectedEnrollment(enrollment);

      const response = await enrollmentApi.getEnrollmentProgress(enrollment.id);
      setStudentProgress(response.data);
      setShowProgressModal(true);
    } catch (err: any) {
      alert(err.message || 'Gagal memuat progress siswa');
    }
  };

  const handleGetCertificate = async (enrollmentId: string) => {
    try {
      const response = await enrollmentApi.getCertificate(enrollmentId);
      // Open certificate URL in new tab
      window.open(response.data.certificate_url, '_blank');
    } catch (err: any) {
      alert(err.message || 'Gagal mendapatkan certificate. Pastikan course sudah selesai.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Aktif</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Selesai</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Dibatalkan</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Expired</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Filter by search term (client-side filtering)
  const filteredEnrollments = enrollments.filter(enrollment => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      // Note: We need to get student info from backend join
      // For now, we'll search by student_id until backend provides student_name
      return enrollment.student_id?.toLowerCase().includes(search);
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600 mt-4">Memuat data siswa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Gagal memuat data siswa</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchEnrollments}
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
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Total Siswa</p>
              <p className="text-2xl font-bold text-blue-900">{enrollments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Selesai</p>
              <p className="text-2xl font-bold text-green-900">
                {enrollments.filter(e => e.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600">Sedang Belajar</p>
              <p className="text-2xl font-bold text-yellow-900">
                {enrollments.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Rata-rata Progress</p>
              <p className="text-2xl font-bold text-purple-900">
                {enrollments.length > 0
                  ? Math.round(enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="active">Aktif</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Students List */}
      {filteredEnrollments.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada siswa</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Tidak ada siswa yang cocok dengan pencarian' : 'Belum ada siswa yang terdaftar di kursus ini'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Siswa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mulai Belajar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Selesai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {enrollment.tutor_avatar ? (
                            <img
                              src={enrollment.tutor_avatar}
                              alt="Student"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Student #{enrollment.student_id.substring(0, 8)}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            ID: {enrollment.student_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(enrollment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${enrollment.progress_percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(enrollment.progress_percentage)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(enrollment.started_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {enrollment.completed_at
                          ? formatDate(enrollment.completed_at)
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewStudentProgress(enrollment)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Lihat Progress"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {enrollment.status === 'completed' && (
                          <button
                            onClick={() => handleGetCertificate(enrollment.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Lihat Certificate"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span className="text-sm text-gray-600">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      )}

      {/* Progress Modal */}
      {showProgressModal && selectedEnrollment && studentProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Progress Detail</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Student ID: {selectedEnrollment.student_id}
                  </p>
                </div>
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Overall Progress */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Progress Keseluruhan</h3>
                  <span className="text-3xl font-bold text-blue-600">
                    {Math.round(studentProgress.statistics.progress_percentage)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Pelajaran</p>
                    <p className="text-2xl font-bold text-gray-900">{studentProgress.statistics.total_lessons}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Selesai</p>
                    <p className="text-2xl font-bold text-green-600">{studentProgress.statistics.completed_lessons}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sedang Berjalan</p>
                    <p className="text-2xl font-bold text-yellow-600">{studentProgress.statistics.in_progress_lessons}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Waktu Belajar</p>
                      <p className="text-gray-900 font-medium">{studentProgress.statistics.time_spent_hours.toFixed(1)} jam</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Hari Sejak Daftar</p>
                      <p className="text-gray-900 font-medium">{studentProgress.statistics.days_since_enrollment} hari</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Lesson */}
              {studentProgress.next_lesson && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-900 mb-2">Pelajaran Selanjutnya</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 font-medium">{studentProgress.next_lesson.title}</p>
                      <p className="text-sm text-gray-600">{studentProgress.next_lesson.module_title}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      {studentProgress.next_lesson.duration_minutes} menit
                    </span>
                  </div>
                </div>
              )}

              {/* Module Progress */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress per Modul</h3>
                <div className="space-y-4">
                  {studentProgress.module_progress.map((module) => (
                    <div key={module.module_id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{module.module_title}</h4>
                        <span className="text-sm text-gray-600">
                          {module.completed_lessons}/{module.total_lessons} selesai
                        </span>
                      </div>
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.lesson_id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-3 flex-1">
                              {lesson.status === 'completed' ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : lesson.status === 'in_progress' ? (
                                <Clock className="w-5 h-5 text-yellow-600" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                              )}
                              <span className="text-sm text-gray-900">{lesson.lesson_title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    lesson.status === 'completed'
                                      ? 'bg-green-600'
                                      : lesson.status === 'in_progress'
                                      ? 'bg-yellow-600'
                                      : 'bg-gray-400'
                                  }`}
                                  style={{ width: `${lesson.progress_percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-600 w-12 text-right">
                                {Math.round(lesson.progress_percentage)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}