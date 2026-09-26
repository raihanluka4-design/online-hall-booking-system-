import React from 'react';
import { Building2, CalendarCheck, Users, ShieldCheck } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Campus Halls', value: '25+', icon: Building2, desc: 'Seminar halls, labs & auditoriums' },
    { label: 'Successful Bookings', value: '500+', icon: CalendarCheck, desc: 'Across departments this term' },
    { label: 'Registered Users', value: '1,200+', icon: Users, desc: 'Students, faculty & staff' },
    { label: 'Availability Accuracy', value: '99%', icon: ShieldCheck, desc: 'Strict conflict-free prevention' },
  ];

  return (
    <section className="py-12 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center sm:items-start p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 mb-3 shadow-inner">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 text-center sm:text-left">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
