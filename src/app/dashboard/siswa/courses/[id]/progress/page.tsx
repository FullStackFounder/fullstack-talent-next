'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { enrollmentApi } from '@/lib/api/enrollment';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle,
  Circle,
  Play,
  Loader2,
  Award,
  Target,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  ClipboardList
} from 'lucide-react';

interface LessonProgress {
  lesson_id: string;
  lesson_title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration_minutes: number | null;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  completed_at: string | null;
}

interface ModuleProgress {
  module_id: string;
  module_title: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
  lessons: LessonProgress[];
}

interface ProgressStats {
  total_lessons: number;
  completed_lessons: number;
  in_progress_lessons: number;
  remaining_lessons: number;
  progress_percentage: number;
  time_spent_minutes: number;
  time_spent_hours: number;
  days_since_enrollment: number;
  status: string;
  started_at: string;
  completed_at: string | null;
  is_completed: boolean;
  certificate_issued: boolean;
}

export default function CourseProgressDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [enrollmentId, setEnrollmentId] = useState('');
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [statistics, setStatistics] = useState<ProgressStats | null>(null);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProgressData();
  }, [courseId]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      // Get enrollment first
      const enrollmentsResponse = await enrollmentApi.getMyCourses();
      const enrollment = enrollmentsResponse.data.find(
        (e: any) => e.enrollable_id === courseId
      );

      if (!enrollment) {
        alert('Enrollment tidak ditemukan');
        router.push('/dashboard/siswa/courses');
        return;
      }

      setEnrollmentId(enrollment.id);

      // Get detailed progress
      const progressResponse = await enrollmentApi.getEnrollmentProgress(enrollment.id);
      const data = progressResponse.data;

      setCourseInfo(data.enrollment);
      setStatistics(data.statistics);
      setModuleProgress(data.module_progress || []);

      // Expand first module by default
      if (data.module_progress && data.module_progress.length > 0) {
        setExpandedModules(new Set([data.module_progress[0].module_id]));
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
      alert('Gagal memuat data progress');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-600" />;
      case 'text':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'quiz':
        return <ClipboardList className="w-4 h-4 text-purple-600" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-orange-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
      not_started: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Not Started' },
    };
    const badge = badges[status as keyof typeof badges] || badges.not_started;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout userRole="siswa">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="siswa">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push('/dashboard/siswa/courses')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Kembali ke Kursus Saya</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{courseInfo?.course_title}</h1>
              <p className="text-gray-600 mt-1">Detail Progress Pembelajaran</p>
            </div>
            {statistics?.is_completed && (
              <button
                onClick={() => router.push(`/dashboard/siswa/courses/${courseId}/certificate`)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Award className="w-4 h-4" />
                Lihat Sertifikat
              </button>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Overall Progress */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm opacity-90">Overall Progress</p>
              <p className="text-4xl font-bold mt-2">{Math.round(statistics.progress_percentage)}%</p>
              <p className="text-xs opacity-75 mt-1">
                {statistics.completed_lessons}/{statistics.total_lessons} lessons
              </p>
            </div>

            {/* Completed Lessons */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lessons Selesai</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {statistics.completed_lessons}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">dari {statistics.total_lessons}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Time Spent */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Waktu Belajar</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {statistics.time_spent_hours.toFixed(1)}h
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {statistics.time_spent_minutes} menit
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Days Learning */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Durasi Belajar</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {statistics.days_since_enrollment}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">hari sejak daftar</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Overview */}
        {statistics && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Progress Overview</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-bold text-gray-900">
                    {Math.round(statistics.progress_percentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${statistics.progress_percentage}%` }}
                  />
                </div>

                {/* Status Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">Completed</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {statistics.completed_lessons} lessons
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">In Progress</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {statistics.in_progress_lessons} lessons
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">Not Started</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {statistics.remaining_lessons} lessons
                    </span>
                  </div>
                </div>
              </div>

              {/* Circular Progress */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
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
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - statistics.progress_percentage / 100)}`}
                      className="text-blue-600 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-5xl font-bold text-gray-900">
                      {Math.round(statistics.progress_percentage)}%
                    </span>
                    <span className="text-sm text-gray-600 mt-1">Complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Mulai Belajar</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {formatDate(statistics.started_at)}
                </p>
              </div>
              {statistics.completed_at && (
                <div>
                  <p className="text-xs text-gray-500">Selesai</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(statistics.completed_at)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Module Progress */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-bold text-gray-900">Progress per Module</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {moduleProgress.map((module, index) => (
              <div key={module.module_id}>
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.module_id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold text-gray-500">
                        Module {index + 1}
                      </span>
                      <h3 className="text-base font-medium text-gray-900">{module.module_title}</h3>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        {module.completed_lessons}/{module.total_lessons} lessons
                      </span>
                      <span>•</span>
                      <span>{Math.round(module.progress_percentage)}% complete</span>
                    </div>

                    {/* Module Progress Bar */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${module.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  {expandedModules.has(module.module_id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 ml-4" />
                  )}
                </button>

                {/* Lessons List */}
                {expandedModules.has(module.module_id) && (
                  <div className="bg-gray-50 px-6 pb-4">
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.lesson_id}
                          className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
                        >
                          {/* Status Icon */}
                          <div className="flex-shrink-0">
                            {getStatusIcon(lesson.status)}
                          </div>

                          {/* Lesson Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getLessonIcon(lesson.type)}
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {lesson.lesson_title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span className="capitalize">{lesson.type}</span>
                              {lesson.duration_minutes && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{lesson.duration_minutes} min</span>
                                  </div>
                                </>
                              )}
                              {lesson.completed_at && (
                                <>
                                  <span>•</span>
                                  <span>Selesai: {formatDate(lesson.completed_at)}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex-shrink-0">
                            {lesson.status === 'in_progress' ? (
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${lesson.progress_percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-900 w-10 text-right">
                                  {lesson.progress_percentage}%
                                </span>
                              </div>
                            ) : (
                              getStatusBadge(lesson.status)
                            )}
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

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push(`/dashboard/siswa/courses/${courseId}/learn`)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            {statistics?.is_completed ? 'Review Kursus' : 'Lanjutkan Belajar'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
