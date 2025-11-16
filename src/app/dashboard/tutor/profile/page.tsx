'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { userApi, ProfileResponse, TutorProfile } from '@/lib/api/user';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  Users,
  Star,
  Briefcase,
  Clock,
  MapPin,
  Edit,
  Loader2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Shield
} from 'lucide-react';

const SOCIAL_ICONS: Record<string, string> = {
  LinkedIn: '🔗',
  GitHub: '💻',
  'Twitter/X': '🐦',
  Instagram: '📷',
  Facebook: '📘',
  YouTube: '📺',
  TikTok: '🎵',
  Medium: '📝',
  'Dev.to': '👨‍💻',
  Website: '🌐',
  Portfolio: '💼',
  Other: '🔗',
};

export default function TutorProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userApi.getMyProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const tutorProfile = profile?.profile as TutorProfile | undefined;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return '';
    const length = accountNumber.length;
    if (length <= 4) return accountNumber;
    return '**** ' + accountNumber.slice(-4);
  };

  if (loading) {
    return (
      <DashboardLayout userRole="tutor">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout userRole="tutor">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load profile</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="tutor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Kelola informasi profil Anda</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/tutor/settings')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

          {/* Profile Info */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <div className="relative">
                  {profile.user.avatar_url ? (
                    <img
                      src={profile.user.avatar_url}
                      alt={profile.user.full_name}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                      {profile.user.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {profile.user.is_verified && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {profile.user.full_name}
                    </h2>
                    {profile.user.is_verified && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">
                    {profile.user.role === 'tutor' ? 'Tutor' : 'Student'}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    profile.user.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      profile.user.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  />
                  {profile.user.status === 'active' ? 'Active' : profile.user.status}
                </span>
              </div>
            </div>

            {/* Bio */}
            {profile.user.bio && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{profile.user.bio}</p>
              </div>
            )}

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{profile.user.email}</p>
                </div>
              </div>

              {profile.user.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{profile.user.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="font-medium">{formatDate(profile.user.created_at)}</p>
                </div>
              </div>

              {tutorProfile?.years_experience && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="font-medium">{tutorProfile.years_experience} years</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {profile.statistics.total_courses}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {profile.statistics.total_students !== undefined && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {profile.statistics.total_students}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          )}

          {profile.statistics.average_rating !== undefined && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {profile.statistics.average_rating.toFixed(1)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          )}

          {profile.statistics.certificates !== undefined && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Certificates</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {profile.statistics.certificates}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expertise */}
          {tutorProfile?.expertise && tutorProfile.expertise.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Expertise</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tutorProfile.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {profile.social_links && profile.social_links.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Social Media</h3>
              </div>
              <div className="space-y-3">
                {profile.social_links
                  .filter(link => link.is_public)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <span className="text-2xl">{SOCIAL_ICONS[link.platform] || '🔗'}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{link.platform}</p>
                        <p className="text-xs text-gray-600 truncate">{link.url}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </a>
                  ))}
              </div>
            </div>
          )}

          {/* Portfolio Links */}
          {(tutorProfile?.linkedin_url || tutorProfile?.github_url || tutorProfile?.portfolio_url) && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Portfolio & Links</h3>
              </div>
              <div className="space-y-3">
                {tutorProfile.linkedin_url && (
                  <a
                    href={tutorProfile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <span className="text-2xl">🔗</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">LinkedIn</p>
                      <p className="text-xs text-gray-600 truncate">{tutorProfile.linkedin_url}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </a>
                )}

                {tutorProfile.github_url && (
                  <a
                    href={tutorProfile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <span className="text-2xl">💻</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">GitHub</p>
                      <p className="text-xs text-gray-600 truncate">{tutorProfile.github_url}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </a>
                )}

                {tutorProfile.portfolio_url && (
                  <a
                    href={tutorProfile.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <span className="text-2xl">💼</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Portfolio</p>
                      <p className="text-xs text-gray-600 truncate">{tutorProfile.portfolio_url}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Bank Account */}
          {profile.bank_account && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Bank Account</h3>
                {profile.bank_account.is_verified && (
                  <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Bank Name</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {profile.bank_account.bank_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="text-sm font-medium text-gray-900 mt-1 font-mono">
                    {maskAccountNumber(profile.bank_account.bank_account_number)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Account Name</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {profile.bank_account.bank_account_name}
                  </p>
                </div>

                {!profile.bank_account.is_verified && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      Bank account is pending verification. You'll be able to withdraw funds once verified.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium">Keep Your Profile Updated</p>
              <p className="text-sm text-blue-800 mt-1">
                An updated profile helps students find and trust you. Make sure to complete all sections including
                expertise, portfolio links, and bank account for payments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
