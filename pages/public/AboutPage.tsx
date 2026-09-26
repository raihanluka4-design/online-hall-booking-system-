import React from 'react';
import { INITIAL_PROJECT_INFO } from '../../data/initialData';
import {
  GraduationCap,
  ShieldCheck,
  Code2,
  Boxes,
  Layers,
  Sparkles,
  Users,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const oopConcepts = [
    {
      title: 'Classes & Objects',
      desc: 'Defined real-world domain models including User, Hall, Booking, and Report with properties and specialized behavior methods.',
      icon: Boxes,
      badge: 'Core Modeling',
    },
    {
      title: 'Encapsulation',
      desc: 'Business logic, strict conflict validation, and session states are isolated within dedicated service classes rather than exposed directly to UI components.',
      icon: Layers,
      badge: 'Data Hiding',
    },
    {
      title: 'Abstraction',
      desc: 'Underlying data persistence (localStorage / mock API) is abstracted behind centralized service interfaces and clean React Custom Hooks.',
      icon: Code2,
      badge: 'Service Interfaces',
    },
    {
      title: 'Polymorphism & Role Hierarchy',
      desc: 'System permissions, sidebar layouts, and actionable operations dynamically polymorphic based on user roles (Student USER vs ADMIN).',
      icon: ShieldCheck,
      badge: 'Role Security',
    },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Title */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 text-xs font-bold">
          <GraduationCap className="h-3.5 w-3.5" />
          Course Mini-Project Documentation
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          About Online Hall Booking System
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          The purpose of this project is to make hall reservation faster, easier, and more reliable by replacing manual booking processes with a computerized system designed for college campuses.
        </p>
      </div>

      {/* Purpose & Core Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="h-10 w-10 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero Conflict Booking</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Eliminates overlapping schedules and double bookings through an automated real-time verification algorithm.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Instant Pass Generation</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Provides verified printable confirmation cards with digital validation hashes and QR codes for event entry.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Institutional Reporting</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Equipped with Recharts analytics and CSV export utilities to monitor venue utilization across academic terms.
          </p>
        </div>
      </div>

      {/* OOP Representation Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Viva & Course Evaluation
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Object-Oriented Programming (OOP) Concepts Representation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            How foundational OOP tenets are modeled and preserved across the full-stack architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {oopConcepts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* College Project Details & Team Card */}
      <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Academic Project Information
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {INITIAL_PROJECT_INFO.subject}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Department of <strong>{INITIAL_PROJECT_INFO.department}</strong> • Academic Year <strong>{INITIAL_PROJECT_INFO.academicYear}</strong>
            </p>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase text-brand-600 dark:text-brand-400 block mb-1">
                Project Guide:
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {INITIAL_PROJECT_INFO.guide.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {INITIAL_PROJECT_INFO.guide.designation}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-500" /> Student Project Team
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
              {INITIAL_PROJECT_INFO.teamMembers.map((m, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{m.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
