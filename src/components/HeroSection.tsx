'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, Building2, Star, Play, Target } from 'lucide-react';
import Image from 'next/image';

const HeroSection = () => {
  const stats = [
    {
      icon: Users,
      value: '25,000+',
      label: 'Alumni Sukses',
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: 'Job Placement',
    },
    {
      icon: Building2,
      value: '500+',
      label: 'Partner Companies',
    },
    {
      icon: Star,
      value: '4.9⭐',
      label: 'Rating Platform',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50/30 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium mb-6"
            >
              <Target className="w-4 h-4" />
              <span>Platform Pembelajaran & Mentoring Karir Tech #1 Indonesia</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Luncurkan Karirmu di{' '}
              <span className="text-blue-600">Dunia Tech</span>{' '}
              <span className="inline-block">🚀</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              Platform pembelajaran #1 untuk developer Indonesia dengan mentor
              terbaik dan kurikulum industry-ready. Join 25,000+ alumni yang
              sukses!
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="group px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-green-600/30">
                <Target className="w-5 h-5" />
                <span>Ambil Assessment Gratis</span>
              </button>
              <button className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Tonton Demo</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            {/* Rating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 z-10"
            >
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-900">4.9/5</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">25,000+ Reviews</div>
            </motion.div>

            {/* Dashboard Image Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 to-green-600 p-1">
              <div className="bg-white rounded-xl p-4">
                {/* Placeholder for dashboard image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-500 to-green-500 rounded-lg relative overflow-hidden">
                  {/* Dashboard cards simulation */}
                  <div className="absolute inset-0 p-6 grid grid-cols-3 gap-3">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Placement Stat Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-green-100"
            >
              <div className="text-5xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-sm text-gray-600 font-medium">
                Job Placement
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full filter blur-3xl opacity-20 -z-10" />
    </section>
  );
};

export default HeroSection;