'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminApi } from '@/lib/api/admin';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building,
} from 'lucide-react';

interface Transaction {
  id: string;
  order_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  item_type: 'course' | 'class' | 'bootcamp';
  item_id: string;
  item_name: string;
  payment_method: string;
  payment_channel: string;
  amount: number;
  admin_fee: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'settled' | 'expired' | 'cancelled' | 'failed';
  paid_at?: string;
  created_at: string;
}

interface Withdrawal {
  id: string;
  tutor_id: string;
  tutor_name: string;
  tutor_email: string;
  amount: number;
  admin_fee: number;
  total_amount: number;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed' | 'completed';
  requested_at: string;
  processed_at?: string;
  notes?: string;
  rejection_reason?: string;
}

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'withdrawals'>('transactions');
  const [loading, setLoading] = useState(true);

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionFilters, setTransactionFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    per_page: 10,
  });
  const [transactionPagination, setTransactionPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });

  // Withdrawals State
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [withdrawalFilters, setWithdrawalFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    per_page: 10,
  });
  const [withdrawalPagination, setWithdrawalPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });

  // Statistics
  const [stats, setStats] = useState({
    total_revenue: 0,
    revenue_this_month: 0,
    total_transactions: 0,
    pending_withdrawals: 0,
    completed_transactions: 0,
    failed_transactions: 0,
  });

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    } else {
      fetchWithdrawals();
    }
    fetchStats();
  }, [activeTab, transactionFilters.page, withdrawalFilters.page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          order_id: 'ORDER-20251101-001',
          user_id: 'user-1',
          user_name: 'John Doe',
          user_email: 'john@example.com',
          item_type: 'course',
          item_id: 'course-1',
          item_name: 'Complete Web Development Bootcamp',
          payment_method: 'bank_transfer',
          payment_channel: 'BCA',
          amount: 299000,
          admin_fee: 4000,
          total_amount: 303000,
          status: 'paid',
          paid_at: '2025-01-15 10:30:00',
          created_at: '2025-01-15 10:00:00',
        },
        {
          id: '2',
          order_id: 'ORDER-20251101-002',
          user_id: 'user-2',
          user_name: 'Jane Smith',
          user_email: 'jane@example.com',
          item_type: 'course',
          item_id: 'course-2',
          item_name: 'React & Next.js Masterclass',
          payment_method: 'e_wallet',
          payment_channel: 'OVO',
          amount: 399000,
          admin_fee: 5000,
          total_amount: 404000,
          status: 'settled',
          paid_at: '2025-01-14 14:20:00',
          created_at: '2025-01-14 14:00:00',
        },
        {
          id: '3',
          order_id: 'ORDER-20251101-003',
          user_id: 'user-3',
          user_name: 'Bob Johnson',
          user_email: 'bob@example.com',
          item_type: 'course',
          item_id: 'course-3',
          item_name: 'UI/UX Design Complete',
          payment_method: 'bank_transfer',
          payment_channel: 'BNI',
          amount: 450000,
          admin_fee: 6000,
          total_amount: 456000,
          status: 'pending',
          created_at: '2025-01-16 09:00:00',
        },
        {
          id: '4',
          order_id: 'ORDER-20251101-004',
          user_id: 'user-4',
          user_name: 'Alice Brown',
          user_email: 'alice@example.com',
          item_type: 'course',
          item_id: 'course-4',
          item_name: 'Node.js Backend Development',
          payment_method: 'credit_card',
          payment_channel: 'Visa',
          amount: 350000,
          admin_fee: 4500,
          total_amount: 354500,
          status: 'failed',
          created_at: '2025-01-13 11:00:00',
        },
      ];

      let filtered = mockTransactions;
      if (transactionFilters.status !== 'all') {
        filtered = filtered.filter(t => t.status === transactionFilters.status);
      }
      if (transactionFilters.search) {
        filtered = filtered.filter(
          t =>
            t.order_id.toLowerCase().includes(transactionFilters.search.toLowerCase()) ||
            t.user_name.toLowerCase().includes(transactionFilters.search.toLowerCase()) ||
            t.item_name.toLowerCase().includes(transactionFilters.search.toLowerCase())
        );
      }

      setTransactions(filtered);
      setTransactionPagination({
        current_page: 1,
        per_page: 10,
        total: filtered.length,
        total_pages: Math.ceil(filtered.length / 10),
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockWithdrawals: Withdrawal[] = [
        {
          id: '1',
          tutor_id: 'tutor-1',
          tutor_name: 'John Doe',
          tutor_email: 'john.tutor@example.com',
          amount: 5000000,
          admin_fee: 50000,
          total_amount: 4950000,
          bank_name: 'Bank BCA',
          bank_account_number: '1234567890',
          bank_account_name: 'John Doe',
          status: 'pending',
          requested_at: '2025-01-16 10:00:00',
        },
        {
          id: '2',
          tutor_id: 'tutor-2',
          tutor_name: 'Jane Smith',
          tutor_email: 'jane.tutor@example.com',
          amount: 3000000,
          admin_fee: 30000,
          total_amount: 2970000,
          bank_name: 'Bank Mandiri',
          bank_account_number: '9876543210',
          bank_account_name: 'Jane Smith',
          status: 'approved',
          requested_at: '2025-01-15 14:00:00',
          processed_at: '2025-01-15 15:30:00',
        },
        {
          id: '3',
          tutor_id: 'tutor-3',
          tutor_name: 'Bob Johnson',
          tutor_email: 'bob.tutor@example.com',
          amount: 2500000,
          admin_fee: 25000,
          total_amount: 2475000,
          bank_name: 'Bank BNI',
          bank_account_number: '5555666677',
          bank_account_name: 'Bob Johnson',
          status: 'completed',
          requested_at: '2025-01-10 09:00:00',
          processed_at: '2025-01-11 10:00:00',
        },
      ];

      let filtered = mockWithdrawals;
      if (withdrawalFilters.status !== 'all') {
        filtered = filtered.filter(w => w.status === withdrawalFilters.status);
      }
      if (withdrawalFilters.search) {
        filtered = filtered.filter(w =>
          w.tutor_name.toLowerCase().includes(withdrawalFilters.search.toLowerCase())
        );
      }

      setWithdrawals(filtered);
      setWithdrawalPagination({
        current_page: 1,
        per_page: 10,
        total: filtered.length,
        total_pages: Math.ceil(filtered.length / 10),
      });
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      setStats({
        total_revenue: response.data.total_revenue || 125000000,
        revenue_this_month: response.data.revenue_this_month || 25000000,
        total_transactions: 150,
        pending_withdrawals: 3,
        completed_transactions: 145,
        failed_transactions: 5,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApproveWithdrawal = async (withdrawalId: string) => {
    if (!confirm('Approve withdrawal request ini?')) return;

    setActionLoading(withdrawalId);
    try {
      await adminApi.approveWithdrawal(withdrawalId);
      alert('Withdrawal request berhasil diapprove');
      fetchWithdrawals();
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert('Gagal approve withdrawal');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectWithdrawal = async (withdrawalId: string) => {
    const reason = prompt('Alasan reject:');
    if (!reason) return;

    setActionLoading(withdrawalId);
    try {
      await adminApi.rejectWithdrawal(withdrawalId, reason);
      alert('Withdrawal request berhasil direject');
      fetchWithdrawals();
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      alert('Gagal reject withdrawal');
    } finally {
      setActionLoading(null);
    }
  };

  const getTransactionStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: Clock },
      paid: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Paid', icon: CheckCircle },
      settled: { bg: 'bg-green-100', text: 'text-green-700', label: 'Settled', icon: CheckCircle },
      expired: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Expired', icon: XCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled', icon: XCircle },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed', icon: AlertCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const getWithdrawalStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Review' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
      processed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Processing' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600">Kelola transaksi dan withdrawal tutor</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={activeTab === 'transactions' ? fetchTransactions : fetchWithdrawals}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm opacity-90">Total Revenue</p>
            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.total_revenue)}</p>
            <p className="text-xs opacity-75 mt-1">All time</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">Revenue This Month</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatCurrency(stats.revenue_this_month)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Current month</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_transactions}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.completed_transactions} completed • {stats.failed_transactions} failed
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">Pending Withdrawals</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending_withdrawals}</p>
            <p className="text-xs text-gray-500 mt-1">Need review</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'transactions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'withdrawals'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Withdrawals
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'transactions'
                      ? 'Cari order ID, user, atau kursus...'
                      : 'Cari nama tutor...'
                  }
                  value={activeTab === 'transactions' ? transactionFilters.search : withdrawalFilters.search}
                  onChange={(e) =>
                    activeTab === 'transactions'
                      ? setTransactionFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))
                      : setWithdrawalFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      activeTab === 'transactions' ? fetchTransactions() : fetchWithdrawals();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <select
                  value={activeTab === 'transactions' ? transactionFilters.status : withdrawalFilters.status}
                  onChange={(e) =>
                    activeTab === 'transactions'
                      ? setTransactionFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))
                      : setWithdrawalFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  {activeTab === 'transactions' ? (
                    <>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="settled">Settled</option>
                      <option value="expired">Expired</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="failed">Failed</option>
                    </>
                  ) : (
                    <>
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="processed">Processing</option>
                      <option value="completed">Completed</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : activeTab === 'transactions' ? (
            // Transactions Table
            transactions.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada transaksi ditemukan</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-900">{transaction.order_id}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{transaction.user_name}</p>
                              <p className="text-xs text-gray-500">{transaction.user_email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{transaction.item_name}</p>
                            <p className="text-xs text-gray-500 capitalize">{transaction.item_type}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{transaction.payment_channel}</p>
                            <p className="text-xs text-gray-500 capitalize">
                              {transaction.payment_method.replace('_', ' ')}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(transaction.total_amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Fee: {formatCurrency(transaction.admin_fee)}
                            </p>
                          </td>
                          <td className="px-6 py-4">{getTransactionStatusBadge(transaction.status)}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{formatDate(transaction.created_at)}</p>
                            {transaction.paid_at && (
                              <p className="text-xs text-gray-500">Paid: {formatDate(transaction.paid_at)}</p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {transactionPagination.total} transaction(s)
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setTransactionFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                        }
                        disabled={transactionPagination.current_page === 1}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium">
                        Page {transactionPagination.current_page} of {transactionPagination.total_pages}
                      </span>
                      <button
                        onClick={() =>
                          setTransactionFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                        }
                        disabled={
                          transactionPagination.current_page === transactionPagination.total_pages
                        }
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )
          ) : (
            // Withdrawals Table
            withdrawals.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada withdrawal request</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {withdrawal.tutor_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {withdrawal.tutor_name}
                              </p>
                              <p className="text-xs text-gray-500">{withdrawal.tutor_email}</p>
                            </div>
                            {getWithdrawalStatusBadge(withdrawal.status)}
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Amount</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(withdrawal.amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Admin Fee</p>
                              <p className="text-sm font-semibold text-red-600">
                                - {formatCurrency(withdrawal.admin_fee)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Total Payout</p>
                              <p className="text-sm font-semibold text-green-600">
                                {formatCurrency(withdrawal.total_amount)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg text-sm">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{withdrawal.bank_name}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-700">{withdrawal.bank_account_number}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-700">{withdrawal.bank_account_name}</span>
                          </div>

                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Requested: {formatDate(withdrawal.requested_at)}</span>
                            </div>
                            {withdrawal.processed_at && (
                              <>
                                <span>•</span>
                                <span>Processed: {formatDate(withdrawal.processed_at)}</span>
                              </>
                            )}
                          </div>

                          {withdrawal.rejection_reason && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-xs text-red-700">
                                <span className="font-semibold">Rejection Reason:</span>{' '}
                                {withdrawal.rejection_reason}
                              </p>
                            </div>
                          )}
                        </div>

                        {withdrawal.status === 'pending' && (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleApproveWithdrawal(withdrawal.id)}
                              disabled={actionLoading === withdrawal.id}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === withdrawal.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectWithdrawal(withdrawal.id)}
                              disabled={actionLoading === withdrawal.id}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === withdrawal.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {withdrawalPagination.total} withdrawal request(s)
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setWithdrawalFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                        }
                        disabled={withdrawalPagination.current_page === 1}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium">
                        Page {withdrawalPagination.current_page} of {withdrawalPagination.total_pages}
                      </span>
                      <button
                        onClick={() =>
                          setWithdrawalFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                        }
                        disabled={
                          withdrawalPagination.current_page === withdrawalPagination.total_pages
                        }
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
