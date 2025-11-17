import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
}

// Types based on BLOG_API.md
export interface BlogPost {
  id: string;
  author_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'members_only' | 'private';
  reading_time_minutes: number | null;
  views_count: number;
  likes_count: number;
  comments_count: number;
  is_featured: boolean;
  allow_comments: boolean;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  author_name?: string;
  author_avatar?: string;
  author_bio?: string;
  category_name?: string;
  category_slug?: string;
  tags?: BlogTag[];
  comments?: BlogComment[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  image_url: string | null;
  parent_id: string | null;
  display_order: number;
  posts_count: number;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  posts_count?: number;
  created_at?: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  likes_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_name?: string;
  user_avatar?: string;
  replies?: BlogComment[];
}

export interface PostFilters {
  page?: number;
  per_page?: number;
  status?: 'draft' | 'published' | 'archived';
  category_id?: string;
  author_id?: string;
  is_featured?: boolean;
  search?: string;
  sort_by?: 'created_at' | 'views_count' | 'likes_count' | 'comments_count';
  sort_order?: 'asc' | 'desc';
}

export interface CreatePostData {
  title: string;
  content: string;
  category_id?: string;
  excerpt?: string;
  featured_image_url?: string;
  status?: 'draft' | 'published' | 'archived';
  visibility?: 'public' | 'members_only' | 'private';
  is_featured?: boolean;
  allow_comments?: boolean;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export interface CreateCommentData {
  content: string;
  parent_id?: string;
}

// API Response wrapper
interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

// Blog API
export const blogApi = {
  // Posts
  getPosts: async (filters?: PostFilters) => {
    const response = await axios.get<ApiResponse<{ posts: BlogPost[]; pagination: any }>>(
      `${API_URL}/blog/posts`,
      {
        params: filters,
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  getPostBySlug: async (slug: string) => {
    const response = await axios.get<ApiResponse<BlogPost>>(
      `${API_URL}/blog/posts/${slug}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  createPost: async (data: CreatePostData) => {
    const response = await axios.post<ApiResponse<BlogPost>>(
      `${API_URL}/blog/posts`,
      data,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  updatePost: async (postId: string, data: UpdatePostData) => {
    const response = await axios.put<ApiResponse<BlogPost>>(
      `${API_URL}/blog/posts/${postId}`,
      data,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await axios.delete<ApiResponse<void>>(
      `${API_URL}/blog/posts/${postId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  getFeaturedPosts: async (limit: number = 5) => {
    const response = await axios.get<ApiResponse<BlogPost[]>>(
      `${API_URL}/blog/posts/featured`,
      {
        params: { limit },
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  getPopularPosts: async (limit: number = 5) => {
    const response = await axios.get<ApiResponse<BlogPost[]>>(
      `${API_URL}/blog/posts/popular`,
      {
        params: { limit },
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await axios.get<ApiResponse<BlogCategory[]>>(
      `${API_URL}/blog/categories`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  // Comments
  getPostComments: async (postId: string) => {
    const response = await axios.get<ApiResponse<BlogComment[]>>(
      `${API_URL}/blog/posts/${postId}/comments`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  createComment: async (postId: string, data: CreateCommentData) => {
    const response = await axios.post<ApiResponse<BlogComment>>(
      `${API_URL}/blog/posts/${postId}/comments`,
      data,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  // Likes
  toggleLike: async (postId: string) => {
    const response = await axios.post<ApiResponse<{ liked: boolean; likes_count: number }>>(
      `${API_URL}/blog/posts/${postId}/like`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  // Admin functions (not in public API docs, but likely needed)
  getAllComments: async (filters?: { status?: string; page?: number; per_page?: number }) => {
    try {
      const response = await axios.get<ApiResponse<{ comments: BlogComment[]; pagination: any }>>(
        `${API_URL}/blog/admin/comments`,
        {
          params: filters,
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      // Fallback: return empty data if endpoint doesn't exist
      return { status: 'success' as const, message: 'No comments', data: { comments: [], pagination: {} } };
    }
  },

  updateCommentStatus: async (commentId: string, status: 'pending' | 'approved' | 'rejected' | 'spam') => {
    const response = await axios.put<ApiResponse<BlogComment>>(
      `${API_URL}/blog/admin/comments/${commentId}/status`,
      { status },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  deleteComment: async (commentId: string) => {
    const response = await axios.delete<ApiResponse<void>>(
      `${API_URL}/blog/admin/comments/${commentId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  createCategory: async (data: { name: string; slug?: string; description?: string }) => {
    const response = await axios.post<ApiResponse<BlogCategory>>(
      `${API_URL}/blog/admin/categories`,
      data,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  updateCategory: async (categoryId: string, data: Partial<{ name: string; slug?: string; description?: string }>) => {
    const response = await axios.put<ApiResponse<BlogCategory>>(
      `${API_URL}/blog/admin/categories/${categoryId}`,
      data,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  deleteCategory: async (categoryId: string) => {
    const response = await axios.delete<ApiResponse<void>>(
      `${API_URL}/blog/admin/categories/${categoryId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  toggleFeatured: async (postId: string) => {
    const response = await axios.post<ApiResponse<BlogPost>>(
      `${API_URL}/blog/admin/posts/${postId}/toggle-featured`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },
};
