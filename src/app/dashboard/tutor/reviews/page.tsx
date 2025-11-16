'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { courseApi } from '@/lib/api/course';
import { reviewApi, Review, ReviewStatistics } from '@/lib/api/review';
import {
  Star,
  MessageSquare,
  TrendingUp,
  Award,
  Filter,
  ChevronDown,
  Search,
  Loader2,
  CheckCircle,
  Calendar,
  ThumbsUp,
  Eye,
  BarChart3
} from 'lucide-react';

interface CourseReviews {
  course_id: string;
  course_title: string;
  reviews: Review[];
  statistics: ReviewStatistics;
}

export default function TutorReviewsPage() {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [courseReviews, setCourseReviews] = useState<CourseReviews[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [overallStats, setOverallStats] = useState<ReviewStatistics>({
    total_reviews: 0,
    average_rating: 0,
    rating_distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    rating_percentages: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    with_comment: 0,
    verified_purchases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'rating' | 'helpful'>('created_at');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allReviews, searchQuery, selectedCourse, selectedRating, sortBy, showVerifiedOnly]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Fetch tutor's courses
      const coursesResponse = await courseApi.getTutorCourses();
      const courses = coursesResponse.data || [];

      const reviewsData: CourseReviews[] = [];
      const allReviewsArray: Review[] = [];

      // Fetch reviews for each course
      for (const course of courses) {
        try {
          const reviewsResponse = await reviewApi.getReviews('course', course.id, {
            per_page: 100,
            sort_by: 'created_at',
            sort_order: 'DESC',
          });

          const courseReviewData: CourseReviews = {
            course_id: course.id,
            course_title: course.title,
            reviews: reviewsResponse.data.reviews,
            statistics: reviewsResponse.data.statistics,
          };

          reviewsData.push(courseReviewData);
          allReviewsArray.push(
            ...reviewsResponse.data.reviews.map(review => ({
              ...review,
              course_title: course.title,
            } as any))
          );
        } catch (err) {
          console.error(`Error fetching reviews for course ${course.id}:`, err);
        }
      }

      setCourseReviews(reviewsData);
      setAllReviews(allReviewsArray);

      // Calculate overall statistics
      calculateOverallStats(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallStats = (data: CourseReviews[]) => {
    let totalReviews = 0;
    let totalRating = 0;
    let withComment = 0;
    let verifiedPurchases = 0;
    const distribution: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };

    data.forEach(courseData => {
      courseData.reviews.forEach(review => {
        totalReviews++;
        totalRating += review.rating;
        if (review.comment) withComment++;
        if (review.is_verified_purchase) verifiedPurchases++;
        distribution[review.rating.toString()]++;
      });
    });

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    const percentages: Record<string, number> = {};

    Object.keys(distribution).forEach(key => {
      percentages[key] = totalReviews > 0 ? (distribution[key] / totalReviews) * 100 : 0;
    });

    setOverallStats({
      total_reviews: totalReviews,
      average_rating: averageRating,
      rating_distribution: distribution as any,
      rating_percentages: percentages as any,
      with_comment: withComment,
      verified_purchases: verifiedPurchases,
    });
  };

  const applyFilters = () => {
    let filtered = [...allReviews];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        review =>
          review.student_name.toLowerCase().includes(query) ||
          review.comment?.toLowerCase().includes(query) ||
          review.title?.toLowerCase().includes(query)
      );
    }

    // Course filter
    if (selectedCourse !== 'all') {
      filtered = filtered.filter((review: any) => review.course_title === selectedCourse);
    }

    // Rating filter
    if (selectedRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(selectedRating));
    }

    // Verified only
    if (showVerifiedOnly) {
      filtered = filtered.filter(review => review.is_verified_purchase === 1);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpful_count - a.helpful_count;
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredReviews(filtered);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${sizes[size]} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
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

  const getUniqueCourseTitles = () => {
    const titles = new Set<string>();
    allReviews.forEach((review: any) => {
      if (review.course_title) titles.add(review.course_title);
    });
    return Array.from(titles);
  };

  return (
    <DashboardLayout userRole="tutor">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h1>
          <p className="text-gray-600 mt-1">
            Lihat dan kelola semua review dari siswa Anda
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm opacity-90">Average Rating</p>
            <p className="text-4xl font-bold mt-2">
              {loading ? '...' : overallStats.average_rating.toFixed(1)}
            </p>
            <div className="mt-2">{renderStars(Math.round(overallStats.average_rating), 'sm')}</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : overallStats.total_reviews}
                </p>
                <p className="text-xs text-gray-500 mt-1">All courses</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Comments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : overallStats.with_comment}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {overallStats.total_reviews > 0
                    ? `${((overallStats.with_comment / overallStats.total_reviews) * 100).toFixed(0)}%`
                    : '0%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified Purchase</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : overallStats.verified_purchases}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {overallStats.total_reviews > 0
                    ? `${((overallStats.verified_purchases / overallStats.total_reviews) * 100).toFixed(0)}%`
                    : '0%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Rating Distribution</h2>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full transition-all"
                      style={{ width: `${overallStats.rating_percentages[rating.toString()] || 0}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm text-gray-600">
                    {overallStats.rating_distribution[rating.toString()] || 0}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({(overallStats.rating_percentages[rating.toString()] || 0).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari review..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Course Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Semua Kursus</option>
                {getUniqueCourseTitles().map(title => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <select
                value={selectedRating}
                onChange={e => setSelectedRating(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Semua Rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="created_at">Terbaru</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="helpful">Paling Helpful</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Verified Only Toggle */}
          <div className="mt-4 flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showVerifiedOnly}
                onChange={e => setShowVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Tampilkan hanya verified purchase</span>
            </label>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              All Reviews ({filteredReviews.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Tidak ada review ditemukan</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReviews.map(review => (
                <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {review.student_name.charAt(0).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {review.student_name}
                            </h3>
                            {review.is_verified_purchase === 1 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium">{(review as any).course_title}</span>
                            <span>•</span>
                            <span>{formatDate(review.created_at)}</span>
                          </div>
                        </div>
                        <div>{renderStars(review.rating)}</div>
                      </div>

                      {/* Title */}
                      {review.title && (
                        <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                      )}

                      {/* Comment */}
                      {review.comment && (
                        <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          onClick={() => {
                            // TODO: Implement helpful action
                            alert('Mark as helpful feature coming soon!');
                          }}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful ({review.helpful_count})</span>
                        </button>
                        <button
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          onClick={() => setSelectedReview(review)}
                        >
                          <Eye className="w-4 h-4" />
                          <span>Detail</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        {!loading && filteredReviews.length > 0 && (
          <p className="text-sm text-gray-600 text-center">
            Menampilkan {filteredReviews.length} dari {allReviews.length} reviews
          </p>
        )}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Review Detail</h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Student Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedReview.student_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 text-lg">
                      {selectedReview.student_name}
                    </h4>
                    {selectedReview.is_verified_purchase === 1 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {(selectedReview as any).course_title}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm text-gray-600">Rating</label>
                <div className="flex items-center gap-2 mt-1">
                  {renderStars(selectedReview.rating, 'lg')}
                  <span className="text-lg font-bold text-gray-900">
                    {selectedReview.rating}.0
                  </span>
                </div>
              </div>

              {/* Title */}
              {selectedReview.title && (
                <div>
                  <label className="text-sm text-gray-600">Title</label>
                  <p className="text-gray-900 font-medium mt-1">{selectedReview.title}</p>
                </div>
              )}

              {/* Comment */}
              {selectedReview.comment && (
                <div>
                  <label className="text-sm text-gray-600">Comment</label>
                  <p className="text-gray-900 leading-relaxed mt-1 whitespace-pre-wrap">
                    {selectedReview.comment}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-xs text-gray-500">Created At</label>
                  <p className="text-sm text-gray-900 font-medium">
                    {formatDate(selectedReview.created_at)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Helpful Count</label>
                  <p className="text-sm text-gray-900 font-medium">
                    {selectedReview.helpful_count} people
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedReview(null)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}