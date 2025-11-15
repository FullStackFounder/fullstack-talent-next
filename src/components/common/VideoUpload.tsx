'use client';

import { useState, useRef } from 'react';
import { Upload, X, Video as VideoIcon, Loader2, Play, ExternalLink } from 'lucide-react';

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  allowExternalUrl?: boolean;
}

export default function VideoUpload({
  value,
  onChange,
  onRemove,
  label = 'Upload Video',
  accept = 'video/*',
  maxSizeMB = 100,
  allowExternalUrl = true,
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('url');
  const [externalUrl, setExternalUrl] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('File harus berupa video');
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`Ukuran file maksimal ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const url = URL.createObjectURL(file);
      setPreview(url);

      // In a real implementation, upload to your video hosting service
      // (e.g., AWS S3, Cloudinary, Bunny CDN, etc.)
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock URL - in production, this would be the hosted video URL
      onChange(url);
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah video');
    } finally {
      setUploading(false);
    }
  };

  const handleExternalUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!externalUrl.trim()) {
      setError('URL video tidak boleh kosong');
      return;
    }

    // Basic URL validation
    try {
      new URL(externalUrl);
    } catch {
      setError('URL tidak valid');
      return;
    }

    setError(null);
    setPreview(externalUrl);
    onChange(externalUrl);
  };

  const handleRemove = () => {
    setPreview(null);
    setExternalUrl('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getVideoId = (url: string): string | null => {
    // Extract YouTube ID
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) return youtubeMatch[1];

    // Extract Vimeo ID
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return vimeoMatch[1];

    return null;
  };

  const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeoUrl = (url: string) => url.includes('vimeo.com');

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {allowExternalUrl && !preview && (
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
              uploadMode === 'url'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <ExternalLink className="w-4 h-4 inline mr-2" />
            URL Video
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
              uploadMode === 'file'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload File
          </button>
        </div>
      )}

      {preview ? (
        <div className="relative group">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-black">
            {isYouTubeUrl(preview) && getVideoId(preview) ? (
              <iframe
                src={`https://www.youtube.com/embed/${getVideoId(preview)}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isVimeoUrl(preview) && getVideoId(preview) ? (
              <iframe
                src={`https://player.vimeo.com/video/${getVideoId(preview)}`}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={preview}
                controls
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            )}
            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 truncate">{preview}</p>
        </div>
      ) : uploadMode === 'url' && allowExternalUrl ? (
        <form onSubmit={handleExternalUrlSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... atau https://vimeo.com/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              Mendukung YouTube, Vimeo, atau URL video langsung
            </p>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambahkan Video
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="relative w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-sm text-gray-600">Mengunggah video...</p>
                <p className="text-xs text-gray-500">Ini mungkin memakan waktu beberapa menit</p>
              </>
            ) : (
              <>
                <div className="p-3 bg-gray-100 rounded-full">
                  <VideoIcon className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">
                    <Upload className="w-4 h-4 inline mr-1" />
                    Klik untuk upload video
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, WebM, MOV (max {maxSizeMB}MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {uploadMode === 'file' && !preview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            💡 Tip: Untuk video yang lebih besar, kami sarankan menggunakan YouTube atau Vimeo untuk hosting yang lebih baik.
          </p>
        </div>
      )}
    </div>
  );
}