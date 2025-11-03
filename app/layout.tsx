import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'FullstackTalent - Platform Pembelajaran & Mentoring Karir Tech #1 Indonesia',
  description:
    'Platform pembelajaran #1 untuk developer Indonesia dengan mentor terbaik dan kurikulum industry-ready. Join 25,000+ alumni yang sukses!',
  keywords:
    'coding bootcamp, tech education, developer training, IT career, technopreneur, Indonesia',
  openGraph: {
    title: 'FullstackTalent - Luncurkan Karirmu di Dunia Tech',
    description:
      'Platform pembelajaran #1 untuk developer Indonesia dengan mentor terbaik dan kurikulum industry-ready.',
    images: ['/og-image.jpg'],
    siteName: 'FullstackTalent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FullstackTalent - Luncurkan Karirmu di Dunia Tech',
    description:
      'Platform pembelajaran #1 untuk developer Indonesia dengan mentor terbaik dan kurikulum industry-ready.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}