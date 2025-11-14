'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Rocket } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { authApi } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/client';
import type { ForgotPasswordRequest } from '@/types/auth';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [formData, setFormData] = useState<ForgotPasswordRequest>({
      email: '',
    });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authApi.forgotPassword(formData);
      
      if (response.status && response.data) {
        setEmailSent(true);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
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
              Forgot password?
            </h2>
            <p className="text-gray-600">
              No worries, we'll send you reset instructions
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!emailSent ? (
              <>
                {/* Error Alert */}
                {errors.email && (
                  <Alert
                    type="error"
                    message={errors.email}
                    onClose={() => setErrors((prev) => ({ ...prev, email: '' }))}
                    className="mb-6"
                  />
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    error={errors.email}
                    icon={<Mail className="w-5 h-5" />}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Send Reset Link
                  </Button>
                </form>
              </>
            ) : (
              // Success Message
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Check your email
                </h3>
                <p className="text-gray-600 mb-6">
                  If an account exists for {email}, we've sent password reset
                  instructions to your email.
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    Didn't receive the email?{' '}
                    <button
                      onClick={() => {
                        setEmailSent(false);
                        setErrors((prev) => ({ ...prev, email: '' }))
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Try again
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-6">
              <Link
                href="/login"
                className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to login</span>
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Need help?{' '}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-700"
              >
                Contact support
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;