import apiClient from './client';

// ============================================
// INTERFACES - Updated to match ENROLLMENT_API.md
// ============================================

export interface Enrollment {
  id: string;
  student_id: string;
  enrollable_type: 'course';
  enrollable_id: string;
  payment_id: string | null;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'expired';
  progress_percentage: number;
  started_at: string;
  completed_at: string | null;
  // Additional fields from join
  course_title?: string;
  course_slug?: string;
  thumbnail_url?: string | null;
  level?: string;
  duration_hours?: number;
  total_modules?: number;
  total_lessons?: number;
  average_rating?: number;
  tutor_name?: string;
  tutor_avatar?: string | null;
  tutor_email?: string;
  category_name?: string;
  description?: string;
  created_at: string;
}

export interface ProgressStats {
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

export interface NextLesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration_minutes: number | null;
  content_url?: string | null;
  module_title: string;
}

export interface LastAccessedLesson {
  lesson_id: string;
  lesson_title: string;
  module_title: string;
  status: string;
  updated_at: string;
}

export interface LessonProgressDetail {
  lesson_id: string;
  lesson_title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration_minutes: number | null;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  completed_at: string | null;
}

export interface ModuleProgressDetail {
  module_id: string;
  module_title: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
  lessons: LessonProgressDetail[];
}

export interface EnrollmentProgressDetail {
  enrollment: Enrollment;
  statistics: ProgressStats;
  module_progress: ModuleProgressDetail[];
  next_lesson: NextLesson | null;
  last_accessed_lesson: LastAccessedLesson | null;
}

export interface DashboardData {
  active_courses: number;
  completed_courses: number;
  total_time_spent_hours: number;
  current_streak_days: number;
  recent_enrollments: Array<{
    id: string;
    course_title: string;
    thumbnail_url: string | null;
    progress_percentage: number;
    status: string;
  }>;
  learning_activity_7days: Array<{
    date: string;
    lessons_completed: number;
    minutes_spent: number;
  }>;
}

export interface Certificate {
  certificate_url: string;
}

export interface LessonProgressUpdate {
  id: string;
  lesson_id: string;
  lesson_title: string;
  status: string;
  progress_percentage: number;
  last_position: number | null;
}

export interface EnrollmentStats {
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
  time_spent_hours?: number;
}

// ============================================
// REQUEST/RESPONSE TYPES
// ============================================

export interface EnrollToCourseRequest {
  course_id: string;
  payment_id?: string;
}

export interface UpdateProgressRequest {
  progress_percentage: number;
  last_position?: number;
}

export interface EnrollmentsResponse {
  status: boolean;
  message: string;
  data: Enrollment[];
  timestamp: string;
}

export interface EnrollmentResponse {
  status: boolean;
  message: string;
  data: Enrollment;
  timestamp: string;
}

export interface ProgressDetailResponse {
  status: boolean;
  message: string;
  data: EnrollmentProgressDetail;
  timestamp: string;
}

export interface DashboardResponse {
  status: boolean;
  message: string;
  data: DashboardData;
  timestamp: string;
}

export interface ContinueLearningResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    course_title: string;
    course_slug: string;
    thumbnail_url: string | null;
    progress_percentage: number;
    lesson_id: string;
    last_position: number | null;
  };
  timestamp: string;
}

export interface StartLessonResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    enrollment_id: string;
    lesson_id: string;
    lesson_title: string;
    lesson_description: string | null;
    type: string;
    content_url: string | null;
    duration_minutes: number | null;
    status: string;
    progress_percentage: number;
    module_title: string;
    created_at: string;
  };
  timestamp: string;
}

export interface UpdateProgressResponse {
  status: boolean;
  message: string;
  data: {
    lesson_progress: LessonProgressUpdate;
    enrollment_stats: EnrollmentStats;
  };
  timestamp: string;
}

export interface CompleteLessonResponse {
  status: boolean;
  message: string;
  data: {
    enrollment_stats: EnrollmentStats;
    next_lesson: NextLesson | null;
  };
  timestamp: string;
}

