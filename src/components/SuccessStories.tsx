'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Briefcase, Rocket, BarChart3 } from 'lucide-react';
import Image from 'next/image';

const SuccessStories = () => {
  const [activeTab, setActiveTab] = useState<'it' | 'techno' | 'stats'>('it');

  const tabs = [
    { id: 'it' as const, label: 'IT Professional Success', icon: Briefcase },
    { id: 'techno' as const, label: 'Technopreneur Success', icon: Rocket },
    { id: 'stats' as const, label: 'Impact Statistics', icon: BarChart3 },
  ];

  const itStories = [
    {
      initials: 'BS',
      name: 'Budi Santoso',
      position: 'Lead Engineer @ Gojek',
      company: 'Gojek',
      quote:
        'Kurikulum FullstackTalent benar-benar industry-ready. Interview di Gojek jadi mudah karena sudah paham system design dengan baik.',
      background: 'Lulusan Teknik Informatika, stuck di Junior Developer 3 tahun',
      journey: 'Ikut Senior Fullstack Track, fokus di React & System Design',
      result: 'Dari Rp 6M → Rp 28M dalam 18 bulan, promoted ke Lead Engineer',
    },
    {
      initials: 'SD',
      name: 'Sari Dewi',
      position: 'Principal Engineer @ Tokopedia',
      company: 'Tokopedia',
      quote:
        'Mentoring di FullstackTalent helped me navigate career transitions smoothly. Dari zero coding experience jadi Principal Engineer.',
      background: 'Career switcher dari Marketing, mulai belajar coding umur 28',
      journey: 'Full Stack → Senior → Tech Lead → Principal dalam 4 tahun',
      result: 'Sekarang lead team 15 engineers, salary Rp 45M/tahun',
    },
    {
      initials: 'AP',
      name: 'Andi Pratama',
      position: 'Engineering Manager @ Shopee',
      company: 'Shopee',
      quote:
        'Program FullstackTalent tidak hanya mengajarkan technical skills tapi juga soft skills yang needed untuk leadership.',
      background: 'Fresh graduate yang kesulitan dapat kerja pertama',
      journey: 'Complete Fullstack Program + Leadership Track',
      result: 'Hired as Senior, promoted to EM dalam 2 tahun',
    },
  ];

  const technoStories = [
    {
      initials: 'AR',
      name: 'Ahmad Rizki',
      position: 'Founder @ FoodieApp (Acquired by GoFood)',
      company: 'GoFood',
      quote:
        "FullstackTalent didn't just teach me coding, but how to think like a tech CEO. The business + tech combination was perfect.",
      background: 'Fresh graduate tanpa experience, punya ide food delivery app',
      journey: 'MVP Bootcamp → Growth Hacking → Series A → Acquisition',
      result: 'Exit valuation Rp 150B setelah 3 tahun, sekarang VP Product di Gojek',
    },
    {
      initials: 'MC',
      name: 'Maya Chen',
      position: 'CEO @ EduTech Startup (Series B)',
      company: 'EduTech',
      quote:
        'The business skills + technical knowledge combination was game-changing. I could build AND scale the product myself.',
      background: 'Teacher yang frustrated dengan education system',
      journey: 'No-Code MVP → Technical Co-founder → Raised Series B',
      result: 'Rp 250B valuation, 50K+ active users, team 100+ people',
    },
    {
      initials: 'RS',
      name: 'Riko Saputra',
      position: 'Co-founder @ FinTech Startup',
      company: 'FinTech',
      quote:
        'FullstackTalent gave me the technical foundation to build a fintech product that VCs actually wanted to fund.',
      background: 'Corporate finance yang ingin disrupt traditional banking',
      journey: 'Technopreneur Track → MVP in 3 months → Seed funding',
      result: 'Raised Rp 50B seed round, 10K+ users in 100+ year',
    },
  ];

  const statsData = {
    itProfessional: {
      salaryIncrease: '250%',
      jobPlacement: '95%',
      topCompanies: [
        { name: 'Gojek', count: 120 },
        { name: 'Tokopedia', count: 95 },
        { name: 'Grab', count: 67 },
        { name: 'Shopee', count: 89 },
      ],
      totalAlumni: '12,000+',
    },
    startup: {
      startupsLaunched: '500+',
      fundingSuccess: '60%',
      totalFunding: 'Rp 2.5T',
      highlights: ['15 acquisitions, 3 IPOs', '2 companies valued 1T+'],
    },
  };

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
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            <span>Alumni Success Stories</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-yellow-500 mr-3" />
            Success Stories & Alumni Network
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ribuan alumni telah mencapai kesuksesan karir dan bisnis. Lihat
            perjalanan inspiratif mereka dan pelajari bagaimana FullstackTalent
            membantu mereka mencapai goals.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {(activeTab === 'it' || activeTab === 'techno') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {(activeTab === 'it' ? itStories : technoStories).map(
                (story, index) => (
                  <motion.div
                    key={story.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Avatar & Info */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {story.initials}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {story.name}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium mb-2">
                          {story.position}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{story.company}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-gray-600 italic mb-4 pl-4 border-l-2 border-gray-200">
                      "{story.quote}"
                    </blockquote>

                    {/* Journey Details */}
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Background:
                        </p>
                        <p className="text-gray-600">{story.background}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Journey:
                        </p>
                        <p className="text-gray-600">{story.journey}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Result:
                        </p>
                        <p className="text-green-600 font-medium">
                          {story.result}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* IT Professional Impact */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Briefcase className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">IT Professional Impact</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      {statsData.itProfessional.salaryIncrease}
                    </div>
                    <p className="text-sm text-gray-600">Avg Salary Increase</p>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-green-600 mb-2">
                      {statsData.itProfessional.jobPlacement}
                    </div>
                    <p className="text-sm text-gray-600">Job Placement Rate</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="font-semibold text-gray-900 mb-4">
                    Top Companies Alumni Work At:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {statsData.itProfessional.topCompanies.map((company) => (
                      <div
                        key={company.name}
                        className="text-sm text-gray-700"
                      >
                        {company.name} ({company.count})
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {statsData.itProfessional.totalAlumni}
                  </div>
                  <p className="text-gray-600">Total IT Professional Alumni</p>
                </div>
              </div>

              {/* Startup Impact */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Rocket className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">Startup Impact</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      {statsData.startup.startupsLaunched}
                    </div>
                    <p className="text-sm text-gray-600">Startups Launched</p>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-green-600 mb-2">
                      {statsData.startup.fundingSuccess}
                    </div>
                    <p className="text-sm text-gray-600">Funding Success</p>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    {statsData.startup.totalFunding}
                  </div>
                  <p className="text-gray-600">
                    Total Funding Raised by Alumni
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-4">
                    Success Highlights:
                  </p>
                  <div className="space-y-2">
                    {statsData.startup.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center space-x-2 text-sm text-gray-700"
                      >
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SuccessStories;