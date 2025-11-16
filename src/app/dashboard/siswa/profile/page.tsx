'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { userApi, ProfileResponse, StudentProfile } from '@/lib/api/user';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Target,
  Globe,
  Settings,
  Edit3,
  Loader2,
  Award,
  BookOpen,
  Clock,
  CheckCircle,
  ExternalLink,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';

const getSocialIcon = (platform: string) => {
  const icons: { [key: string]: any } = {
    'LinkedIn': Linkedin,
    'GitHub': Github,
    'Twitter': Twitter,
    'Twitter/X': Twitter,
    'Instagram': Instagram,
    'Facebook': Facebook,
    'YouTube': Youtube,
    'Website': Globe,
    'Portfolio': Globe,
  };

  const Icon = icons[platform] || ExternalLink;
  return <Icon className="w-4 h-4" />;
};

export default function StudentProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userApi.getMyProfile();
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <DashboardLayout userRole="siswa">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profileData) {
    return (
      <DashboardLayout userRole="siswa">
        <div className="text-center py-12">
          <p className="text-gray-600">Gagal memuat profil</p>
        </div>
      </DashboardLayout>
    );
  }

  const { user, profile, social_links, statistics } = profileData;
  const studentProfile = profile as StudentProfile;

  return (
    <DashboardLayout userRole="siswa">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
            <p className="text-gray-600">Informasi akun dan preferensi Anda</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/siswa/settings')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profil
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              {/* Avatar */}
              <div className="flex items-end gap-4">
                <div className="relative">
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
                  {user.is_verified && (
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
                  <p className="text-gray-600 capitalize">{user.role}</p>
                  {user.is_verified && (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600 mt-1">
                      <CheckCircle className="w-4 h-4" />
                      Verified Account
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-6">
                <p className="text-gray-700">{user.bio}</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{statistics.total_courses || 0}</p>
                <p className="text-xs text-gray-600">Total Kursus</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{statistics.completed_courses || 0}</p>
                <p className="text-xs text-gray-600">Selesai</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{statistics.certificates || 0}</p>
                <p className="text-xs text-gray-600">Sertifikat</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{statistics.total_learning_hours || 0}h</p>
                <p className="text-xs text-gray-600">Jam Belajar</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact & Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Informasi Kontak</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Telepon</p>
                      <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                )}

                {studentProfile.date_of_birth && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Tanggal Lahir</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(studentProfile.date_of_birth)}
                      </p>
                    </div>
                  </div>
                )}

                {studentProfile.gender && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Jenis Kelamin</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {studentProfile.gender === 'male' ? 'Laki-laki' : studentProfile.gender === 'female' ? 'Perempuan' : 'Lainnya'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            {(studentProfile.address || studentProfile.city) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Alamat</h3>
                </div>
                <div className="space-y-2">
                  {studentProfile.address && (
                    <p className="text-sm text-gray-700">{studentProfile.address}</p>
                  )}
                  <div className="flex gap-2 text-sm text-gray-600">
                    {studentProfile.city && <span>{studentProfile.city}</span>}
                    {studentProfile.city && studentProfile.province && <span>•</span>}
                    {studentProfile.province && <span>{studentProfile.province}</span>}
                    {studentProfile.postal_code && (
                      <>
                        <span>•</span>
                        <span>{studentProfile.postal_code}</span>
                      </>
                    )}
                  </div>
                  {studentProfile.country && (
                    <p className="text-sm text-gray-600">{studentProfile.country}</p>
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {(studentProfile.education_level || studentProfile.institution) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Pendidikan</h3>
                </div>
                <div className="space-y-4">
                  {studentProfile.education_level && (
                    <div>
                      <p className="text-xs text-gray-500">Tingkat Pendidikan</p>
                      <p className="text-sm font-medium text-gray-900">{studentProfile.education_level}</p>
                    </div>
                  )}

                  {studentProfile.institution && (
                    <div>
                      <p className="text-xs text-gray-500">Institusi</p>
                      <p className="text-sm font-medium text-gray-900">{studentProfile.institution}</p>
                    </div>
                  )}

                  {studentProfile.major && (
                    <div>
                      <p className="text-xs text-gray-500">Jurusan</p>
                      <p className="text-sm font-medium text-gray-900">{studentProfile.major}</p>
                    </div>
                  )}

                  {studentProfile.graduation_year && (
                    <div>
                      <p className="text-xs text-gray-500">Tahun Lulus</p>
                      <p className="text-sm font-medium text-gray-900">{studentProfile.graduation_year}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {(studentProfile.current_job_title || studentProfile.current_company) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Pekerjaan</h3>
                </div>
                <div className="space-y-4">
                  {studentProfile.current_job_title && (
                    <div>
                      <p className="text-xs text-gray-500">Jabatan</p>
                      <p className="text-sm font-medium text-gray-900">{studentProfile.current_job_title}</p>
                    </div>
                  )}

                  {studentProfile.current_company && (
                    <div>
                      <p className="text-xs text-gray-500">Perusahaan</p>
                      <p className="text-sm font-medium text-gray-900">{studentProfile.current_company}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Interests, Goals, Social */}
          <div className="space-y-6">
            {/* Learning Goals */}
            {studentProfile.learning_goals && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Tujuan Belajar</h3>
                </div>
                <p className="text-sm text-gray-700">{studentProfile.learning_goals}</p>
              </div>
            )}

            {/* Interests */}
            {studentProfile.interests && studentProfile.interests.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Minat</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {studentProfile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {social_links && social_links.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Social Media</h3>
                </div>
                <div className="space-y-3">
                  {social_links
                    .filter((link) => link.is_public)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          {getSocialIcon(link.platform)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{link.platform}</p>
                          <p className="text-xs text-gray-500 truncate">{link.url}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </a>
                    ))}
                </div>
              </div>
            )}

            {/* Preferences */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Preferensi</h3>
              </div>
              <div className="space-y-3">
                {studentProfile.timezone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Zona Waktu</span>
                    <span className="text-sm font-medium text-gray-900">{studentProfile.timezone}</span>
                  </div>
                )}

                {studentProfile.language_preference && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bahasa</span>
                    <span className="text-sm font-medium text-gray-900 uppercase">
                      {studentProfile.language_preference}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Informasi Akun</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Bergabung sejak</span>
                  <span className="font-medium text-gray-900">{formatDate(user.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.status === 'active' ? 'Active' : user.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
