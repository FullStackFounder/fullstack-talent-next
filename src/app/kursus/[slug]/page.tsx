'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Award,
  Globe,
  PlayCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Smartphone,
  Trophy,
  Infinity,
  Share2,
  Heart,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { courseApi } from '@/lib/api/course';
import { enrollmentApi } from '@/lib/api/enrollment';
import { authApi } from '@/lib/api/auth';

interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  thumbnail_url: string;
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
  tutor_id: string;
  tutor_name: string;
  tutor_email: string;
  tutor_avatar?: string;
  tutor_bio?: string;
  category_name: string;
  requirements: string[];
  learning_outcomes: string[];
  tags: string[];
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  is_preview: boolean;
  total_lessons: number;
  total_duration: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: string;
  duration_minutes: number;
  order_index: number;
  is_preview: boolean;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    fetchCourse();
  }, [slug]);

  const checkAuth = () => {
    const user = authApi.getCurrentUser();
    setIsAuthenticated(!!user);
  };

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await courseApi.getCourse(slug);
      const courseData = response.data;
      setCourse(courseData);

      // Expand first module by default
      if (courseData.modules && courseData.modules.length > 0) {
        setExpandedModules([courseData.modules[0].id]);
      }

      // Fetch related courses
      if (courseData.category_id) {
        const relatedResponse = await courseApi.getCourses({
          category_id: courseData.category_id,
          per_page: 4,
        });
        const filtered = (relatedResponse.data || []).filter(
          (c: any) => c.id !== courseData.id
        );
        setRelatedCourses(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      router.push('/kursus');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setEnrolling(true);
    try {
      // For free courses, enroll directly
      if (course!.price === 0 || (course!.discount_price && course!.discount_price === 0)) {
        await enrollmentApi.enroll(course!.id);
        alert('Pendaftaran berhasil! Anda sekarang dapat mengakses kursus ini.');
        router.push(`/dashboard/siswa/courses/${course!.id}/learn`);
      } else {
        // For paid courses, redirect to payment
        router.push(`/payment/course/${course!.id}`);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal mendaftar kursus');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    if (expandedModules.includes(moduleId)) {
      setExpandedModules(expandedModules.filter((id) => id !== moduleId));
    } else {
      setExpandedModules([...expandedModules, moduleId]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTotalDuration = () => {
    if (!course) return 0;
    return course.modules.reduce((total, module) => total + module.total_duration, 0);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading course...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!course) {
    return null;
  }

  const finalPrice = course.discount_price || course.price;
  const isFree = finalPrice === 0;
  const hasDiscount = course.discount_price && course.discount_price < course.price;

  return (
    <>
      <Navigation />

      <main className="bg-gray-50">
        {/* Hero Section - Dark Background like Udemy */}
        <section className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/kursus" className="hover:text-white">
                Kursus
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{course.category_name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Content */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {course.title}
                </h1>

                <p className="text-xl text-gray-300 mb-6">
                  {course.short_description}
                </p>

                {/* Rating & Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-yellow-400">
                      {course.average_rating.toFixed(1)}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(course.average_rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400">
                      ({course.total_reviews} ratings)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{course.total_enrolled.toLocaleString()} siswa</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    <span>{course.language}</span>
                  </div>
                </div>

                {/* Tutor */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-gray-400">Dibuat oleh</span>
                  <img
                    src={course.tutor_avatar || '/default-avatar.png'}
                    alt={course.tutor_name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-semibold">{course.tutor_name}</span>
                </div>

                {/* Last Updated & Level */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span>Level: {course.level}</span>
                  <span>•</span>
                  <span>{course.total_lessons} lessons</span>
                  <span>•</span>
                  <span>{course.duration_hours} jam total</span>
                </div>
              </div>

              {/* Right Side - Mobile Preview */}
              <div className="lg:hidden">
                {/* Show price and CTA for mobile */}
                <div className="bg-white rounded-lg shadow-xl p-6">
                  <div className="mb-4">
                    {isFree ? (
                      <div className="text-3xl font-bold text-green-600">GRATIS</div>
                    ) : (
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          {formatPrice(finalPrice)}
                        </div>
                        {hasDiscount && (
                          <div className="text-lg text-gray-500 line-through">
                            {formatPrice(course.price)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? 'Processing...' : isFree ? 'Daftar Sekarang' : 'Beli Sekarang'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What you'll learn */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Yang akan Anda pelajari
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learning_outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Konten Kursus
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <span>{course.total_modules} bagian</span>
                  <span>•</span>
                  <span>{course.total_lessons} pelajaran</span>
                  <span>•</span>
                  <span>{Math.floor(getTotalDuration() / 60)}jam {getTotalDuration() % 60}menit total durasi</span>
                </div>

                <div className="space-y-2">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 transition-transform ${
                              expandedModules.includes(module.id) ? 'rotate-0' : '-rotate-90'
                            }`}
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {moduleIndex + 1}. {module.title}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {module.total_lessons} pelajaran • {module.total_duration} menit
                            </div>
                          </div>
                        </div>
                      </button>

                      {expandedModules.includes(module.id) && (
                        <div className="border-t border-gray-200">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-4 hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <PlayCircle className="w-5 h-5 text-gray-400" />
                                <div className="flex-1">
                                  <div className="text-gray-900">
                                    {lesson.title}
                                  </div>
                                  {lesson.is_preview && (
                                    <span className="inline-block text-xs text-blue-600 font-medium mt-1">
                                      Preview
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm text-gray-600">
                                {lesson.duration_minutes} min
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Persyaratan
                  </h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Deskripsi
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Instructor */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Instruktur
                </h2>
                <div className="flex items-start gap-4">
                  <img
                    src={course.tutor_avatar || '/default-avatar.png'}
                    alt={course.tutor_name}
                    className="w-24 h-24 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {course.tutor_name}
                    </h3>
                    {course.tutor_bio && (
                      <p className="text-gray-700 mb-4">{course.tutor_bio}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span>{course.average_rating.toFixed(1)} rating instruktur</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span>{course.total_enrolled} siswa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {course.tags && course.tags.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Course Card */}
                <div className="hidden lg:block bg-white rounded-lg shadow-xl overflow-hidden">
                  {/* Video Preview */}
                  {course.preview_video_url ? (
                    <div className="relative aspect-video bg-gray-900">
                      <video
                        src={course.preview_video_url}
                        poster={course.thumbnail_url}
                        controls
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-video">
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <PlayCircle className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Price */}
                    <div className="mb-6">
                      {isFree ? (
                        <div className="text-3xl font-bold text-green-600">GRATIS</div>
                      ) : (
                        <div>
                          <div className="text-3xl font-bold text-gray-900">
                            {formatPrice(finalPrice)}
                          </div>
                          {hasDiscount && (
                            <>
                              <div className="text-lg text-gray-500 line-through mt-1">
                                {formatPrice(course.price)}
                              </div>
                              <div className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
                                Hemat {Math.round(((course.price - course.discount_price!) / course.price) * 100)}%
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Enroll Button */}
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? 'Processing...' : isFree ? 'Daftar Sekarang' : 'Beli Sekarang'}
                    </button>

                    <p className="text-center text-sm text-gray-600 mb-6">
                      30 hari garansi uang kembali
                    </p>

                    {/* Course Includes */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-bold text-gray-900 mb-4">
                        Kursus ini termasuk:
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <PlayCircle className="w-5 h-5 text-gray-600" />
                          <span>{course.duration_hours} jam video on-demand</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-gray-600" />
                          <span>{course.total_lessons} artikel</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Download className="w-5 h-5 text-gray-600" />
                          <span>Materi yang bisa diunduh</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-gray-600" />
                          <span>Akses di mobile dan TV</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Infinity className="w-5 h-5 text-gray-600" />
                          <span>Akses selamanya</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-gray-600" />
                          <span>Sertifikat penyelesaian</span>
                        </div>
                      </div>
                    </div>

                    {/* Share */}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                          <Share2 className="w-5 h-5" />
                          Bagikan
                        </button>
                        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                          <Heart className="w-5 h-5" />
                          Simpan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Courses */}
          {relatedCourses.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Kursus Terkait
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedCourses.map((relatedCourse) => (
                  <Link
                    key={relatedCourse.id}
                    href={`/kursus/${relatedCourse.slug}`}
                    className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={relatedCourse.thumbnail_url}
                        alt={relatedCourse.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                        {relatedCourse.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        {relatedCourse.average_rating.toFixed(1)}
                        <span className="text-gray-400">
                          ({relatedCourse.total_reviews})
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {relatedCourse.price === 0
                          ? 'GRATIS'
                          : formatPrice(relatedCourse.discount_price || relatedCourse.price)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sticky Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <div className="flex items-center justify-between gap-4">
            <div>
              {isFree ? (
                <div className="text-xl font-bold text-green-600">GRATIS</div>
              ) : (
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatPrice(finalPrice)}
                  </div>
                  {hasDiscount && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(course.price)}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enrolling ? 'Processing...' : isFree ? 'Daftar Sekarang' : 'Beli Sekarang'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
