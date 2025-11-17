'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Search,
  Filter,
  Star,
  Users,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  ChevronDown,
  X,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { courseApi } from '@/lib/api/course';
import { authApi } from '@/lib/api/auth';

interface Course {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  thumbnail_url: string;
  price: number;
  discount_price?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  duration_hours: number;
  total_modules: number;
  total_lessons: number;
  total_enrolled: number;
  average_rating: number;
  total_reviews: number;
  is_featured: boolean;
  tutor_name: string;
  tutor_avatar?: string;
  category_name: string;
  tags?: string[];
}

export default function KursusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    is_free: searchParams.get('is_free') === 'true',
    is_featured: searchParams.get('is_featured') === 'true',
    sort_by: searchParams.get('sort_by') || 'created_at',
    page: Number(searchParams.get('page')) || 1,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0,
    has_more: false,
  });

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    fetchCourses();
  }, [filters]);

  const checkAuth = () => {
    const user = authApi.getCurrentUser();
    setIsAuthenticated(!!user);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await courseApi.getCourses({
        page: filters.page,
        per_page: pagination.per_page,
        search: filters.search || undefined,
        category_id: filters.category_id || undefined,
        level: filters.level as any,
        min_price: filters.min_price ? Number(filters.min_price) : undefined,
        max_price: filters.max_price ? Number(filters.max_price) : undefined,
        is_free: filters.is_free || undefined,
        is_featured: filters.is_featured || undefined,
        sort_by: filters.sort_by as any,
        sort_order: 'DESC',
      });

      setCourses(response.data || []);
      if (response.meta) {
        setPagination(response.meta);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: filters.search, page: 1 });
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value && value !== '' && value !== false) {
        params.set(key, value.toString());
      }
    });

    router.push(`/kursus?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category_id: '',
      level: '',
      min_price: '',
      max_price: '',
      is_free: false,
      is_featured: false,
      sort_by: 'created_at',
      page: 1,
    });
    router.push('/kursus');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getLevelBadge = (level: string) => {
    const styles = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };

    const labels = {
      beginner: 'Pemula',
      intermediate: 'Menengah',
      advanced: 'Lanjutan',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[level as keyof typeof styles]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  const hasActiveFilters = () => {
    return filters.search || filters.category_id || filters.level || filters.min_price || filters.max_price || filters.is_free || filters.is_featured;
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <GraduationCap className="w-12 h-12" />
                <h1 className="text-4xl md:text-5xl font-bold">
                  Kursus Bersertifikat
                </h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Tingkatkan skill programming Anda dengan kursus berkualitas dan dapatkan sertifikat profesional
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Cari kursus..."
                    className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Cari
                  </button>
                </div>
              </form>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold">{pagination.total}+</div>
                  <div className="text-blue-100 text-sm mt-1">Kursus Tersedia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">100+</div>
                  <div className="text-blue-100 text-sm mt-1">Expert Tutor</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-blue-100 text-sm mt-1">Siswa Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">4.8</div>
                  <div className="text-blue-100 text-sm mt-1">Rating Rata-rata</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-5 h-5" />
                  Filter
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <select
                  value={filters.level}
                  onChange={(e) => updateFilters({ level: e.target.value, page: 1 })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Level</option>
                  <option value="beginner">Pemula</option>
                  <option value="intermediate">Menengah</option>
                  <option value="advanced">Lanjutan</option>
                </select>

                <select
                  value={filters.sort_by}
                  onChange={(e) => updateFilters({ sort_by: e.target.value, page: 1 })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="created_at">Terbaru</option>
                  <option value="total_enrolled">Paling Populer</option>
                  <option value="average_rating">Rating Tertinggi</option>
                  <option value="price">Harga Terendah</option>
                </select>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.is_free}
                    onChange={(e) => updateFilters({ is_free: e.target.checked, page: 1 })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Kursus Gratis</span>
                </label>
              </div>

              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                  Reset Filter
                </button>
              )}
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Minimum
                  </label>
                  <input
                    type="number"
                    value={filters.min_price}
                    onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                    placeholder="Rp 0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Maksimum
                  </label>
                  <input
                    type="number"
                    value={filters.max_price}
                    onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                    placeholder="Rp 10.000.000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => updateFilters({ min_price: filters.min_price, max_price: filters.max_price, page: 1 })}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Terapkan Filter Harga
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak ada kursus ditemukan
              </h3>
              <p className="text-gray-600 mb-6">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/kursus/${course.slug}`}
                    className="group bg-white rounded-lg shadow hover:shadow-xl transition-all overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.thumbnail_url || '/default-course.jpg'}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {course.is_featured && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        {getLevelBadge(course.level)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category */}
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
                        {course.category_name}
                      </span>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.short_description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          {course.average_rating.toFixed(1)} ({course.total_reviews})
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.total_enrolled}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.total_lessons} lessons
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration_hours}h
                        </div>
                      </div>

                      {/* Tutor & Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={course.tutor_avatar || '/default-avatar.png'}
                            alt={course.tutor_name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm text-gray-700">{course.tutor_name}</span>
                        </div>
                        <div className="text-right">
                          {course.discount_price ? (
                            <>
                              <div className="text-xs text-gray-500 line-through">
                                {formatPrice(course.price)}
                              </div>
                              <div className="text-lg font-bold text-blue-600">
                                {formatPrice(course.discount_price)}
                              </div>
                            </>
                          ) : course.price === 0 ? (
                            <div className="text-lg font-bold text-green-600">GRATIS</div>
                          ) : (
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrice(course.price)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => updateFilters({ page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(pagination.total_pages, 5) }, (_, i) => {
                      let pageNum;
                      if (pagination.total_pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.total_pages - 2) {
                        pageNum = pagination.total_pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => updateFilters({ page: pageNum })}
                          className={`px-4 py-2 rounded-lg ${
                            pageNum === pagination.page
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
                    onClick={() => updateFilters({ page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.total_pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <Award className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                Siap Tingkatkan Skill Anda?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Daftar sekarang dan dapatkan akses ke ribuan kursus berkualitas
              </p>
              <Link
                href="/auth/register"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Daftar Gratis Sekarang
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
