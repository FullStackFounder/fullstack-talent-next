'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { enrollmentApi } from '@/lib/api/enrollment';
import {
  Award,
  Download,
  Calendar,
  CheckCircle,
  Loader2,
  Share2,
  ExternalLink,
  Trophy,
  Star,
  Lock,
  BookOpen,
  Clock,
  GraduationCap
} from 'lucide-react';

interface Certificate {
  enrollment_id: string;
  course_id: string;
  course_title: string;
  course_slug: string;
  thumbnail_url: string;
  tutor_name: string;
  completed_at: string;
  certificate_url?: string;
  progress_percentage: number;
  total_lessons: number;
  time_spent_hours: number;
  level: string;
  category_name?: string;
}

export default function CertificatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      // Get completed courses
      const response = await enrollmentApi.getMyCourses({ status: 'completed' });
      const completedCourses = response.data || [];

      // Transform to certificate format
      const certs: Certificate[] = completedCourses.map((enrollment: any) => ({
        enrollment_id: enrollment.id,
        course_id: enrollment.enrollable_id,
        course_title: enrollment.course_title,
        course_slug: enrollment.course_slug,
        thumbnail_url: enrollment.thumbnail_url,
        tutor_name: enrollment.tutor_name,
        completed_at: enrollment.completed_at,
        progress_percentage: enrollment.progress_percentage,
        total_lessons: enrollment.total_lessons,
        time_spent_hours: enrollment.progress_stats?.time_spent_hours || 0,
        level: enrollment.level,
        category_name: enrollment.category_name,
      }));

      setCertificates(certs);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (enrollmentId: string) => {
    setDownloadingId(enrollmentId);
    try {
      const response = await enrollmentApi.getCertificate(enrollmentId);

      if (response.data.certificate_url) {
        // Open certificate in new tab for download
        window.open(response.data.certificate_url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Gagal mengunduh sertifikat');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleShareCertificate = (certificate: Certificate) => {
    const shareText = `Saya telah menyelesaikan kursus "${certificate.course_title}" di FullstackTalent!`;
    const shareUrl = `${window.location.origin}/courses/${certificate.course_slug}`;

    if (navigator.share) {
      navigator.share({
        title: certificate.course_title,
        text: shareText,
        url: shareUrl,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const getLevelBadge = (level: string) => {
    const badges = {
      beginner: { bg: 'bg-green-100', text: 'text-green-700', label: 'Beginner' },
      intermediate: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Intermediate' },
      advanced: { bg: 'bg-red-100', text: 'text-red-700', label: 'Advanced' },
      expert: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Expert' },
    };
    const badge = badges[level as keyof typeof badges] || badges.beginner;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sertifikat Saya</h1>
              <p className="text-gray-600">Koleksi pencapaian pembelajaran Anda</p>
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Certificates */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Sertifikat</p>
                <p className="text-4xl font-bold mt-2">{certificates.length}</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Total Learning Hours */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jam Belajar</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {certificates.reduce((sum, cert) => sum + cert.time_spent_hours, 0).toFixed(0)}h
                </p>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Lessons Completed */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {certificates.reduce((sum, cert) => sum + cert.total_lessons, 0)}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Certificates List */}
        {certificates.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum Ada Sertifikat
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Selesaikan kursus untuk mendapatkan sertifikat yang dapat Anda unduh dan bagikan.
            </p>
            <button
              onClick={() => router.push('/dashboard/siswa/courses')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Lihat Kursus Saya
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certificates.map((certificate) => (
              <div
                key={certificate.enrollment_id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Certificate Card Header with Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <img
                      src={certificate.thumbnail_url || '/placeholder-course.jpg'}
                      alt={certificate.course_title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Certificate Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                      <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                  </div>

                  {/* Verified Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white bg-opacity-90 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-gray-900">Verified</span>
                    </div>
                  </div>

                  {/* Completion Level */}
                  <div className="absolute top-4 left-4">
                    {getLevelBadge(certificate.level)}
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {certificate.course_title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span>Tutor: {certificate.tutor_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Selesai: {formatDate(certificate.completed_at)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{certificate.time_spent_hours.toFixed(1)}h belajar</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{certificate.total_lessons} lessons</span>
                    </div>
                  </div>

                  {/* Achievement Stats */}
                  <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-green-700 font-medium">Completion</p>
                      <p className="text-lg font-bold text-green-900">
                        {Math.round(certificate.progress_percentage)}%
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadCertificate(certificate.enrollment_id)}
                      disabled={downloadingId === certificate.enrollment_id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingId === certificate.enrollment_id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm font-medium">Loading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-medium">Download</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleShareCertificate(certificate)}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Share Certificate"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => router.push(`/courses/${certificate.course_slug}`)}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="View Course"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        {certificates.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Tips Memanfaatkan Sertifikat
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tambahkan ke LinkedIn untuk meningkatkan profil profesional Anda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Lampirkan dalam CV atau portfolio untuk melamar pekerjaan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Bagikan di media sosial untuk menginspirasi orang lain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Gunakan sebagai bukti kompetensi dalam wawancara kerja</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
