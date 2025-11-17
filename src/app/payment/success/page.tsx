'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CheckCircle, BookOpen, Home, Download } from 'lucide-react';
import { paymentApi } from '@/lib/api/payment';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams.get('payment_id') || searchParams.get('order_id');

  useEffect(() => {
    if (paymentId) {
      checkPaymentStatus();
    } else {
      setLoading(false);
    }
  }, [paymentId]);

  const checkPaymentStatus = async () => {
    try {
      const response = await paymentApi.getPaymentStatus(paymentId!);
      setPayment(response.data);
    } catch (error) {
      console.error('Error checking payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Memverifikasi pembayaran...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pembayaran Berhasil!
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Terima kasih! Pembayaran Anda telah berhasil diproses.
              {payment && payment.metadata && (
                <> Anda sekarang dapat mengakses kursus <strong>{payment.metadata.item_name}</strong>.</>
              )}
            </p>

            {/* Payment Details */}
            {payment && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">Detail Pembayaran</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold text-gray-900">{payment.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metode Pembayaran:</span>
                    <span className="font-semibold text-gray-900">
                      {paymentApi.getPaymentMethodName(payment.payment_method)} - {payment.payment_channel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pembayaran:</span>
                    <span className="font-semibold text-gray-900">
                      {paymentApi.formatAmount(payment.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${
                      payment.status === 'paid' || payment.status === 'settled'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}>
                      {paymentApi.getStatusLabel(payment.status)}
                    </span>
                  </div>
                  {payment.paid_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal Pembayaran:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(payment.paid_at).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {payment && payment.metadata && payment.metadata.item_type === 'course' && (
                <Link
                  href={`/dashboard/siswa/courses/${payment.metadata.item_id}/learn`}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  Mulai Belajar
                </Link>
              )}

              <Link
                href="/dashboard/siswa/courses"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Home className="w-5 h-5" />
                Kursus Saya
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-left">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                Informasi Penting
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Email konfirmasi telah dikirim ke alamat email Anda</li>
                <li>• Invoice dapat diunduh di halaman Kursus Saya</li>
                <li>• Akses kursus berlaku selamanya</li>
                <li>• Sertifikat akan diberikan setelah menyelesaikan kursus</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
