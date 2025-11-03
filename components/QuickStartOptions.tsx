'use client';

import { motion } from 'framer-motion';
import { Target, Video, MessageCircle, BookOpen, BadgeCheck } from 'lucide-react';

const QuickStartOptions = () => {
  const options = [
    {
      icon: BadgeCheck,
      title: 'Free Assessment',
      description: 'Evaluasi skill level mu sekarang',
      cta: 'Mulai Assessment',
      badge: 'FREE',
      color: 'blue',
    },
    {
      icon: Video,
      title: 'Live Demo Class',
      description: 'Join kelas trial gratis minggu ini',
      cta: 'Daftar Demo',
      color: 'purple',
    },
    {
      icon: MessageCircle,
      title: '1-on-1 Mentoring',
      description: 'Konsultasi career path dengan mentor',
      cta: 'Book Konsultasi',
      color: 'green',
    },
    {
      icon: BookOpen,
      title: 'Learning Roadmap',
      description: 'Download panduan belajar personalized',
      cta: 'Download Guide',
      color: 'orange',
    },
  ];

  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      hover: 'hover:bg-blue-100',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      hover: 'hover:bg-purple-100',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      hover: 'hover:bg-green-100',
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      hover: 'hover:bg-orange-100',
    },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 mb-4">
            <Target className="w-6 h-6 text-red-600" />
            <h2 className="text-4xl font-bold text-gray-900">
              Quick Start Options
            </h2>
          </div>
        </motion.div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((option, index) => {
            const Icon = option.icon;
            const colors = colorMap[option.color as keyof typeof colorMap];

            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                {/* Badge */}
                {option.badge && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                    {option.badge}
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`inline-flex p-4 rounded-xl ${colors.bg} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-8 h-8 ${colors.icon}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-6">{option.description}</p>

                {/* CTA */}
                <button className="w-full py-3 text-gray-900 font-semibold hover:text-blue-600 transition-colors duration-300 text-left">
                  {option.cta} →
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickStartOptions;