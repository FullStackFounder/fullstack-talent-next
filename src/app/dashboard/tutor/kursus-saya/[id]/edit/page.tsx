'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  BookOpen,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Target,
  Tag,
  ArrowLeft,
  Save,
  AlertCircle,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { courseApi } from '@/lib/api/course';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    price: '',
    discount_price: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    language: 'Indonesia',
    category_id: '',
    thumbnail_url: '',
    preview_video_url: '',
  });

  // Arrays state
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  // Fetch course data on mount
  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const response = await courseApi.getCourseById(courseId);
      const course = response.data;

      // Populate form data
      setFormData({
        title: course.title,
        description: course.description,
        short_description: course.short_description || '',
        price: course.price.toString(),
        discount_price: course.discount_price?.toString() || '',
        level: course.level,
        language: course.language,
        category_id: course.category_id || '',
        thumbnail_url: course.thumbnail_url || '',
        preview_video_url: course.preview_video_url || '',
      });

      // Populate arrays
      setRequirements(course.requirements && course.requirements.length > 0 ? course.requirements : ['']);
      setLearningOutcomes(course.learning_outcomes && course.learning_outcomes.length > 0 ? course.learning_outcomes : ['']);
      setTags(course.tags || []);
    } catch (err: any) {
      setFetchError(err.message || 'Gagal memuat data kursus');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle requirements
  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  // Handle learning outcomes
  const addLearningOutcome = () => {
    setLearningOutcomes([...learningOutcomes, '']);
  };

  const updateLearningOutcome = (index: number, value: string) => {
    const updated = [...learningOutcomes];
    updated[index] = value;
    setLearningOutcomes(updated);
  };

  const removeLearningOutcome = (index: number) => {
    if (learningOutcomes.length > 1) {
      setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
    }
  };

  // Handle tags
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul kursus wajib diisi';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Judul minimal 10 karakter';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Judul maksimal 255 karakter';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi wajib diisi';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Deskripsi minimal 50 karakter';
    }

    if (!formData.price) {
      newErrors.price = 'Harga wajib diisi';
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = 'Harga tidak boleh negatif';
    }

    if (formData.discount_price) {
      const price = parseFloat(formData.price);
      const discountPrice = parseFloat(formData.discount_price);
      if (discountPrice < 0) {
        newErrors.discount_price = 'Harga diskon tidak boleh negatif';
      } else if (discountPrice >= price) {
        newErrors.discount_price = 'Harga diskon harus lebih kecil dari harga normal';
      }
    }

    if (formData.short_description && formData.short_description.length > 500) {
      newErrors.short_description = 'Deskripsi singkat maksimal 500 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // Prepare data
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        short_description: formData.short_description.trim() || undefined,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : undefined,
        level: formData.level,
        language: formData.language || undefined,
        category_id: formData.category_id || undefined,
        thumbnail_url: formData.thumbnail_url || undefined,
        preview_video_url: formData.preview_video_url || undefined,
        requirements: requirements.filter(r => r.trim()).length > 0
          ? requirements.filter(r => r.trim())
          : undefined,
        learning_outcomes: learningOutcomes.filter(l => l.trim()).length > 0
          ? learningOutcomes.filter(l => l.trim())
          : undefined,
        tags: tags.length > 0 ? tags : undefined,
      };

      await courseApi.updateCourse(courseId, courseData);

      // Redirect to course detail page
      router.push(`/dashboard/tutor/kursus-saya/${courseId}`);
    } catch (err: any) {
      console.error('Failed to update course:', err);
      alert(err.message || 'Gagal mengupdate kursus. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  // Loading state while fetching course data
  if (loading) {
    return (
      <DashboardLayout userRole="tutor">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Memuat data kursus...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <DashboardLayout userRole="tutor">
        <div className="max-w-4xl mx-auto py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium text-lg">Gagal memuat data kursus</h3>
              <p className="text-red-700 mt-1">{fetchError}</p>
              <button
                onClick={() => router.push('/dashboard/tutor/kursus-saya')}
                className="mt-4 text-red-700 font-medium hover:underline"
              >
                Kembali ke Kursus Saya
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="tutor">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/dashboard/tutor/kursus-saya/${courseId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Kursus</h1>
            <p className="text-gray-600 mt-1">Perbarui informasi kursus Anda</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Informasi Dasar</h2>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Kursus <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: Complete Web Development Bootcamp 2025"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.title.length}/255 karakter (minimal 10)
                </p>
              </div>

              {/* Short Description */}
              <div>
                <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Singkat
                </label>
                <input
                  type="text"
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.short_description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ringkasan singkat tentang kursus ini"
                />
                {errors.short_description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.short_description}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.short_description.length}/500 karakter
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Jelaskan secara detail tentang kursus ini"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.description.length} karakter (minimal 50)
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Harga</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Normal <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="299000"
                    min="0"
                    step="1000"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Discount Price */}
              <div>
                <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Diskon (Opsional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    id="discount_price"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.discount_price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="199000"
                    min="0"
                    step="1000"
                  />
                </div>
                {errors.discount_price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.discount_price}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Detail Kursus</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Level */}
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Pemula (Beginner)</option>
                  <option value="intermediate">Menengah (Intermediate)</option>
                  <option value="advanced">Lanjutan (Advanced)</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  Bahasa
                </label>
                <input
                  type="text"
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Indonesia"
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ImageIcon className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Media</h2>
            </div>

            <div className="space-y-4">
              {/* Thumbnail URL */}
              <div>
                <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Thumbnail
                </label>
                <input
                  type="url"
                  id="thumbnail_url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              {/* Preview Video URL */}
              <div>
                <label htmlFor="preview_video_url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Video Preview
                </label>
                <input
                  type="url"
                  id="preview_video_url"
                  name="preview_video_url"
                  value={formData.preview_video_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/preview-video.mp4"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Target className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Persyaratan</h2>
                  <p className="text-sm text-gray-500">Apa yang perlu disiapkan siswa?</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addRequirement}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>

            <div className="space-y-3">
              {requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: Memiliki komputer dengan koneksi internet"
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Hasil Pembelajaran</h2>
                  <p className="text-sm text-gray-500">Apa yang akan siswa pelajari?</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addLearningOutcome}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>

            <div className="space-y-3">
              {learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => updateLearningOutcome(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: Membangun website responsive dengan HTML dan CSS"
                  />
                  {learningOutcomes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLearningOutcome(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Tag className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tags</h2>
                <p className="text-sm text-gray-500">Kata kunci untuk memudahkan pencarian</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ketik tag dan tekan Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tambah
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/tutor/kursus-saya/${courseId}`)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
