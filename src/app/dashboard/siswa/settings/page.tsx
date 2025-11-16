'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { userApi, ProfileResponse, StudentProfile, UpdateProfileRequest } from '@/lib/api/user';
import {
  ArrowLeft,
  Upload,
  Trash2,
  Loader2,
  Save,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Target,
  Heart,
  Globe,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function StudentSettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [formData, setFormData] = useState<UpdateProfileRequest>({});
  const [interestsInput, setInterestsInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userApi.getMyProfile();
      setProfileData(response.data);

      const { user, profile } = response.data;
      const studentProfile = profile as StudentProfile;

      // Populate form data
      setFormData({
        full_name: user.full_name,
        phone: user.phone || '',
        bio: user.bio || '',
        date_of_birth: studentProfile.date_of_birth || '',
        gender: studentProfile.gender || undefined,
        address: studentProfile.address || '',
        city: studentProfile.city || '',
        province: studentProfile.province || '',
        postal_code: studentProfile.postal_code || '',
        education_level: studentProfile.education_level || '',
        institution: studentProfile.institution || '',
        major: studentProfile.major || '',
        graduation_year: studentProfile.graduation_year || undefined,
        current_job_title: studentProfile.current_job_title || '',
        current_company: studentProfile.current_company || '',
        interests: studentProfile.interests || [],
        learning_goals: studentProfile.learning_goals || '',
        timezone: studentProfile.timezone || 'Asia/Jakarta',
        language_preference: studentProfile.language_preference || 'id',
      });

      // Set interests as comma-separated string
      if (studentProfile.interests && studentProfile.interests.length > 0) {
        setInterestsInput(studentProfile.interests.join(', '));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showMessage('error', 'Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleInputChange = (field: keyof UpdateProfileRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInterestsChange = (value: string) => {
    setInterestsInput(value);
    // Convert comma-separated string to array
    const interestsArray = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    setFormData((prev) => ({ ...prev, interests: interestsArray }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showMessage('error', 'Ukuran file maksimal 2MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showMessage('error', 'Format file harus JPG, PNG, atau WEBP');
      return;
    }

    setUploadingAvatar(true);
    try {
      const response = await userApi.uploadAvatar(file);
      showMessage('success', 'Avatar berhasil diupload');

      // Update profile data
      if (profileData) {
        setProfileData({
          ...profileData,
          user: {
            ...profileData.user,
            avatar_url: response.data.avatar_url,
          },
        });
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      showMessage('error', error.response?.data?.message || 'Gagal mengupload avatar');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Hapus avatar?')) return;

    try {
      await userApi.deleteAvatar();
      showMessage('success', 'Avatar berhasil dihapus');

      // Update profile data
      if (profileData) {
        setProfileData({
          ...profileData,
          user: {
            ...profileData.user,
            avatar_url: undefined,
          },
        });
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      showMessage('error', 'Gagal menghapus avatar');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await userApi.updateProfile(formData);
      showMessage('success', 'Profil berhasil diperbarui');

      // Refresh profile data
      await fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showMessage('error', error.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
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

  return (
    <DashboardLayout userRole="siswa">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push('/dashboard/siswa/profile')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Kembali ke Profil</span>
          </button>

          <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
          <p className="text-gray-600">Perbarui informasi profil dan preferensi Anda</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p
              className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-900' : 'text-red-900'
              }`}
            >
              {message.text}
            </p>
            <button onClick={() => setMessage(null)} className="ml-auto">
              <X className={`w-4 h-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Foto Profil</h3>
            <div className="flex items-center gap-6">
              {profileData?.user.avatar_url ? (
                <img
                  src={profileData.user.avatar_url}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {profileData?.user.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {uploadingAvatar ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Foto
                      </>
                    )}
                  </button>

                  {profileData?.user.avatar_url && (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG atau WEBP. Maksimal 2MB. Rekomendasi 400x400px
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Informasi Dasar</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.full_name || ''}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData?.user.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih...</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ceritakan tentang diri Anda..."
              />
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Alamat</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kota</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provinsi</label>
                  <input
                    type="text"
                    value={formData.province || ''}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kode Pos</label>
                  <input
                    type="text"
                    value={formData.postal_code || ''}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Pendidikan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tingkat Pendidikan
                </label>
                <input
                  type="text"
                  value={formData.education_level || ''}
                  onChange={(e) => handleInputChange('education_level', e.target.value)}
                  placeholder="S1, S2, D3, dll"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institusi</label>
                <input
                  type="text"
                  value={formData.institution || ''}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  placeholder="Nama universitas/sekolah"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jurusan</label>
                <input
                  type="text"
                  value={formData.major || ''}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Lulus</label>
                <input
                  type="number"
                  value={formData.graduation_year || ''}
                  onChange={(e) => handleInputChange('graduation_year', parseInt(e.target.value))}
                  min="1950"
                  max="2030"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Pekerjaan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
                <input
                  type="text"
                  value={formData.current_job_title || ''}
                  onChange={(e) => handleInputChange('current_job_title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Perusahaan</label>
                <input
                  type="text"
                  value={formData.current_company || ''}
                  onChange={(e) => handleInputChange('current_company', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Learning Goals & Interests */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Tujuan & Minat</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tujuan Belajar
                </label>
                <textarea
                  value={formData.learning_goals || ''}
                  onChange={(e) => handleInputChange('learning_goals', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Apa yang ingin Anda capai?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minat (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => handleInterestsChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Web Development, UI/UX, Mobile Apps"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contoh: Web Development, UI/UX Design, Data Science
                </p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Preferensi</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zona Waktu</label>
                <select
                  value={formData.timezone || 'Asia/Jakarta'}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
                <select
                  value={formData.language_preference || 'id'}
                  onChange={(e) => handleInputChange('language_preference', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Perubahan
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push('/dashboard/siswa/profile')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
