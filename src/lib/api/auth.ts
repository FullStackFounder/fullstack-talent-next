import apiClient, { tokenManager, userStorage } from './client';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/auth';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    
    // Store tokens and user data
    if (response.data.status && response.data.data) {
      const { access_token, refresh_token, user } = response.data.data;
      tokenManager.setTokens(access_token, refresh_token);
      userStorage.setUser(user);
    }
    
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Clear tokens and user data regardless of API response
      tokenManager.clearTokens();
      userStorage.clearUser();
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>('/auth/profile');
    
    // Update user data in storage
    if (response.data.status && response.data.data) {
      userStorage.setUser(response.data.data.user);
    }
    
    return response.data;
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<any> => {
    const response = await apiClient.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  /**
   * Resend email verification
   */
  resendVerification: async (email: string): Promise<any> => {
    const response = await apiClient.post('/auth/resend-verification', { email });
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<any> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<any> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh-token', data);
    
    // Update access token
    if (response.data.status && response.data.data) {
      const { access_token } = response.data.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access_token);
      }
    }
    
    return response.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenManager.isAuthenticated();
  },

  /**
   * Get current user from storage
   */
  getCurrentUser: () => {
    return userStorage.getUser();
  },
};

export default authApi;