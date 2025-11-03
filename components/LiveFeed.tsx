'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Users,
  Briefcase,
  Rocket,
  DollarSign,
  Award,
  Trophy,
  Star,
  Target,
  TrendingUp,
} from 'lucide-react';

const LiveFeed = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activities = [
    {
      initials: 'SC',
      text: "Sarah's startup just raised Series A after finishing our Technopreneur program!",
      time: '5 menit yang lalu',
      company: 'EduTech Startup',
      badge: 'Series A',
      badgeColor: 'green',
    },
    {
      initials: 'MP',
      text: 'Mike earned Rp 25M job offer at Tokopedia after System Design course!',
      time: '15 menit yang lalu',
      company: 'Tokopedia',
      badge: 'Rp 25M',
      badgeColor: 'green',
    },
    {
      initials: 'GR',
      text: '150 students joined System Design course in last 24 hours',
      time: '1 jam yang lalu',
      icon: Users,
    },
    {
      initials: 'AW',
      text: 'Andi just earned AWS Solutions Architect certification!',
      time: '2 jam yang lalu',
      icon: Award,
    },
  ];

  const stats = [
    {
      icon: Users,
      label: 'Active Students',
      value: '12,456',
      subtext: 'online now: 234',
      color: 'blue',
    },
    {
      icon: Briefcase,
      label: 'Job Placements',
      value: '8,934',
      subtext: 'this month: 156',
      color: 'green',
    },
    {
      icon: Rocket,
      label: 'Startups Launched',
      value: '1,234',
      subtext: 'funding secured: 345',
      color: 'purple',
    },
    {
      icon: DollarSign,
      label: 'Total Salary Increase',
      value: 'Rp 450B+',
      subtext: 'generated for alumni',
      color: 'orange',
    },
    {
      icon: Award,
      label: 'Certificates Earned',
      value: '25,678',
      subtext: 'today: 45',
      color: 'indigo',
    },
  ];

  const trustItems = [
    { icon: Trophy, text: 'Best Coding Bootcamp Indonesia 2024' },
    { icon: Star, text: '4.9/5 from 15,000+ reviews' },
    { icon: Target, text: '100% Money Back if no job in 12 months' },
    { icon: TrendingUp, text: '95% job placement success' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Live Activity Feed */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Live Activity Feed
                </h3>
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                  Live
                </span>
              </div>

              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {activity.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-1">
                        {activity.text}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                        {activity.company && (
                          <span className="text-xs text-gray-600">
                            {activity.company}
                          </span>
                        )}
                        {activity.badge && (
                          <span
                            className={`px-2 py-1 ${
                              activity.badgeColor === 'green'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            } text-xs font-semibold rounded`}
                          >
                            {activity.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Trust & Recognition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Trust & Recognition
                </h3>
              </div>

              <div className="space-y-4">
                {trustItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Community Stats */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg sticky top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Community Stats
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  Updated: {time.toLocaleTimeString('id-ID')}
                </span>
              </div>

              <div className="space-y-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  const colorClasses = {
                    blue: 'from-blue-500 to-blue-600',
                    green: 'from-green-500 to-green-600',
                    purple: 'from-purple-500 to-purple-600',
                    orange: 'from-orange-500 to-orange-600',
                    indigo: 'from-indigo-500 to-indigo-600',
                  };

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-br ${
                            colorClasses[stat.color as keyof typeof colorClasses]
                          }`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {stat.label}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500">
                        {stat.subtext}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveFeed;