'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Rocket, Check, Target, MessageCircle } from 'lucide-react';

const CareerPathSelector = () => {
  const [selectedPath, setSelectedPath] = useState<'it' | 'techno'>('techno');

  const paths = [
    {
      id: 'it' as const,
      icon: Briefcase,
      title: 'IT PROFESSIONAL',
      subtitle: 'Menjadi Expert Developer',
      description:
        'Path karir menuju posisi Senior Developer, Tech Lead, hingga CTO dengan gaji tinggi di perusahaan tech terkemuka.',
      features: [
        'Deep Technical Skills',
        'Enterprise Architecture',
        'Leadership & Management',
        'High Salary Potential',
      ],
      salary: 'Gaji Target: Rp 15-50M/tahun',
      career: 'Career: Senior → Lead → CTO',
      buttonText: 'Mulai Learning Path',
      buttonColor: 'blue',
    },
    {
      id: 'techno' as const,
      icon: Rocket,
      title: 'TECHNOPRENEUR',
      subtitle: 'Membangun Tech Startup',
      description:
        'Journey lengkap dari validasi ide, build MVP, scale product, hingga fundraising dan exit yang sukses.',
      features: [
        'Product Development',
        'Business & Tech Balance',
        'MVP Development',
        'Startup Ecosystem',
      ],
      salary: 'Potensi: Exit/Funding',
      career: 'Path: Founder → Scale → Exit',
      buttonText: 'Mulai Journey',
      buttonColor: 'green',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pilih Path Karirmu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dapatkan rekomendasi pembelajaran yang dipersonalisasi sesuai tujuan
            karirmu
          </p>
        </motion.div>

        {/* Path Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {paths.map((path, index) => {
            const Icon = path.icon;
            const isSelected = selectedPath === path.id;

            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedPath(path.id)}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-xl'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className={`p-4 rounded-2xl ${
                      isSelected ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        isSelected ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  {path.title}
                </h3>
                <p className="text-blue-600 font-semibold text-center mb-4">
                  {path.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6">
                  {path.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {path.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Career Info */}
                <div className="space-y-2 mb-6 pt-6 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                    {path.salary}
                  </p>
                  <p className="text-sm text-gray-600">{path.career}</p>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                    path.buttonColor === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <Rocket className="w-5 h-5" />
                  <span>{path.buttonText}</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-600 mb-6">
            Belum yakin dengan pilihan path? Mulai dengan assessment gratis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg border-2 border-red-100 hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Assessment Gratis (5 menit)</span>
            </button>
            <button className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-200 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Konsultasi dengan Mentor</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerPathSelector;