'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { enrollmentApi } from '@/lib/api/enrollment';
import { moduleApi } from '@/lib/api/module';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Play,
  Lock,
  Menu,
  X,
  Loader2,
  BookOpen,
  Clock,
  FileText,
  Video,
  ClipboardList,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_preview: number;
  status?: 'not_started' | 'in_progress' | 'completed';
  progress_percentage?: number;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  lessons: Lesson[];
  completed_lessons?: number;
  total_lessons?: number;
}

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [modules, setModules] = useState<Module[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [enrollmentId, setEnrollmentId] = useState<string>('');
  const [courseName, setCourseName] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [completing, setCompleting] = useState(false);

  // Video progress
  const [videoProgress, setVideoProgress] = useState(0);
  const [lastSavedProgress, setLastSavedProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchCourseData();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [courseId]);

  useEffect(() => {
    if (currentLesson && currentLesson.type === 'video' && videoRef.current) {
      // Set up video progress tracking
      const video = videoRef.current;

      const handleTimeUpdate = () => {
        if (video.duration) {
          const progress = (video.currentTime / video.duration) * 100;
          setVideoProgress(progress);
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);

      // Save progress every 10 seconds
      progressIntervalRef.current = setInterval(() => {
        if (video.currentTime > 0 && Math.abs(videoProgress - lastSavedProgress) > 5) {
          saveProgress(videoProgress, video.currentTime);
        }
      }, 10000);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [currentLesson]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      // Get enrollment first to get enrollment ID
      const enrollmentsResponse = await enrollmentApi.getMyCourses();
      const enrollment = enrollmentsResponse.data.find(
        (e: any) => e.enrollable_id === courseId
      );

      if (!enrollment) {
        alert('Anda belum terdaftar di kursus ini');
        router.push('/dashboard/siswa/courses');
        return;
      }

      setEnrollmentId(enrollment.id);
      setCourseName(enrollment.course_title || 'Course');

      // Get course modules and lessons
      const modulesResponse = await moduleApi.getCourseModules(courseId);
      const modulesData = modulesResponse.data || [];

      // Get progress for each lesson
      const progressResponse = await enrollmentApi.getEnrollmentProgress(enrollment.id);
      const moduleProgress = progressResponse.data.module_progress || [];

      // Merge progress data with modules
      const modulesWithProgress = modulesData.map((module: any) => {
        const progressData = moduleProgress.find((mp: any) => mp.module_id === module.id);

        const lessonsWithProgress = (module.lessons || []).map((lesson: any) => {
          const lessonProgress = progressData?.lessons?.find((l: any) => l.lesson_id === lesson.id);
          return {
            ...lesson,
            status: lessonProgress?.status || 'not_started',
            progress_percentage: lessonProgress?.progress_percentage || 0,
          };
        });

        return {
          ...module,
          lessons: lessonsWithProgress,
          completed_lessons: progressData?.completed_lessons || 0,
          total_lessons: lessonsWithProgress.length,
        };
      });

      setModules(modulesWithProgress);

      // Expand first module and set first lesson as current
      if (modulesWithProgress.length > 0) {
        setExpandedModules(new Set([modulesWithProgress[0].id]));

        // Find first incomplete lesson or first lesson
        let firstLesson = null;
        let firstModule = null;

        for (const module of modulesWithProgress) {
          const incompleteLesson = module.lessons.find((l: Lesson) => l.status !== 'completed');
          if (incompleteLesson) {
            firstLesson = incompleteLesson;
            firstModule = module;
            break;
          }
        }

        if (!firstLesson && modulesWithProgress[0].lessons.length > 0) {
          firstLesson = modulesWithProgress[0].lessons[0];
          firstModule = modulesWithProgress[0];
        }

        if (firstLesson && firstModule) {
          setCurrentLesson(firstLesson);
          setCurrentModule(firstModule);
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      alert('Gagal memuat data kursus');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (progressPercentage: number, lastPosition: number) => {
    if (!enrollmentId || !currentLesson) return;

    try {
      await enrollmentApi.updateLessonProgress(enrollmentId, currentLesson.id, {
        progress_percentage: Math.round(progressPercentage),
        last_position: Math.round(lastPosition),
      });
      setLastSavedProgress(progressPercentage);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleCompleteLesson = async () => {
    if (!enrollmentId || !currentLesson || completing) return;

    setCompleting(true);
    try {
      await enrollmentApi.completeLesson(enrollmentId, currentLesson.id);

      // Update lesson status locally
      setModules(prevModules =>
        prevModules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.id === currentLesson.id
              ? { ...lesson, status: 'completed' as const, progress_percentage: 100 }
              : lesson
          ),
          completed_lessons:
            module.id === currentModule?.id
              ? (module.completed_lessons || 0) + 1
              : module.completed_lessons,
        }))
      );

      // Move to next lesson
      handleNextLesson();
    } catch (error: any) {
      console.error('Error completing lesson:', error);
      alert(error.response?.data?.message || 'Gagal menyelesaikan lesson');
    } finally {
      setCompleting(false);
    }
  };

  const handleLessonClick = (lesson: Lesson, module: Module) => {
    setCurrentLesson(lesson);
    setCurrentModule(module);
    setVideoProgress(lesson.progress_percentage || 0);
  };

  const handleNextLesson = () => {
    if (!currentModule || !currentLesson) return;

    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);

    // Try next lesson in current module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      const nextLesson = currentModule.lessons[currentLessonIndex + 1];
      setCurrentLesson(nextLesson);
      return;
    }

    // Try first lesson of next module
    const currentModuleIndex = modules.findIndex(m => m.id === currentModule.id);
    if (currentModuleIndex < modules.length - 1) {
      const nextModule = modules[currentModuleIndex + 1];
      if (nextModule.lessons.length > 0) {
        setCurrentModule(nextModule);
        setCurrentLesson(nextModule.lessons[0]);
        setExpandedModules(prev => new Set([...prev, nextModule.id]));
      }
    }
  };

  const handlePreviousLesson = () => {
    if (!currentModule || !currentLesson) return;

    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);

    // Try previous lesson in current module
    if (currentLessonIndex > 0) {
      const prevLesson = currentModule.lessons[currentLessonIndex - 1];
      setCurrentLesson(prevLesson);
      return;
    }

    // Try last lesson of previous module
    const currentModuleIndex = modules.findIndex(m => m.id === currentModule.id);
    if (currentModuleIndex > 0) {
      const prevModule = modules[currentModuleIndex - 1];
      if (prevModule.lessons.length > 0) {
        setCurrentModule(prevModule);
        setCurrentLesson(prevModule.lessons[prevModule.lessons.length - 1]);
        setExpandedModules(prev => new Set([...prev, prevModule.id]));
      }
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

  const getLessonIcon = (lesson: Lesson) => {
    switch (lesson.type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <ClipboardList className="w-4 h-4" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getLessonStatusIcon = (lesson: Lesson) => {
    if (lesson.status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (lesson.status === 'in_progress') {
      return <Play className="w-4 h-4 text-blue-600" />;
    } else if (!lesson.is_preview && lesson.status === 'not_started') {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }
    return <Circle className="w-4 h-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all z-30 ${
          sidebarOpen ? 'w-80' : 'w-0 lg:w-16'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {sidebarOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-gray-900 truncate">{courseName}</h2>
                  <p className="text-xs text-gray-600 mt-1">
                    {modules.reduce((sum, m) => sum + (m.completed_lessons || 0), 0)} /{' '}
                    {modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Modules List */}
          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto">
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">
                          Module {moduleIndex + 1}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mt-1">{module.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {module.completed_lessons || 0}/{module.lessons.length} lessons
                      </p>
                    </div>
                    {expandedModules.has(module.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Lessons */}
                  {expandedModules.has(module.id) && (
                    <div className="bg-gray-50">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson, module)}
                          className={`w-full p-3 pl-6 flex items-center gap-3 hover:bg-gray-100 transition-colors ${
                            currentLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                          }`}
                        >
                          {getLessonStatusIcon(lesson)}
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-sm text-gray-900 truncate">{lesson.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {getLessonIcon(lesson)}
                              {lesson.duration_minutes && (
                                <span className="text-xs text-gray-600">
                                  {lesson.duration_minutes} min
                                </span>
                              )}
                            </div>
                          </div>
                          {lesson.status === 'in_progress' && (
                            <div className="w-12 text-xs text-blue-600 font-medium">
                              {lesson.progress_percentage}%
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Back Button */}
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => router.push('/dashboard/siswa/courses')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Kursus
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900">{currentLesson?.title || 'Select a lesson'}</h1>
              {currentModule && (
                <p className="text-sm text-gray-600">{currentModule.title}</p>
              )}
            </div>
          </div>

          {currentLesson && currentLesson.status !== 'completed' && (
            <button
              onClick={handleCompleteLesson}
              disabled={completing}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {completing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyelesaikan...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Tandai Selesai
                </>
              )}
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-5xl mx-auto p-6">
              {/* Video Player */}
              {currentLesson.type === 'video' && currentLesson.content_url && (
                <div className="bg-black rounded-lg overflow-hidden mb-6">
                  <video
                    ref={videoRef}
                    src={currentLesson.content_url}
                    controls
                    className="w-full aspect-video"
                    controlsList="nodownload"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Text Content */}
              {currentLesson.type === 'text' && (
                <div className="bg-white rounded-lg border border-gray-200 p-8 prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.description || '' }} />
                </div>
              )}

              {/* Lesson Description */}
              {currentLesson.description && currentLesson.type !== 'text' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Tentang Lesson Ini</h3>
                  <p className="text-gray-700 leading-relaxed">{currentLesson.description}</p>
                </div>
              )}

              {/* Progress Indicator */}
              {currentLesson.type === 'video' && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress Anda</span>
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round(videoProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Pilih lesson dari sidebar untuk mulai belajar</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        {currentLesson && (
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <button
                onClick={handlePreviousLesson}
                disabled={
                  currentModule?.id === modules[0]?.id &&
                  currentLesson?.id === modules[0]?.lessons[0]?.id
                }
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Lesson Sebelumnya
              </button>

              <button
                onClick={handleNextLesson}
                disabled={
                  currentModule?.id === modules[modules.length - 1]?.id &&
                  currentLesson?.id ===
                    modules[modules.length - 1]?.lessons[
                      modules[modules.length - 1]?.lessons.length - 1
                    ]?.id
                }
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lesson Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
