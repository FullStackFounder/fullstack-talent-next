import apiClient from './client';

export interface Course {
  id: string;
  tutor_id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  thumbnail_url: string | null;
  preview_video_url?: string | null;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  price: number;
  discount_price?: number | null;
  duration_hours?: number;
  is_featured: boolean;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published' | 'archived';
  total_enrolled: number;
  total_reviews: number;
  average_rating: number;
  total_modules: number;
  total_lessons: number;
  tutor_name?: string;
  tutor_email?: string;
  tutor_avatar?: string | null;
  tutor_bio?: string;
  requirements?: string[];
  learning_outcomes?: string[];
  tags?: string[];
  created_at: string;
  published_at?: string | null;
}

export interface CourseStats {
  total_courses: number;
  total_students: number;
  total_revenue: number;
  total_reviews: number;
  average_rating: number;
  draft_courses: number;
  published_courses: number;
  archived_courses: number;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  short_description?: string;
  price: number;
  discount_price?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  category_id?: string;
  thumbnail_url?: string;
  preview_video_url?: string;
  requirements?: string[];
  learning_outcomes?: string[];
  tags?: string[];
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  short_description?: string;
  price?: number;
  discount_price?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  category_id?: string;
  thumbnail_url?: string;
  requirements?: string[];
  learning_outcomes?: string[];
  tags?: string[];
}

export interface GetCoursesParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  min_price?: number;
  max_price?: number;
  is_free?: boolean;
  is_featured?: boolean;
  sort_by?: 'created_at' | 'price' | 'title' | 'average_rating' | 'total_enrolled';
  sort_order?: 'ASC' | 'DESC';
  my_courses?: boolean;
  status?: string;
}

export interface CoursesResponse {
  status: boolean;
  message: string;
  data: Course[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_more: boolean;
  };
  timestamp: string;
}

export interface CourseResponse {
  status: boolean;
  message: string;
  data: Course;
  timestamp: string;
}

export interface DeleteCourseResponse {
  status: boolean;
  message: string;
  data: {
    deleted_at: string;
  };
  timestamp: string;
}

export interface PublishCourseResponse {
  status: boolean;
  message: string;
  data: {
    published_at: string;
  };
  timestamp: string;
}

export const courseApi = {
  // Get all courses (with filters and pagination)
  getCourses: async (params?: GetCoursesParams): Promise<CoursesResponse> => {
    const response = await apiClient.get<CoursesResponse>('/courses', { params });
    return response.data;
  },

  // Get tutor's courses (using my_courses=true parameter)
  getMyCourses: async (params?: Omit<GetCoursesParams, 'my_courses'>): Promise<CoursesResponse> => {
    const response = await apiClient.get<CoursesResponse>('/courses', {
      params: { ...params, my_courses: true },
    });
    return response.data;
  },

  // Get featured courses
  getFeaturedCourses: async (limit: number = 6): Promise<CoursesResponse> => {
    const response = await apiClient.get<CoursesResponse>('/courses/featured', {
      params: { limit },
    });
    return response.data;
  },

  // Search courses
  searchCourses: async (query: string, limit: number = 20): Promise<CoursesResponse> => {
    const response = await apiClient.get<CoursesResponse>('/courses/search', {
      params: { q: query, limit },
    });
    return response.data;
  },

  // Get course by ID or slug
  getCourseById: async (idOrSlug: string): Promise<CourseResponse> => {
    const response = await apiClient.get<CourseResponse>(`/courses/${idOrSlug}`);
    return response.data;
  },

  // Create new course
  createCourse: async (data: CreateCourseRequest): Promise<CourseResponse> => {
    const response = await apiClient.post<CourseResponse>('/courses', data);
    return response.data;
  },

  // Update course
  updateCourse: async (id: string, data: UpdateCourseRequest): Promise<CourseResponse> => {
    const response = await apiClient.put<CourseResponse>(`/courses/${id}`, data);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id: string): Promise<DeleteCourseResponse> => {
    const response = await apiClient.delete<DeleteCourseResponse>(`/courses/${id}`);
    return response.data;
  },

  // Publish course
  publishCourse: async (id: string): Promise<PublishCourseResponse> => {
    const response = await apiClient.post<PublishCourseResponse>(`/courses/${id}/publish`);
    return response.data;
  },
};
