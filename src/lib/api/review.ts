import apiClient from './client';

export interface Review {
  id: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  reviewable_type: 'course' | 'class' | 'bootcamp' | 'tutor';
  reviewable_id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: number;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewStatistics {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  rating_percentages: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  with_comment: number;
  verified_purchases: number;
}

export interface GetReviewsResponse {
  reviews: Review[];
  statistics: ReviewStatistics;
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export interface GetReviewsParams {
  rating?: number;
  has_comment?: boolean;
  verified_purchase?: boolean;
  sort_by?: 'created_at' | 'helpful' | 'rating';
  sort_order?: 'ASC' | 'DESC';
  per_page?: number;
  page?: number;
}

export interface SubmitReviewRequest {
  reviewable_type: 'course' | 'class' | 'bootcamp' | 'tutor';
  reviewable_id: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface FlagReviewRequest {
  reason: 'spam' | 'inappropriate' | 'fake' | 'offensive' | 'copyright' | 'misleading' | 'harassment' | 'other';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: string;
  category?: 'content' | 'behavior' | 'legal' | 'quality' | 'other';
  evidence?: string[];
}

export const reviewApi = {
  // Get reviews for a specific item
  getReviews: async (
    type: 'course' | 'class' | 'bootcamp' | 'tutor',
    id: string,
    params?: GetReviewsParams
  ): Promise<{ success: boolean; message: string; data: GetReviewsResponse }> => {
    const queryParams = new URLSearchParams();
    if (params?.rating) queryParams.append('rating', params.rating.toString());
    if (params?.has_comment !== undefined) queryParams.append('has_comment', params.has_comment.toString());
    if (params?.verified_purchase !== undefined) queryParams.append('verified_purchase', params.verified_purchase.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const query = queryParams.toString();
    const url = `/reviews/${type}/${id}${query ? `?${query}` : ''}`;

    const response = await apiClient.get<{ success: boolean; message: string; data: GetReviewsResponse }>(url);
    return response.data;
  },

  // Get review statistics
  getStatistics: async (
    type: 'course' | 'class' | 'bootcamp' | 'tutor',
    id: string
  ): Promise<{ success: boolean; message: string; data: ReviewStatistics }> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: ReviewStatistics }>(
      `/reviews/${type}/${id}/statistics`
    );
    return response.data;
  },

  // Get my review
  getMyReview: async (
    type: 'course' | 'class' | 'bootcamp' | 'tutor',
    id: string
  ): Promise<{ success: boolean; message: string; data: Review }> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: Review }>(
      `/reviews/my/${type}/${id}`
    );
    return response.data;
  },

  // Submit review
  submitReview: async (
    data: SubmitReviewRequest
  ): Promise<{ success: boolean; message: string; data: { review_id: string; review: Review } }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: { review_id: string; review: Review } }>(
      '/reviews',
      data
    );
    return response.data;
  },

  // Update review
  updateReview: async (
    id: string,
    data: { rating?: number; title?: string; comment?: string }
  ): Promise<{ success: boolean; message: string; data: { review: Review } }> => {
    const response = await apiClient.put<{ success: boolean; message: string; data: { review: Review } }>(
      `/reviews/${id}`,
      data
    );
    return response.data;
  },

  // Delete review
  deleteReview: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/reviews/${id}`);
    return response.data;
  },

  // Flag review
  flagReview: async (
    id: string,
    data: FlagReviewRequest
  ): Promise<{ success: boolean; message: string; data: { flag_id: string; flag_count: number; auto_hidden: boolean } }> => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: { flag_id: string; flag_count: number; auto_hidden: boolean };
    }>(`/reviews/${id}/flag`, data);
    return response.data;
  },

  // Mark review as helpful
  markHelpful: async (id: string): Promise<{ success: boolean; message: string; data: { helpful_count: number } }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: { helpful_count: number } }>(
      `/reviews/${id}/helpful`
    );
    return response.data;
  },
};