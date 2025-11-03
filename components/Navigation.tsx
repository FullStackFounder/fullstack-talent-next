'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const Navigation = () => {
  const [isProgramOpen, setIsProgramOpen] = useState(false);

  const programItems = [
    { label: 'Kursus Bersertifikat', href: '/kursus' },
    { label: 'Bootcamp', href: '/bootcamp' },
    { label: 'Kelas Privat', href: '/kelas-privat' },
    { label: '1-on-1 Mentoring', href: '/mentoring' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
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
            <span className="text-xl font-bold text-blue-600">
              FullstackTalent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-900 font-medium border-b-2 border-blue-600 pb-1"
            >
              Beranda
            </Link>

            {/* Program Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsProgramOpen(true)}
              onMouseLeave={() => setIsProgramOpen(false)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium">
                <span>Program</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isProgramOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  {programItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Blog
            </Link>
            <Link
              href="/panduan-karir"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Panduan Karir
            </Link>
            <Link
              href="/kontak"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Kontak
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Daftar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;