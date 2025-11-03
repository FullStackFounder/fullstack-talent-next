'use client';

import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Produk',
      links: [
        { label: 'Kursus', href: '/kursus' },
        { label: 'Mentor', href: '/mentor' },
        { label: 'AI Tools', href: '/ai-tools' },
        { label: 'Sertifikasi', href: '/sertifikasi' },
        { label: 'Aplikasi Mobile', href: '/mobile' },
      ],
    },
    {
      title: 'Untuk Universitas',
      links: [
        { label: 'Dashboard Universitas', href: '/universitas/dashboard' },
        { label: 'Program Partnership', href: '/universitas/partnership' },
        { label: 'Tracking Alumni', href: '/universitas/tracking' },
        { label: 'Request Demo', href: '/universitas/demo' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Panduan Karir', href: '/panduan-karir' },
        { label: 'Success Stories', href: '/success-stories' },
        { label: 'Pusat Bantuan', href: '/bantuan' },
      ],
    },
    {
      title: 'Perusahaan',
      links: [
        { label: 'Tentang Kami', href: '/tentang' },
        { label: 'Tim', href: '/tim' },
        { label: 'Karir', href: '/karir' },
        { label: 'Kontak', href: '/kontak' },
        { label: 'Press', href: '/press' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">
                FullstackTalent
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Platform pengembangan karir terdepan yang membantu mahasiswa dan
              fresh graduate mencapai karir impian melalui pembelajaran
              berkualitas tinggi.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-green-500" />
                <a
                  href="mailto:hello@fullstacktalent.com"
                  className="hover:text-white transition-colors"
                >
                  hello@fullstacktalent.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-green-500" />
                <a
                  href="tel:+6221123 45678"
                  className="hover:text-white transition-colors"
                >
                  +62 21 1234 5678
                </a>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & App Download */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <span className="text-sm">Ikuti Kami:</span>
            <a
              href="https://instagram.com/fullstacktalent"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/fullstacktalent"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="https://tiktok.com/@fullstacktalent"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Download App:</span>
            <a
              href="#"
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.523 15.341c-.736-1.268-1.868-2.008-3.125-2.008-.913 0-1.694.366-2.397.708-.663.323-1.277.62-1.913.62-.632 0-1.244-.295-1.913-.62-.694-.338-1.479-.703-2.397-.703-1.257 0-2.388.74-3.123 2.008-1.076 1.858-1.306 5.352.177 7.819 1.056 1.756 2.508 2.964 3.863 2.964.69 0 1.248-.303 1.848-.622.656-.348 1.405-.744 2.545-.744 1.141 0 1.887.395 2.545.744.599.318 1.159.622 1.848.622 1.355 0 2.807-1.208 3.863-2.964 1.482-2.467 1.253-5.961.176-7.819zm-6.023-5.409c.959 0 1.738-.794 1.738-1.771 0-.104-.009-.208-.026-.308-1.004.103-2.22.691-2.22 1.882 0 .104.009.207.025.303.949-.002 1.492-.063 1.483-1.106zm-1.97 3.068c-.67 0-1.285.281-1.9.622-.653.342-1.237.646-1.806.646-.569 0-1.155-.304-1.808-.646-.615-.341-1.232-.622-1.9-.622-.885 0-1.654.43-2.161 1.176-.771 1.136-1.002 3.268.208 5.211.828 1.333 1.746 2.186 2.652 2.186.437 0 .778-.204 1.176-.42.591-.32 1.264-.682 2.333-.682 1.07 0 1.743.362 2.334.682.398.215.74.42 1.176.42.906 0 1.824-.853 2.652-2.186 1.21-1.943.979-4.075.208-5.211-.507-.746-1.276-1.176-2.161-1.176z" />
              </svg>
              <span className="text-sm">Google Play</span>
            </a>
            <a
              href="#"
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span className="text-sm">App Store</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p>© 2025 FullstackTalent. All rights reserved.</p>
              <span className="inline-flex items-center space-x-1 text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded">
                <span>Made in Indonesia</span>
                <span>🇮🇩</span>
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;