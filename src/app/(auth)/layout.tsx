import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - FullstackTalent',
  description: 'Login atau daftar untuk mengakses platform pembelajaran FullstackTalent',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {children}
    </div>
  );
}