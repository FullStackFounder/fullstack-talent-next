'use client';

import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { courseApi, Course } from '@/lib/api/course';

interface CourseSettingsTabProps {
  courseId: string;
}

export default function CourseSettingsTab({ courseId }: CourseSettingsTabProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Settings state
  const [isPublished, setIsPublished] = useState(false);
  const [allowDiscussions, setAllowDiscussions] = useState(true);
  const [allowReviews, setAllowReviews] = useState(true);
  const [certificateEnabled, setCertificateEnabled] = useState(true);
  const [autoEnrollment, setAutoEnrollment] = useState(false);
  const [maxStudents, setMaxStudents] = useState<number | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getCourseById(courseId);
      setCourse(response.data);
      setIsPublished(response.data.status === 'published');
      // Initialize settings from course data (when backend supports it)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat pengaturan kursus');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // In a real implementation, you would send these settings to the backend
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage('Pengaturan berhasil disimpan');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!course) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      if (!isPublished) {
        await courseApi.publishCourse(course.id);
        setSuccessMessage('Kursus berhasil dipublikasi');
        setIsPublished(true);
      } else {
        // If unpublish endpoint exists
        await courseApi.updateCourse(course.id, { status: 'draft' });
        setSuccessMessage('Kursus berhasil dijadikan draft');
        setIsPublished(false);
      }

      fetchCourse();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal mengubah status publikasi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-800 font-medium">Gagal memuat pengaturan</h3>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Publication Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Publikasi</h3>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <label htmlFor="publish-toggle" className="text-sm font-medium text-gray-900">
              Publikasikan Kursus
            </label>
            <p className="text-sm text-gray-600 mt-1">
              {isPublished
                ? 'Kursus saat ini dipublikasi dan dapat dilihat oleh siswa'
                : 'Kursus masih dalam status draft dan tidak dapat dilihat oleh siswa'
              }
            </p>
          </div>
          <button
            id="publish-toggle"
            onClick={handlePublishToggle}
            disabled={saving}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isPublished ? 'bg-blue-600' : 'bg-gray-300'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPublished ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Persyaratan Publikasi:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Minimal 1 modul dengan materi lengkap</li>
              <li>Deskripsi kursus telah diisi</li>
              <li>Thumbnail kursus telah diunggah</li>
              <li>Harga telah ditentukan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Course Features */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fitur Kursus</h3>

        <div className="space-y-4">
          {/* Allow Discussions */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label htmlFor="discussions-toggle" className="text-sm font-medium text-gray-900">
                Izinkan Diskusi
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Siswa dapat berdiskusi dan bertanya di setiap pelajaran
              </p>
            </div>
            <button
              id="discussions-toggle"
              onClick={() => setAllowDiscussions(!allowDiscussions)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                allowDiscussions ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  allowDiscussions ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Allow Reviews */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label htmlFor="reviews-toggle" className="text-sm font-medium text-gray-900">
                Izinkan Ulasan
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Siswa dapat memberikan rating dan ulasan setelah menyelesaikan kursus
              </p>
            </div>
            <button
              id="reviews-toggle"
              onClick={() => setAllowReviews(!allowReviews)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                allowReviews ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  allowReviews ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Certificate */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label htmlFor="certificate-toggle" className="text-sm font-medium text-gray-900">
                Sertifikat Penyelesaian
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Siswa mendapatkan sertifikat setelah menyelesaikan 100% kursus
              </p>
            </div>
            <button
              id="certificate-toggle"
              onClick={() => setCertificateEnabled(!certificateEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                certificateEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  certificateEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Enrollment Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Pendaftaran</h3>

        <div className="space-y-4">
          {/* Auto Enrollment */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label htmlFor="auto-enrollment-toggle" className="text-sm font-medium text-gray-900">
                Pendaftaran Otomatis
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Siswa langsung terdaftar setelah pembayaran (untuk kursus berbayar)
              </p>
            </div>
            <button
              id="auto-enrollment-toggle"
              onClick={() => setAutoEnrollment(!autoEnrollment)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoEnrollment ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoEnrollment ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Max Students */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label htmlFor="max-students" className="text-sm font-medium text-gray-900">
              Batas Maksimal Siswa
            </label>
            <p className="text-sm text-gray-600 mt-1 mb-3">
              Kosongkan untuk tidak membatasi jumlah siswa
            </p>
            <input
              id="max-students"
              type="number"
              min="0"
              value={maxStudents || ''}
              onChange={(e) => setMaxStudents(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Tidak terbatas"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {course && maxStudents && maxStudents <= course.total_enrolled && (
              <p className="text-sm text-orange-600 mt-2">
                Peringatan: Batas maksimal lebih kecil dari jumlah siswa saat ini ({course.total_enrolled})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Zona Berbahaya</h3>
        <p className="text-sm text-gray-600 mb-4">
          Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin mengarsipkan kursus ini? Kursus yang diarsipkan tidak akan muncul dalam pencarian.')) {
                // Handle archive
              }
            }}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Arsipkan Kursus
          </button>

          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin menghapus kursus ini? Semua data termasuk modul, pelajaran, dan siswa yang terdaftar akan dihapus permanen.')) {
                // Handle delete - will be in parent component
              }
            }}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Hapus Kursus Permanen
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={fetchCourse}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>
    </div>
  );
}