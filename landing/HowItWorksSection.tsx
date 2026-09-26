import React from 'react';
import { Search, Calendar, Clock, CheckCircle } from 'lucide-react';

export const HowItWorksSection: React.FC<{ onBookNow?: () => void }> = ({ onBookNow }) => {
  const steps = [
    {
      num: '01',
      title: 'Find Venue',
      desc: 'Browse seminar halls, auditoriums, or labs based on capacity and required AV equipment.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Check Schedule',
      desc: 'Pick your event date and view live slot availability across standard college sessions.',
      icon: Calendar,
    },
    {
      num: '03',
      title: 'Select Slot',
      desc: 'Choose an open time slot and provide your club or department event purpose.',
      icon: Clock,
    },
    {
      num: '04',
      title: 'Get Pass',
      desc: 'Receive instant confirmation and download your printable college reservation pass.',
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-900">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            How HallBook Works
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            From discovering venues to getting your authorized reservation pass in under 60 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col items-center text-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all"
              >
                <span className="absolute -top-4 px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-black shadow-md">
                  {step.num}
                </span>

                <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 mt-2">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {onBookNow && (
          <div className="text-center mt-12">
            <button
              onClick={onBookNow}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-lg shadow-brand-500/25 transition-all"
            >
              Start Booking Now
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
