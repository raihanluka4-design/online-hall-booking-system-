import React from 'react';
import { INITIAL_PROJECT_INFO } from '../../data/initialData';
import { ShieldCheck, GraduationCap, Code2, Users } from 'lucide-react';

export const ProjectBanner: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="h-4 w-4" />
                College Mini-Project Demonstration
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {INITIAL_PROJECT_INFO.name}
              </h2>

              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Developed for <strong>{INITIAL_PROJECT_INFO.subject}</strong> course curriculum under the <strong>Department of {INITIAL_PROJECT_INFO.department}</strong> (Academic Year {INITIAL_PROJECT_INFO.academicYear}).
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-brand-400 block">Project Guide:</span>
                  <span className="font-bold text-white">{INITIAL_PROJECT_INFO.guide.name}</span>
                  <span className="block text-slate-400 text-[11px]">{INITIAL_PROJECT_INFO.guide.designation}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-brand-400 block">OOP Concepts Applied:</span>
                  <span className="font-semibold text-white">Encapsulation • Abstraction • Polymorphism</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-white/10 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Project Team Members
              </h4>
              <div className="space-y-1.5 text-xs text-slate-200">
                {INITIAL_PROJECT_INFO.teamMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="font-bold">{member.name}</span>
                    <span className="text-[11px] text-brand-300/80">{member.role?.split('&')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
