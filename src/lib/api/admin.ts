import apiClient from './client';

// User Management Types
export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'siswa' | 'tutor' | 'admin';
  avatar_url?: string;
  bio?: string;
  is_verified: boolean;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  last_login?: string;

  // Additional stats
  total_courses?: number;
  total_enrolled?: number;
  total_revenue?: number;
}

export interface UserFilters {
  role?: 'siswa' | 'tutor' | 'admin' | 'all';
  status?: 'active' | 'inactive' | 'suspended' | 'all';
  is_verified?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: 'created_at' | 'name' | 'email' | 'last_login';
  sort_order?: 'asc' | 'desc';
}

export interface UserListResponse {
  users: AdminUser[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface UserDetailResponse {
  user: AdminUser;
  profile: any;
  statistics: {
    total_courses?: number;
    completed_courses?: number;
    total_students?: number;
    total_revenue?: number;
    average_rating?: number;
    total_enrollments?: number;
  };
  recent_activity: Array<{
    id: string;
    type: string;
    description: string;
    created_at: string;
  }>;
}

export interface UpdateUserRequest {
  full_name?: string;
  phone?: string;
  role?: 'siswa' | 'tutor' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
  is_verified?: boolean;
}

export interface DashboardStats {
  total_users: number;
  total_students: number;
  total_tutors: number;
  total_admins: number;
  active_users: number;
  new_users_this_month: number;
  verified_users: number;
  suspended_users: number;
  total_courses: number;
  total_enrollments: number;
  total_revenue: number;
  revenue_this_month: number;
}

// Course Management Types
export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  tutor_id: string;
  tutor_name: string;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  price: number;
  discount_price?: number;
  total_enrolled: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface CourseFilters {
  status?: 'draft' | 'pending' | 'published' | 'rejected' | 'all';
  tutor_id?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export const adminApi = {
  // ==================== User Management ====================

  /**
   * Get all users with filters
   */
  getUsers: async (filters?: UserFilters): Promise<{ status: string; data: UserListResponse }> => {
    const params = new URLSearchParams();

    if (filters?.role && filters.role !== 'all') params.append('role', filters.role);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.is_verified !== undefined) params.append('is_verified', String(filters.is_verified));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.per_page) params.append('per_page', String(filters.per_page));
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);

    const response = await apiClient.get<{ status: string; data: UserListResponse }>(
      `/admin/users?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get user detail by ID
   */
  getUserDetail: async (userId: string): Promise<{ status: string; data: UserDetailResponse }> => {
    const response = await apiClient.get<{ status: string; data: UserDetailResponse }>(
      `/admin/users/${userId}`
    );
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (
    userId: string,
    data: UpdateUserRequest
  ): Promise<{ status: string; message: string; data: AdminUser }> => {
    const response = await apiClient.put<{ status: string; message: string; data: AdminUser }>(
      `/admin/users/${userId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (userId: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete<{ status: string; message: string }>(
      `/admin/users/${userId}`
    );
    return response.data;
  },

  /**
   * Verify user
   */
  verifyUser: async (userId: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(
      `/admin/users/${userId}/verify`
    );
    return response.data;
  },

  /**
   * Suspend user
   */
  suspendUser: async (
    userId: string,
    reason?: string
  ): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(
      `/admin/users/${userId}/suspend`,
      { reason }
    );
    return response.data;
  },

  /**
   * Activate user
   */
  activateUser: async (userId: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(
      `/admin/users/${userId}/activate`
    );
    return response.data;
  },

  /**
   * Verify tutor's bank account
   */
  verifyTutorBank: async (tutorId: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(
      `/admin/tutors/${tutorId}/verify-bank`
    );
    return response.data;
  },

  // ==================== Dashboard & Statistics ====================

  /**
   * Get admin dashboard statistics
   */
  getDashboardStats: async (): Promise<{ status: string; data: DashboardStats }> => {
    const response = await apiClient.get<{ status: string; data: DashboardStats }>(
      '/admin/dashboard'
    );
    return response.data;
  },

  /**
   * Get user statistics
   */
  getUserStats: async (): Promise<{ status: string; data: any }> => {
    const response = await apiClient.get<{ status: string; data: any }>(
      '/admin/statistics/users'
    );
    return response.data;
  },

  // ==================== Course Management ====================

  /**
   * Get all courses with filters
   */
  getCourses: async (filters?: CourseFilters): Promise<{ status: string; data: any }> => {
    const params = new URLSearchParams();

    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.tutor_id) params.append('tutor_id', filters.tutor_id);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.per_page) params.append('per_page', String(filters.per_page));

    const response = await apiClient.get<{ status: string; data: any }>(
      `/admin/courses?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Approve course
   */
  approveCourse: async (courseId: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(
      `/admin/courses/${courseId}/approve`
    );
    return response.data;
  },

  /**
   * Reject course
   */
  rejectCourse: async (
    courseId: string,
    reason: string
  ): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(
      `/admin/courses/${courseId}/reject`,
      { reason }
    );
    return response.data;
  },

  /**
   * Delete course
   */
  deleteCourse: async (courseId: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete<{ status: string; message: string }>(
      `/admin/courses/${courseId}`
    );
    return response.data;
  },

  // ==================== Payment Management ====================

  /**
   * Get all transactions
   */
  getTransactions: async (filters?: any): Promise<{ status: string; data: any }> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', String(filters.page));

    const response = await apiClient.get<{ status: string; data: any }>(
      `/admin/transactions?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get withdrawal requests
   */
  getWithdrawals: async (filters?: any): Promise<{ status: string; data: any }> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', String(filters.page));

    const response = await apiClient.get<{ status: string; data: any }>(
      `/admin/withdrawals?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Approve withdrawal
   */
  approveWithdrawal: async (withdrawalId: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(
      `/admin/withdrawals/${withdrawalId}/approve`
    );
    return response.data;
  },

  /**
   * Reject withdrawal
   */
  rejectWithdrawal: async (
    withdrawalId: string,
    reason: string
  ): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(
      `/admin/withdrawals/${withdrawalId}/reject`,
      { reason }
    );
    return response.data;
  },
};
