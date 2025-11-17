'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { XCircle, Home, RotateCcw, HelpCircle } from 'lucide-react';
import { paymentApi } from '@/lib/api/payment';

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams.get('payment_id') || searchParams.get('order_id');
  const reason = searchParams.get('reason') || 'Pembayaran tidak dapat diproses';

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
            <p className="text-gray-600 mt-4">Memeriksa status pembayaran...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isExpired = payment && payment.status === 'expired';
  const isCancelled = payment && payment.status === 'cancelled';

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Failure Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>

            {/* Failure Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {isExpired ? 'Pembayaran Kadaluarsa' : isCancelled ? 'Pembayaran Dibatalkan' : 'Pembayaran Gagal'}
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              {isExpired
                ? 'Maaf, batas waktu pembayaran telah habis. Silakan lakukan pemesanan ulang.'
                : isCancelled
                ? 'Pembayaran telah dibatalkan. Anda dapat mencoba lagi kapan saja.'
                : reason}
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
                  {payment.metadata && payment.metadata.item_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Item:</span>
                      <span className="font-semibold text-gray-900">{payment.metadata.item_name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold text-gray-900">
                      {paymentApi.formatAmount(payment.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-red-600">
                      {paymentApi.getStatusLabel(payment.status)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {payment && payment.metadata && payment.metadata.item_id && (
                <Link
                  href={`/payment/course/${payment.metadata.item_id}`}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Coba Lagi
                </Link>
              )}

              <Link
                href="/kursus"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Home className="w-5 h-5" />
                Kembali ke Kursus
              </Link>
            </div>

            {/* Help Section */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-left">
              <div className="flex gap-3">
                <HelpCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2 text-sm">
                    Butuh Bantuan?
                  </h4>
                  <p className="text-xs text-yellow-700 mb-3">
                    Jika Anda mengalami masalah dengan pembayaran, tim support kami siap membantu Anda.
                  </p>
                  <div className="space-y-2 text-xs">
                    <p className="text-yellow-700">
                      <strong>Kemungkinan penyebab:</strong>
                    </p>
                    <ul className="list-disc list-inside text-yellow-700 space-y-1">
                      <li>Saldo tidak mencukupi</li>
                      <li>Koneksi internet terputus</li>
                      <li>Informasi pembayaran tidak valid</li>
                      <li>Batas waktu pembayaran habis</li>
                    </ul>
                  </div>
                  <Link
                    href="/kontak"
                    className="inline-block mt-4 text-xs text-yellow-800 hover:text-yellow-900 font-medium underline"
                  >
                    Hubungi Support →
                  </Link>
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