export interface CertificateResponse {
  status: boolean;
  message: string;
  data: Certificate;
  timestamp: string;
}

export interface RecommendationsResponse {
  status: boolean;
  message: string;
  data: Array<{
    id: string;
    title: string;
    slug: string;
    thumbnail_url: string | null;
    price: number;
    level: string;
    average_rating: number;
    total_enrolled: number;
    tutor_name: string;
    category_name: string;
  }>;
  timestamp: string;
}

// ============================================
// API METHODS
// ============================================

export const enrollmentApi = {
  // ============================================
  // STUDENT-SIDE ENDPOINTS
  // ============================================

  // Enroll to a course
  enrollToCourse: async (data: EnrollToCourseRequest): Promise<EnrollmentResponse> => {
    const response = await apiClient.post<EnrollmentResponse>('/enrollments', data);
    return response.data;
  },

  // Get my enrolled courses
  getMyCourses: async (params?: { status?: string }): Promise<EnrollmentsResponse> => {
    const response = await apiClient.get<EnrollmentsResponse>('/enrollments/my-courses', { params });
    return response.data;
  },

  // Get student dashboard
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get<DashboardResponse>('/enrollments/dashboard');
    return response.data;
  },

  // Continue learning - get most recent course and lesson
  continueLearning: async (): Promise<ContinueLearningResponse> => {
    const response = await apiClient.get<ContinueLearningResponse>('/enrollments/continue-learning');
    return response.data;
  },

  // Get enrollment progress detail
  getEnrollmentProgress: async (enrollmentId: string): Promise<ProgressDetailResponse> => {
    const response = await apiClient.get<ProgressDetailResponse>(`/enrollments/${enrollmentId}/progress`);
    return response.data;
  },

  // Start a lesson
  startLesson: async (enrollmentId: string, lessonId: string): Promise<StartLessonResponse> => {
    const response = await apiClient.post<StartLessonResponse>(
      `/enrollments/${enrollmentId}/lessons/${lessonId}/start`
    );
    return response.data;
  },

  // Update lesson progress (NOTE: PUT method, not POST)
  updateLessonProgress: async (
    enrollmentId: string,
    lessonId: string,
    data: UpdateProgressRequest
  ): Promise<UpdateProgressResponse> => {
    const response = await apiClient.put<UpdateProgressResponse>(
      `/enrollments/${enrollmentId}/lessons/${lessonId}/progress`,
      data
    );
    return response.data;
  },

  // Complete a lesson
  completeLesson: async (enrollmentId: string, lessonId: string): Promise<CompleteLessonResponse> => {
    const response = await apiClient.post<CompleteLessonResponse>(
      `/enrollments/${enrollmentId}/lessons/${lessonId}/complete`
    );
    return response.data;
  },

  // Get certificate for completed course
  getCertificate: async (enrollmentId: string): Promise<CertificateResponse> => {
    const response = await apiClient.get<CertificateResponse>(`/enrollments/${enrollmentId}/certificate`);
    return response.data;
  },

  // Get recommended courses
  getRecommendations: async (limit: number = 5): Promise<RecommendationsResponse> => {
    const response = await apiClient.get<RecommendationsResponse>('/enrollments/recommendations', {
      params: { limit },
    });
    return response.data;
  },

  // ============================================
  // TUTOR-SIDE ENDPOINTS
  // ============================================

  // Get all enrollments for a course (tutor view)
  getCourseEnrollments: async (
    courseId: string,
    params?: {
      page?: number;
      per_page?: number;
      status?: string;
    }
  ): Promise<{
    status: boolean;
    message: string;
    data: Enrollment[];
    meta?: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
      has_more: boolean;
    };
    timestamp: string;
  }> => {
    const response = await apiClient.get(`/courses/${courseId}/enrollments`, { params });
    return response.data;
  },

  // Get single enrollment by ID
  getEnrollmentById: async (enrollmentId: string): Promise<EnrollmentResponse> => {
    const response = await apiClient.get<EnrollmentResponse>(`/enrollments/${enrollmentId}`);
    return response.data;
  },
};
