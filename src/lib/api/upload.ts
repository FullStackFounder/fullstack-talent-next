import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface UploadResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    url: string;
    filename: string;
    size: number;
    mime_type: string;
  };
  error?: string;
}

export const uploadApi = {
  /**
   * Upload image file
   * @param file - Image file to upload
   * @param folder - Optional folder path (e.g., 'blog', 'avatars', 'courses')
   * @returns Promise with uploaded image URL
   */
  uploadImage: async (file: File, folder: string = 'blog'): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    try {
      const response = await axios.post<UploadResponse>(
        `${API_URL}/upload/image`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status === 'success' && response.data.data?.url) {
        return response.data.data.url;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Gagal mengupload gambar. Silakan coba lagi.');
    }
  },

  /**
   * Upload file (generic)
   * @param file - File to upload
   * @param folder - Optional folder path
   * @returns Promise with uploaded file URL
   */
  uploadFile: async (file: File, folder: string = 'files'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await axios.post<UploadResponse>(
        `${API_URL}/upload/file`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status === 'success' && response.data.data?.url) {
        return response.data.data.url;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Gagal mengupload file. Silakan coba lagi.');
    }
  },

  /**
   * Delete uploaded file
   * @param url - URL of the file to delete
   * @returns Promise<void>
   */
  deleteFile: async (url: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/upload`, {
        headers: getAuthHeader(),
        data: { url },
      });
    } catch (error: any) {
      console.error('Failed to delete file:', error);
      // Don't throw error to prevent blocking other operations
    }
  },

  /**
   * Upload multiple images
   * @param files - Array of image files
   * @param folder - Optional folder path
   * @returns Promise with array of uploaded image URLs
   */
  uploadMultipleImages: async (files: File[], folder: string = 'blog'): Promise<string[]> => {
    const uploadPromises = files.map((file) => uploadApi.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  },

  /**
   * Validate image file
   * @param file - File to validate
   * @param maxSizeMB - Maximum file size in MB (default: 5MB)
   * @returns { valid: boolean, error?: string }
   */
  validateImage: (file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.',
      };
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return {
        valid: false,
        error: `Ukuran file terlalu besar (${fileSizeMB.toFixed(2)}MB). Maksimal ${maxSizeMB}MB.`,
      };
    }

    return { valid: true };
  },

  /**
   * Get optimized image URL with transformations
   * @param url - Original image URL
   * @param options - Transformation options (width, height, quality)
   * @returns Optimized image URL
   */
  getOptimizedImageUrl: (
    url: string,
    options?: { width?: number; height?: number; quality?: number }
  ): string => {
    if (!url) return '';

    // If using CDN with transformation support (e.g., Cloudinary, Imgix)
    // Add transformation parameters
    // Example: https://cdn.example.com/image.jpg?w=800&h=600&q=80

    const params = new URLSearchParams();
    if (options?.width) params.append('w', options.width.toString());
    if (options?.height) params.append('h', options.height.toString());
    if (options?.quality) params.append('q', options.quality.toString());

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  },
};
