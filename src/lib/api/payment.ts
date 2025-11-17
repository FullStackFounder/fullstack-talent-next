import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Types
export interface CreatePaymentData {
  item_type: 'course' | 'class' | 'bootcamp' | 'mentorship';
  item_id: string;
  item_name?: string;
  amount: number;
  payment_method: 'bank_transfer' | 'e_wallet' | 'credit_card' | 'retail_outlet' | 'qris';
  payment_channel?: string; // BCA, OVO, etc.
  description?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  order_id: string;
  external_id: string;
  payment_method: string;
  payment_channel: string;
  amount: number;
  admin_fee: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'settled' | 'expired' | 'cancelled' | 'failed';
  payment_url: string;
  description: string;
  paid_at?: string;
  expired_at: string;
  metadata: {
    item_type: string;
    item_id: string;
    item_name: string;
    user_email: string;
    user_name: string;
  };
  user_name: string;
  user_email: string;
  created_at: string;
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    payment: Payment;
    payment_url: string;
    expires_at: string;
  };
  timestamp: string;
}

export interface PaymentStatusResponse {
  status: boolean;
  message: string;
  data: Payment;
  timestamp: string;
}

// Payment API
export const paymentApi = {
  /**
   * Create new payment
   * @param data - Payment creation data
   * @returns Payment response with payment URL
   */
  createPayment: async (data: CreatePaymentData): Promise<PaymentResponse> => {
    try {
      const response = await axios.post<PaymentResponse>(
        `${API_URL}/payments/create`,
        data,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Gagal membuat payment');
      }
      throw new Error('Terjadi kesalahan saat membuat payment');
    }
  },

  /**
   * Get payment status
   * @param paymentId - Payment ID or Order ID
   * @returns Payment status
   */
  getPaymentStatus: async (paymentId: string): Promise<PaymentStatusResponse> => {
    try {
      const response = await axios.get<PaymentStatusResponse>(
        `${API_URL}/payments/${paymentId}/status`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Gagal mengambil status payment');
      }
      throw new Error('Terjadi kesalahan saat mengambil status payment');
    }
  },

  /**
   * Get user's payment history
   * @param filters - Optional filters
   * @returns List of payments
   */
  getMyPayments: async (filters?: {
    status?: string;
    item_type?: string;
    page?: number;
    per_page?: number;
  }) => {
    try {
      const response = await axios.get(`${API_URL}/payments/my-payments`, {
        params: filters,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Gagal mengambil riwayat payment');
      }
      throw new Error('Terjadi kesalahan saat mengambil riwayat payment');
    }
  },

  /**
   * Cancel pending payment
   * @param paymentId - Payment ID
   * @returns Success response
   */
  cancelPayment: async (paymentId: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/payments/${paymentId}/cancel`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Gagal membatalkan payment');
      }
      throw new Error('Terjadi kesalahan saat membatalkan payment');
    }
  },

  /**
   * Format payment amount to IDR
   * @param amount - Amount in number
   * @returns Formatted string
   */
  formatAmount: (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Get payment method name
   * @param method - Payment method code
   * @returns Readable name
   */
  getPaymentMethodName: (method: string): string => {
    const names: Record<string, string> = {
      bank_transfer: 'Transfer Bank',
      e_wallet: 'E-Wallet',
      credit_card: 'Kartu Kredit',
      retail_outlet: 'Retail Outlet',
      qris: 'QRIS',
    };
    return names[method] || method;
  },

  /**
   * Get payment status badge color
   * @param status - Payment status
   * @returns Tailwind color class
   */
  getStatusColor: (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      settled: 'bg-blue-100 text-blue-800',
      expired: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  },

  /**
   * Get payment status label in Indonesian
   * @param status - Payment status
   * @returns Indonesian label
   */
  getStatusLabel: (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Menunggu Pembayaran',
      paid: 'Berhasil',
      settled: 'Selesai',
      expired: 'Kadaluarsa',
      cancelled: 'Dibatalkan',
      failed: 'Gagal',
    };
    return labels[status] || status;
  },

  /**
   * Check if payment is still active (can be paid)
   * @param payment - Payment object
   * @returns Boolean
   */
  isPaymentActive: (payment: Payment): boolean => {
    return payment.status === 'pending' && new Date(payment.expired_at) > new Date();
  },

  /**
   * Get time remaining for payment
   * @param expiresAt - Expiration date string
   * @returns Readable time remaining
   */
  getTimeRemaining: (expiresAt: string): string => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) {
      return 'Kadaluarsa';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} hari lagi`;
    }

    if (hours > 0) {
      return `${hours} jam ${minutes} menit lagi`;
    }

    return `${minutes} menit lagi`;
  },

  /**
   * Get available payment channels by method
   * @param method - Payment method
   * @returns Array of channels
   */
  getPaymentChannels: (method: string): { code: string; name: string; icon?: string }[] => {
    const channels: Record<string, { code: string; name: string; icon?: string }[]> = {
      bank_transfer: [
        { code: 'BCA', name: 'BCA Virtual Account' },
        { code: 'BNI', name: 'BNI Virtual Account' },
        { code: 'BRI', name: 'BRI Virtual Account' },
        { code: 'MANDIRI', name: 'Mandiri Virtual Account' },
        { code: 'PERMATA', name: 'Permata Virtual Account' },
      ],
      e_wallet: [
        { code: 'OVO', name: 'OVO' },
        { code: 'DANA', name: 'DANA' },
        { code: 'LINKAJA', name: 'LinkAja' },
        { code: 'SHOPEEPAY', name: 'ShopeePay' },
      ],
      retail_outlet: [
        { code: 'ALFAMART', name: 'Alfamart' },
        { code: 'INDOMARET', name: 'Indomaret' },
      ],
    };

    return channels[method] || [];
  },
};
