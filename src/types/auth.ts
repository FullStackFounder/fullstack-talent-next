// Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'siswa' | 'tutor' | 'admin';
  avatar_url?: string;
  bio?: string;
  is_verified: boolean;
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  email_verified_at?: string;
  last_login_at?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role?: 'siswa' | 'tutor';
}

export interface RegisterResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    email_sent: boolean;
  };
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
  timestamp: string;
}

export interface ProfileResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    stats: {
      enrolled_courses: number;
      completed_courses: number;
      is_verified: boolean;
      member_since: string;
    };
  };
  timestamp: string;
}

export interface ApiErrorResponse {
  status: false;
  message: string;
  errors?: Record<string, string>;
  timestamp: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  status: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
  timestamp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  password_confirmation: string;
}