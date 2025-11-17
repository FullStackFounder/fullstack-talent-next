'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  CreditCard,
  Smartphone,
  Building2,
  Store,
  QrCode,
  CheckCircle,
  ArrowLeft,
  Shield,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { courseApi } from '@/lib/api/course';
import { paymentApi, CreatePaymentData } from '@/lib/api/payment';
import { authApi } from '@/lib/api/auth';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('bank_transfer');
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchCourse();
  }, [courseId]);

  const checkAuth = () => {
    const userData = authApi.getCurrentUser();
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    setUser(userData);
  };

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await courseApi.getCourse(courseId);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Kursus tidak ditemukan');
      router.push('/kursus');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedChannel && selectedMethod !== 'qris' && selectedMethod !== 'credit_card') {
      alert('Pilih metode pembayaran terlebih dahulu');
      return;
    }

    setProcessing(true);
    try {
      const finalPrice = course.discount_price || course.price;

      const paymentData: CreatePaymentData = {
        item_type: 'course',
        item_id: courseId,
        item_name: course.title,
        amount: finalPrice,
        payment_method: selectedMethod as any,
        payment_channel: selectedChannel || undefined,
        description: `Pembayaran untuk kursus: ${course.title}`,
      };

      const response = await paymentApi.createPayment(paymentData);

      // Redirect to Xendit payment page
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        throw new Error('Payment URL tidak ditemukan');
      }
    } catch (error: any) {
      alert(error.message || 'Gagal membuat pembayaran');
      setProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Transfer Bank',
      icon: Building2,
      description: 'Virtual Account BCA, BNI, BRI, Mandiri, Permata',
    },
    {
      id: 'e_wallet',
      name: 'E-Wallet',
      icon: Smartphone,
      description: 'OVO, DANA, LinkAja, ShopeePay',
    },
    {
      id: 'qris',
      name: 'QRIS',
      icon: QrCode,
      description: 'Scan QR Code dengan aplikasi bank atau e-wallet',
    },
    {
      id: 'credit_card',
      name: 'Kartu Kredit',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB',
    },
    {
      id: 'retail_outlet',
      name: 'Retail Outlet',
      icon: Store,
      description: 'Alfamart, Indomaret',
    },
  ];

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!course) {
    return null;
  }

  const finalPrice = course.discount_price || course.price;
  const adminFee = Math.ceil(finalPrice * 0.015); // 1.5% admin fee
  const totalAmount = finalPrice + adminFee;

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href={`/kursus/${course.slug}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Detail Kursus
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content - Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Pilih Metode Pembayaran
                </h1>

                {/* Payment Methods */}
                <div className="space-y-4 mb-8">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => {
                          setSelectedMethod(method.id);
                          setSelectedChannel('');
                        }}
                        className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                          selectedMethod === method.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${
                            selectedMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              selectedMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {method.name}
                              </h3>
                              {selectedMethod === method.id && (
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Channels */}
                {(selectedMethod === 'bank_transfer' || selectedMethod === 'e_wallet' || selectedMethod === 'retail_outlet') && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Pilih {selectedMethod === 'bank_transfer' ? 'Bank' : selectedMethod === 'e_wallet' ? 'E-Wallet' : 'Outlet'}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {paymentApi.getPaymentChannels(selectedMethod).map((channel) => (
                        <button
                          key={channel.code}
                          onClick={() => setSelectedChannel(channel.code)}
                          className={`p-4 border-2 rounded-lg text-center transition-all ${
                            selectedChannel === channel.code
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900 mb-1">
                            {channel.code}
                          </div>
                          <div className="text-xs text-gray-600">
                            {channel.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Pembayaran Aman
                      </h4>
                      <p className="text-sm text-blue-700">
                        Pembayaran Anda diproses oleh Xendit, gateway pembayaran terpercaya di Indonesia.
                        Data kartu dan informasi pribadi Anda terenkripsi dan aman.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Ringkasan Pesanan
                  </h3>

                  {/* Course Info */}
                  <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                        {course.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        by {course.tutor_name}
                      </p>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Harga Kursus</span>
                      <span className="font-semibold text-gray-900">
                        {paymentApi.formatAmount(finalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Biaya Admin (1.5%)</span>
                      <span className="font-semibold text-gray-900">
                        {paymentApi.formatAmount(adminFee)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-2xl text-blue-600">
                        {paymentApi.formatAmount(totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={processing || (!selectedChannel && selectedMethod !== 'qris' && selectedMethod !== 'credit_card')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      'Bayar Sekarang'
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-500">
                    Dengan melanjutkan, Anda menyetujui{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Syarat & Ketentuan
                    </Link>{' '}
                    kami
                  </p>
                </div>

                {/* Payment Expiry Notice */}
                <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-1 text-sm">
                        Batas Waktu Pembayaran
                      </h4>
                      <p className="text-xs text-yellow-700">
                        Selesaikan pembayaran dalam 24 jam setelah memilih metode pembayaran.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Help Notice */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Butuh Bantuan?
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        Hubungi tim support kami jika mengalami kendala dalam pembayaran.
                      </p>
                      <Link
                        href="/kontak"
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Hubungi Support →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
