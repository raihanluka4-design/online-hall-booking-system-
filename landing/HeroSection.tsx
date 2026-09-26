import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, CalendarCheck, MapPin, Users, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onGetStarted }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-400/20 via-indigo-400/10 to-transparent blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 dark:bg-brand-950/70 dark:border-brand-900/80 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              PBCST304 Mini Project • AI & ML Department
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Book the Right Hall.{' '}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-primary-500 bg-clip-text text-transparent">
                At the Right Time.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Find available halls, check schedules and reserve your perfect space in just a few clicks. Designed for college symposiums, lab sessions, seminars, and student club activities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-xl shadow-brand-500/25 hover:shadow-brand-500/35 hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore Halls
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm shadow-sm transition-all"
              >
                <CalendarCheck className="h-4 w-4 text-brand-600" />
                Get Started
              </button>
            </div>

            {/* Feature Highlights Bullets */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Zero Double Booking
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant Printable Passes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 4 Standard Academic Slots
              </span>
            </div>
          </div>

          {/* Right Hero Showcase Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
                alt="Modern College Auditorium"
                className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Floating Live Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-700/60 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    Featured Auditorium
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Available Today
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Main Campus Auditorium
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-brand-500" /> Central Complex
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                    <Users className="h-3 w-3" /> 500 Seats
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
