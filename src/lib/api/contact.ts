import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  replied_at?: string;
  reply_message?: string;
}

export interface ContactResponse {
  status: boolean;
  message: string;
  data?: ContactMessage;
  timestamp: string;
}

export interface ContactListResponse {
  status: boolean;
  message: string;
  data: {
    messages: ContactMessage[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
  timestamp: string;
}

// Contact API
export const contactApi = {
  /**
   * Submit contact form
   * @param data - Contact form data
   * @returns Response with success message
   */
  submitContactForm: async (data: ContactFormData): Promise<ContactResponse> => {
    try {
      const response = await axios.post<ContactResponse>(
        `${API_URL}/contact/submit`,
        data,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Gagal mengirim pesan');
      }
      throw new Error('Terjadi kesalahan saat mengirim pesan');
    }
  },

  /**
   * Get all contact messages (Admin only)
   * @param filters - Optional filters
   * @returns List of contact messages
   */
  getContactMessages: async (filters?: {
    status?: string;
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<ContactListResponse> => {
    try {
      const response = await axios.get<ContactListResponse>(
        `${API_URL}/contact/messages`,
        {
          params: filters,
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Gagal mengambil pesan');
      }
      throw new Error('Terjadi kesalahan saat mengambil pesan');
    }
  },

  /**
   * Get single contact message (Admin only)
   * @param messageId - Message ID
   * @returns Contact message details
   */
  getContactMessage: async (messageId: string): Promise<ContactResponse> => {
    try {
      const response = await axios.get<ContactResponse>(
        `${API_URL}/contact/messages/${messageId}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Gagal mengambil pesan');
      }
      throw new Error('Terjadi kesalahan saat mengambil pesan');
    }
  },

  /**
   * Update contact message status (Admin only)
   * @param messageId - Message ID
   * @param status - New status
   * @returns Updated message
   */
  updateMessageStatus: async (
    messageId: string,
    status: 'new' | 'read' | 'replied' | 'archived'
  ): Promise<ContactResponse> => {
    try {
      const response = await axios.patch<ContactResponse>(
        `${API_URL}/contact/messages/${messageId}/status`,
        { status },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Gagal mengupdate status');
      }
      throw new Error('Terjadi kesalahan saat mengupdate status');
    }
  },

  /**
   * Reply to contact message (Admin only)
   * @param messageId - Message ID
   * @param reply - Reply message
   * @returns Updated message
   */
  replyToMessage: async (messageId: string, reply: string): Promise<ContactResponse> => {
    try {
      const response = await axios.post<ContactResponse>(
        `${API_URL}/contact/messages/${messageId}/reply`,
        { reply_message: reply },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Gagal mengirim balasan');
      }
      throw new Error('Terjadi kesalahan saat mengirim balasan');
    }
  },

  /**
   * Delete contact message (Admin only)
   * @param messageId - Message ID
   * @returns Success response
   */
  deleteMessage: async (messageId: string): Promise<ContactResponse> => {
    try {
      const response = await axios.delete<ContactResponse>(
        `${API_URL}/contact/messages/${messageId}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Gagal menghapus pesan');
      }
      throw new Error('Terjadi kesalahan saat menghapus pesan');
    }
  },

  /**
   * Get contact status badge color
   * @param status - Message status
   * @returns Tailwind color class
   */
  getStatusColor: (status: string): string => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  },

  /**
   * Get contact status label
   * @param status - Message status
   * @returns Indonesian label
   */
  getStatusLabel: (status: string): string => {
    const labels: Record<string, string> = {
      new: 'Baru',
      read: 'Dibaca',
      replied: 'Dibalas',
      archived: 'Diarsipkan',
    };
    return labels[status] || status;
  },
};
