import React from 'react';
import {
  CalendarPlus,
  Clock,
  ShieldAlert,
  CalendarX,
  Sliders,
  BarChart3,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Easy Booking',
      desc: 'Reserve a hall with a simple, guided 5-step booking workflow designed for students and faculty.',
      icon: CalendarPlus,
      tag: 'Intuitive Workflow',
    },
    {
      title: 'Real-Time Availability',
      desc: 'Check live open dates and time slots across all academic venues without calling the campus office.',
      icon: Clock,
      tag: 'Live Sync',
    },
    {
      title: 'Conflict-Free Scheduling',
      desc: 'Engine prevents duplicate reservations and rejects overlapping time slots with instant validation.',
      icon: ShieldAlert,
      tag: 'Zero Double-Booking',
    },
    {
      title: 'Easy Cancellation & Rescheduling',
      desc: 'Manage and update bookings whenever required with instant confirmation updates and slot release.',
      icon: CalendarX,
      tag: 'Flexible Management',
    },
    {
      title: 'Admin Management',
      desc: 'Comprehensive portal to manage users, campus halls, venue equipment, and reservation approvals.',
      icon: Sliders,
      tag: 'Role-Based Control',
    },
    {
      title: 'Analytics & Reports',
      desc: 'View booking trends, hall utilization percentages, and export printable reports for college records.',
      icon: BarChart3,
      tag: 'Visual Data',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-900">
            Core Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Built for Academic Efficiency
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Replacing manual paper registers with an automated, conflict-free computerized hall booking platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 shadow-inner group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
