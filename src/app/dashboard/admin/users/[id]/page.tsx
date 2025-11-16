'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { adminApi, UserDetailResponse } from '@/lib/api/admin';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Clock,
  DollarSign,
  Star,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Loader2,
  Shield,
  TrendingUp,
  Activity,
} from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserDetailResponse | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUserDetail(userId);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user detail:', error);
      alert('Gagal memuat detail user');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async () => {
    if (!confirm('Verify user ini?')) return;

    setActionLoading(true);
    try {
      await adminApi.verifyUser(userId);
      alert('User berhasil diverifikasi');
      fetchUserDetail();
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Gagal memverifikasi user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendUser = async () => {
    const reason = prompt('Alasan suspend:');
    if (!reason) return;

    setActionLoading(true);
    try {
      await adminApi.suspendUser(userId, reason);
      alert('User berhasil disuspend');
      fetchUserDetail();
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Gagal suspend user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateUser = async () => {
    if (!confirm('Aktifkan user ini?')) return;

    setActionLoading(true);
    try {
      await adminApi.activateUser(userId);
      alert('User berhasil diaktifkan');
      fetchUserDetail();
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Gagal mengaktifkan user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm('Hapus user ini? Tindakan ini tidak dapat dibatalkan!')) return;

    setActionLoading(true);
    try {
      await adminApi.deleteUser(userId);
      alert('User berhasil dihapus');
      router.push('/dashboard/admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Gagal menghapus user');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      siswa: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Student' },
      tutor: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Tutor' },
      admin: { bg: 'bg-red-100', text: 'text-red-700', label: 'Admin' },
    };
    const badge = badges[role as keyof typeof badges] || badges.siswa;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active', icon: CheckCircle },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Inactive', icon: XCircle },
      suspended: { bg: 'bg-red-100', text: 'text-red-700', label: 'Suspended', icon: AlertCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.inactive;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!userData) {
    return (
      <DashboardLayout userRole="admin">
        <div className="text-center py-12">
          <p className="text-gray-600">User tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  const { user, profile, statistics, recent_activity } = userData;

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push('/dashboard/admin/users')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Kembali ke User List</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Detail</h1>
              <p className="text-gray-600">Informasi lengkap user</p>
            </div>

            <div className="flex gap-2">
              {!user.is_verified && (
                <button
                  onClick={handleVerifyUser}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  Verify
                </button>
              )}

              {user.status === 'active' ? (
                <button
                  onClick={handleSuspendUser}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  <UserX className="w-4 h-4" />
                  Suspend
                </button>
              ) : user.status === 'suspended' ? (
                <button
                  onClick={handleActivateUser}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  Activate
                </button>
              ) : null}

              <button
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex items-end gap-6 -mt-16 mb-6">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex-1 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                </div>

                {user.is_verified && (
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified Account</span>
                  </div>
                )}

                {user.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(user.created_at)}</p>
                </div>
              </div>

              {user.last_login && (
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Last Login</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(user.last_login)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {user.role === 'siswa' && (
            <>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Courses</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {statistics.total_enrollments || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {statistics.completed_courses || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </>
          )}

          {user.role === 'tutor' && (
            <>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Courses</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {statistics.total_courses || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {statistics.total_students || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      Rp {(statistics.total_revenue || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Rating</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {statistics.average_rating?.toFixed(1) || '0.0'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Details */}
        {profile && Object.keys(profile).length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.date_of_birth && (
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(profile.date_of_birth)}
                  </p>
                </div>
              )}

              {profile.gender && (
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-sm font-medium text-gray-900 mt-1 capitalize">
                    {profile.gender}
                  </p>
                </div>
              )}

              {profile.education_level && (
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {profile.education_level}
                  </p>
                </div>
              )}

              {profile.institution && (
                <div>
                  <p className="text-sm text-gray-500">Institution</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {profile.institution}
                  </p>
                </div>
              )}

              {profile.current_job_title && (
                <div>
                  <p className="text-sm text-gray-500">Job Title</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {profile.current_job_title}
                  </p>
                </div>
              )}

              {profile.current_company && (
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {profile.current_company}
                  </p>
                </div>
              )}

              {profile.years_experience && (
                <div>
                  <p className="text-sm text-gray-500">Years Experience</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {profile.years_experience} years
                  </p>
                </div>
              )}

              {profile.expertise && profile.expertise.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recent_activity && recent_activity.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recent_activity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(activity.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
