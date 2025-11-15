'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { courseApi } from '@/lib/api/course';
import { enrollmentApi } from '@/lib/api/enrollment';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Filter,
  ChevronDown,
  Banknote,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface CourseEarning {
  course_id: string;
  course_title: string;
  total_enrollments: number;
  total_revenue: number;
  avg_price: number;
  growth_rate: number;
}

interface PaymentRecord {
  id: string;
  date: string;
  course_title: string;
  student_name: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  payment_method: string;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requested_at: string;
  processed_at?: string;
  bank_account: string;
}

interface RevenueStatistics {
  total_earnings: number;
  current_balance: number;
  withdrawn: number;
  pending: number;
  monthly_growth: number;
  total_transactions: number;
}

export default function TutorEarningsPage() {
  const [statistics, setStatistics] = useState<RevenueStatistics>({
    total_earnings: 0,
    current_balance: 0,
    withdrawn: 0,
    pending: 0,
    monthly_growth: 0,
    total_transactions: 0,
  });
  const [courseEarnings, setCourseEarnings] = useState<CourseEarning[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Filters
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    fetchEarningsData();
  }, [timeRange]);

  const fetchEarningsData = async () => {
    setLoading(true);
    try {
      // Fetch tutor's courses
      const coursesResponse = await courseApi.getTutorCourses();
      const courses = coursesResponse.data || [];

      // Fetch enrollments for all courses
      const allEnrollments: any[] = [];
      const courseEarningsData: CourseEarning[] = [];

      for (const course of courses) {
        try {
          const enrollmentsResponse = await enrollmentApi.getCourseEnrollments(course.id);
          const enrollments = enrollmentsResponse.data || [];

          // Filter by time range
          const filteredEnrollments = filterByTimeRange(enrollments);

          allEnrollments.push(...filteredEnrollments.map((e: any) => ({
            ...e,
            course_title: course.title,
            course_id: course.id,
            price: course.discount_price || course.price,
          })));

          // Calculate earnings for this course
          const totalRevenue = filteredEnrollments.length * (course.discount_price || course.price);

          courseEarningsData.push({
            course_id: course.id,
            course_title: course.title,
            total_enrollments: filteredEnrollments.length,
            total_revenue: totalRevenue,
            avg_price: course.discount_price || course.price,
            growth_rate: calculateGrowthRate(filteredEnrollments),
          });
        } catch (err) {
          console.error(`Error fetching enrollments for course ${course.id}:`, err);
        }
      }

      // Sort by revenue
      courseEarningsData.sort((a, b) => b.total_revenue - a.total_revenue);
      setCourseEarnings(courseEarningsData);

      // Generate payment history
      const payments: PaymentRecord[] = allEnrollments.map(enrollment => ({
        id: enrollment.id,
        date: enrollment.created_at,
        course_title: enrollment.course_title,
        student_name: enrollment.user?.full_name || 'Unknown',
        amount: enrollment.price,
        status: 'completed' as const,
        payment_method: 'Credit Card',
      }));
      setPaymentHistory(payments);

      // Calculate statistics
      const totalEarnings = courseEarningsData.reduce((sum, c) => sum + c.total_revenue, 0);
      const platformFee = totalEarnings * 0.15; // 15% platform fee
      const netEarnings = totalEarnings - platformFee;

      // Mock withdrawal data
      const withdrawn = netEarnings * 0.6; // 60% withdrawn
      const currentBalance = netEarnings - withdrawn;
      const pending = totalEarnings * 0.05; // 5% pending

      setStatistics({
        total_earnings: totalEarnings,
        current_balance: currentBalance,
        withdrawn: withdrawn,
        pending: pending,
        monthly_growth: 12.5, // Mock growth rate
        total_transactions: allEnrollments.length,
      });

      // Mock withdrawal requests
      setWithdrawalRequests([
        {
          id: '1',
          amount: 5000000,
          status: 'completed',
          requested_at: '2025-01-10',
          processed_at: '2025-01-12',
          bank_account: 'BCA **** 1234',
        },
        {
          id: '2',
          amount: 3000000,
          status: 'pending',
          requested_at: '2025-01-14',
          bank_account: 'BCA **** 1234',
        },
      ]);
    } catch (error: any) {
      console.error('Error fetching earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByTimeRange = (enrollments: any[]) => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        return enrollments;
    }

    return enrollments.filter(e => new Date(e.created_at) > cutoffDate);
  };

  const calculateGrowthRate = (enrollments: any[]): number => {
    // Simple mock calculation - compare this month vs last month
    const now = new Date();
    const thisMonth = enrollments.filter(e => {
      const date = new Date(e.created_at);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    const lastMonth = enrollments.filter(e => {
      const date = new Date(e.created_at);
      return date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear();
    }).length;

    if (lastMonth === 0) return 0;
    return ((thisMonth - lastMonth) / lastMonth) * 100;
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
    }).format(date);
  };

  const handleWithdrawalRequest = async () => {
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount <= 0) {
      alert('Masukkan jumlah yang valid');
      return;
    }

    if (amount > statistics.current_balance) {
      alert('Saldo tidak mencukupi');
      return;
    }

    if (amount < 100000) {
      alert('Minimal penarikan adalah Rp 100.000');
      return;
    }

    // In production, call API to create withdrawal request
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Permintaan penarikan berhasil diajukan! Akan diproses dalam 1-3 hari kerja.');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      fetchEarningsData();
    } catch (error) {
      alert('Gagal mengajukan penarikan. Silakan coba lagi.');
    }
  };

  const filteredPayments = paymentHistory.filter(payment => {
    if (paymentFilter === 'all') return true;
    return payment.status === paymentFilter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      failed: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      approved: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const exportEarningsData = () => {
    const headers = ['Date', 'Course', 'Student', 'Amount', 'Status'];
    const rows = filteredPayments.map(p => [
      formatDate(p.date),
      p.course_title,
      p.student_name,
      formatCurrency(p.amount),
      p.status,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout userRole="tutor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Earnings & Revenue</h1>
            <p className="text-gray-600 mt-1">
              Kelola pendapatan dan penarikan dana Anda
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportEarningsData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={statistics.current_balance < 100000}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wallet className="w-4 h-4" />
              Tarik Dana
            </button>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Periode:</span>
          <div className="flex gap-2">
            {(['week', 'month', 'year', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range === 'week' ? '7 Hari' : range === 'month' ? '30 Hari' : range === 'year' ? '1 Tahun' : 'Semua'}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              {statistics.monthly_growth > 0 && (
                <div className="flex items-center gap-1 text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                  <ArrowUpRight className="w-4 h-4" />
                  {statistics.monthly_growth.toFixed(1)}%
                </div>
              )}
            </div>
            <p className="text-sm opacity-90">Total Pendapatan</p>
            <p className="text-3xl font-bold mt-2">
              {loading ? '...' : formatCurrency(statistics.total_earnings)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Tersedia</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : formatCurrency(statistics.current_balance)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Siap ditarik</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dana Ditarik</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : formatCurrency(statistics.withdrawn)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total withdrawn</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Banknote className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transaksi</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : statistics.total_transactions}
                </p>
                <p className="text-xs text-gray-500 mt-1">Enrollments</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Earnings by Course */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pendapatan per Kursus</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : courseEarnings.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Belum ada pendapatan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courseEarnings.map((course) => (
                <div
                  key={course.course_id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{course.course_title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {course.total_enrollments} enrollments × {formatCurrency(course.avg_price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(course.total_revenue)}
                    </p>
                    {course.growth_rate !== 0 && (
                      <div className={`flex items-center gap-1 text-sm mt-1 ${
                        course.growth_rate > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {course.growth_rate > 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {Math.abs(course.growth_rate).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Withdrawal Requests */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Riwayat Penarikan Dana</h2>

          {withdrawalRequests.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Belum ada riwayat penarikan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawalRequests.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Banknote className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(withdrawal.amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {withdrawal.bank_account} • {formatDate(withdrawal.requested_at)}
                      </p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(withdrawal.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Riwayat Pembayaran</h2>
              <div className="flex items-center gap-3">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Tidak ada riwayat pembayaran</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kursus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Siswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {payment.course_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {payment.student_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Platform Fee Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium">Informasi Biaya Platform</p>
              <p className="text-sm text-blue-800 mt-1">
                Platform mengambil biaya 15% dari setiap transaksi. Saldo yang ditampilkan adalah jumlah setelah dipotong biaya platform.
                Penarikan minimal Rp 100.000 dan akan diproses dalam 1-3 hari kerja.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tarik Dana</h3>

            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">Saldo Tersedia</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(statistics.current_balance)}
                </p>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Penarikan
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Masukkan jumlah"
                min="100000"
                max={statistics.current_balance}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Minimal penarikan: Rp 100.000
              </p>

              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  Dana akan ditransfer ke rekening BCA **** 1234 yang terdaftar.
                  Proses penarikan memakan waktu 1-3 hari kerja.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleWithdrawalRequest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajukan Penarikan
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}