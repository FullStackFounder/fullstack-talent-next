'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Rocket, Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { authApi } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/client';
import type { ResetPasswordRequest } from '@/types/auth';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrors({
        general: 'Invalid or missing reset token. Please request a new reset link.',
      });
    }
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authApi.resetPassword(
        token,
        formData.password,
        formData.confirmPassword
      );
      setResetSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          setErrors({
            general:
              'Invalid or expired reset token. Please request a new reset link.',
          });
        } else if (error.errors) {
          setErrors(error.errors);
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-600">
                FullstackTalent
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Reset your password
            </h2>
            <p className="text-gray-600">
              Enter your new password below
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!resetSuccess ? (
              <>
                {/* Error Alert */}
                {errors.general && (
                  <Alert
                    type="error"
                    message={errors.general}
                    onClose={() => setErrors({ ...errors, general: '' })}
                    className="mb-6"
                  />
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Password */}
                  <div className="relative">
                    <Input
                      label="New Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      icon={<Lock className="w-5 h-5" />}
                      required
                      disabled={isLoading || !token}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <Input
                      label="Confirm New Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      icon={<Lock className="w-5 h-5" />}
                      required
                      disabled={isLoading || !token}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Password must:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle
                          className={`w-4 h-4 ${
                            formData.password.length >= 8
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <span>Be at least 8 characters long</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle
                          className={`w-4 h-4 ${
                            formData.password === formData.confirmPassword &&
                            formData.password.length > 0
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <span>Match the confirmation password</span>
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={!token}
                  >
                    Reset Password
                  </Button>
                </form>
              </>
            ) : (
              // Success Message
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Password reset successful!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your password has been successfully reset. You can now login
                  with your new password.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  variant="primary"
                  size="md"
                >
                  Go to Login
                </Button>
              </div>
            )}

            {/* Back to Login */}
            {!resetSuccess && (
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Back to login
                </Link>
              </div>
            )}
          </div>

          {/* Help Text */}
          {!resetSuccess && (
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Token expired?{' '}
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Request a new one
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;