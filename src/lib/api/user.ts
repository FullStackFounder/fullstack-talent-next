import apiClient from './client';

export interface User {
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
}

export interface StudentProfile {
  id: string;
  user_id: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  education_level?: string;
  institution?: string;
  major?: string;
  graduation_year?: number;
  current_job_title?: string;
  current_company?: string;
  interests?: string[];
  learning_goals?: string;
  timezone?: string;
  language_preference?: string;
}

export interface TutorProfile {
  id: string;
  user_id: string;
  expertise?: string[];
  years_experience?: number;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  bio?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  display_order: number;
  is_public: boolean;
  created_at?: string;
}

export interface ProfileSettings {
  notifications_enabled: boolean;
  email_digest: 'daily' | 'weekly' | 'monthly' | 'never';
  theme: 'light' | 'dark' | 'auto';
}

export interface ProfileStatistics {
  total_courses: number;
  completed_courses?: number;
  certificates?: number;
  total_learning_hours?: number;
  total_students?: number;
  average_rating?: number;
}

export interface BankAccount {
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  is_verified: boolean;
}

export interface ProfileResponse {
  user: User;
  profile: StudentProfile | TutorProfile;
  social_links: SocialLink[];
  settings: ProfileSettings;
  statistics: ProfileStatistics;
  bank_account?: BankAccount;
}

export interface UpdateProfileRequest {
  full_name?: string;
  phone?: string;
  bio?: string;

  // Student fields
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  education_level?: string;
  institution?: string;
  major?: string;
  graduation_year?: number;
  current_job_title?: string;
  current_company?: string;
  interests?: string[];
  learning_goals?: string;
  timezone?: string;
  language_preference?: string;

  // Tutor fields
  expertise?: string[];
  years_experience?: number;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
}

export interface UpdateBankAccountRequest {
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
}

export interface AddSocialLinkRequest {
  platform: string;
  url: string;
  is_public: boolean;
  display_order?: number;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  item_type: 'course' | 'class' | 'bootcamp';
  item_id: string;
  created_at: string;

  // Item details
  title?: string;
  slug?: string;
  thumbnail_url?: string;
  price?: number;
  discount_price?: number;
  average_rating?: number;
  total_enrolled?: number;
  tutor_name?: string;
}

export const userApi = {
  // Profile Management
  getMyProfile: async (): Promise<{ status: string; data: ProfileResponse }> => {
    const response = await apiClient.get<{ status: string; data: ProfileResponse }>('/profile');
    return response.data;
  },

  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<{ status: string; message: string; data: { user: User; profile: any } }> => {
    const response = await apiClient.put<{ status: string; message: string; data: { user: User; profile: any } }>(
      '/profile',
      data
    );
    return response.data;
  },

  getPublicProfile: async (userId: string): Promise<{ status: string; data: any }> => {
    const response = await apiClient.get<{ status: string; data: any }>(`/users/${userId}/profile`);
    return response.data;
  },

  // Avatar Management
  uploadAvatar: async (file: File): Promise<{ status: string; message: string; data: { avatar_url: string } }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ status: string; message: string; data: { avatar_url: string } }>(
      '/profile/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deleteAvatar: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete<{ status: string; message: string }>('/profile/avatar');
    return response.data;
  },

  // Bank Account Management (Tutor Only)
  getBankAccount: async (): Promise<{ status: string; data: BankAccount }> => {
    const response = await apiClient.get<{ status: string; data: BankAccount }>('/profile/bank-account');
    return response.data;
  },

  updateBankAccount: async (
    data: UpdateBankAccountRequest
  ): Promise<{ status: string; message: string; data: BankAccount }> => {
    const response = await apiClient.put<{ status: string; message: string; data: BankAccount }>(
      '/profile/bank-account',
      data
    );
    return response.data;
  },

  deleteBankAccount: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete<{ status: string; message: string }>('/profile/bank-account');
    return response.data;
  },

  // Social Media Links
  getSocialLinks: async (): Promise<{ status: string; data: SocialLink[] }> => {
    const response = await apiClient.get<{ status: string; data: SocialLink[] }>('/profile/social-media');
    return response.data;
  },

  addSocialLink: async (
    data: AddSocialLinkRequest
  ): Promise<{ status: string; message: string; data: SocialLink }> => {
    const response = await apiClient.post<{ status: string; message: string; data: SocialLink }>(
      '/profile/social-media',
      data
    );
    return response.data;
  },

  updateSocialLink: async (
    linkId: string,
    data: AddSocialLinkRequest
  ): Promise<{ status: string; message: string; data: SocialLink }> => {
    const response = await apiClient.put<{ status: string; message: string; data: SocialLink }>(
      `/profile/social-media/${linkId}`,
      data
    );
    return response.data;
  },

  deleteSocialLink: async (linkId: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete<{ status: string; message: string }>(`/profile/social-media/${linkId}`);
    return response.data;
  },

  reorderSocialLinks: async (
    links: Array<{ id: string; display_order: number }>
  ): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>('/profile/social-media/reorder', {
      links,
    });
    return response.data;
  },

  // Wishlist Management
  getWishlist: async (): Promise<{ status: string; data: WishlistItem[] }> => {
    const response = await apiClient.get<{ status: string; data: WishlistItem[] }>('/wishlist');
    return response.data;
  },

  addToWishlist: async (data: {
    item_type: 'course' | 'class' | 'bootcamp';
    item_id: string;
  }): Promise<{ status: string; message: string; data: WishlistItem }> => {
    const response = await apiClient.post<{ status: string; message: string; data: WishlistItem }>('/wishlist', data);
    return response.data;
  },

  removeFromWishlist: async (wishlistId: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete<{ status: string; message: string }>(`/wishlist/${wishlistId}`);
    return response.data;
  },

  checkWishlist: async (
    itemType: 'course' | 'class' | 'bootcamp',
    itemId: string
  ): Promise<{ status: string; data: { in_wishlist: boolean; wishlist_id?: string } }> => {
    const response = await apiClient.get<{ status: string; data: { in_wishlist: boolean; wishlist_id?: string } }>(
      `/wishlist/check/${itemType}/${itemId}`
    );
    return response.data;
  },

  getWishlistCount: async (): Promise<{ status: string; data: { count: number } }> => {
    const response = await apiClient.get<{ status: string; data: { count: number } }>('/wishlist/count');
    return response.data;
  },

  clearWishlist: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete<{ status: string; message: string }>('/wishlist/clear');
    return response.data;
  },
};
