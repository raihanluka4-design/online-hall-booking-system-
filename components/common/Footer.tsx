import React from 'react';
import { Building2, GraduationCap, ShieldCheck, Heart, Github } from 'lucide-react';
import { INITIAL_PROJECT_INFO } from '../../data/initialData';

export const Footer: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = `#${path}`;
    }
  };

  return (
    <footer className="border-t border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-md pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200/60 dark:border-slate-800">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white">HallBook</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Online Hall Booking System for college campus facilities, eliminating manual reservations with conflict-free scheduling.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200/60 dark:border-brand-900/60 text-[11px] font-bold text-brand-700 dark:text-brand-300">
              <GraduationCap className="h-3.5 w-3.5" />
              PBCST304 OOP Mini Project
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-brand-600 transition-colors">
                  Home Landing Page
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/halls')} className="hover:text-brand-600 transition-colors">
                  Browse Campus Halls
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/availability')} className="hover:text-brand-600 transition-colors">
                  Real-time Availability Matrix
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-brand-600 transition-colors">
                  About & OOP Concept Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login')} className="hover:text-brand-600 transition-colors">
                  Student & Faculty Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Guidance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Project Mentorship
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 block">
                Project Guide:
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {INITIAL_PROJECT_INFO.guide.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {INITIAL_PROJECT_INFO.guide.designation}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                Department of {INITIAL_PROJECT_INFO.department} (AY {INITIAL_PROJECT_INFO.academicYear})
              </p>
            </div>
          </div>

          {/* Col 4: Project Team Members */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Project Team (AI & ML)
            </h4>
            <div className="grid grid-cols-1 gap-1 text-xs text-slate-600 dark:text-slate-400">
              {INITIAL_PROJECT_INFO.teamMembers.map((member, idx) => (
                <div key={idx} className="flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-300">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright & viva note */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026–2027 Online Hall Booking System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Object-Oriented Programming (PBCST304) Course Viva & Demo
          </p>
        </div>
      </div>
    </footer>
  );
};
