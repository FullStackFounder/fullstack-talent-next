'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  aspectRatio?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  label = 'Upload Image',
  accept = 'image/*',
  maxSizeMB = 5,
  aspectRatio = '16/9',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // In a real implementation, upload to your storage service
      // For now, we'll use the data URL
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock URL - in production, this would be the uploaded file URL
      const mockUrl = URL.createObjectURL(file);
      onChange(mockUrl);
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
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

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative group">
          <div
            className="relative w-full rounded-lg overflow-hidden border-2 border-gray-200"
            style={{ aspectRatio }}
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="relative w-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ aspectRatio }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-sm text-gray-600">Mengunggah...</p>
              </>
            ) : (
              <>
                <div className="p-3 bg-gray-100 rounded-full">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">
                    <Upload className="w-4 h-4 inline mr-1" />
                    Klik untuk upload
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WEBP (max {maxSizeMB}MB)
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
    </div>
  );
}