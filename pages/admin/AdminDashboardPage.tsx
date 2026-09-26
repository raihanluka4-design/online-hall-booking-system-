import React, { useMemo } from 'react';
import { useBookingContext } from '../../hooks';
import { authService } from '../../services/authService';
import { reportService } from '../../services/reportService';
import { ReportCharts } from '../../components/admin/ReportCharts';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/dateUtils';
import {
  Users,
  Building2,
  CalendarCheck,
  CalendarX,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
  onAddHall: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  onAddHall,
}) => {
  const { halls, bookings } = useBookingContext();
  const allUsers = authService.getAllUsers();

  const report = useMemo(() => {
    return reportService.generateReport('all');
  }, [bookings, halls]);

  const stats = [
    { label: 'Total Users', value: allUsers.length, icon: Users, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/70', path: '/admin/users' },
    { label: 'Total Halls', value: halls.length, icon: Building2, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/70', path: '/admin/halls' },
    { label: 'Total Bookings', value: bookings.length, icon: CalendarCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/70', path: '/admin/bookings' },
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length, icon: TrendingUp, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/70', path: '/admin/bookings' },
    { label: 'Cancelled', value: bookings.filter(b => b.status === 'CANCELLED').length, icon: CalendarX, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/70', path: '/admin/bookings' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Admin Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-brand-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Institutional Administration
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Campus Hall Control Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Live overview of venue reservations, scheduling matrix, user roles, and utilization trends across campus.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <button
            onClick={onAddHall}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Add New Hall
          </button>
          <button
            onClick={() => onNavigate('/admin/reports')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
          >
            <BarChart3 className="h-4 w-4" />
            Reports
          </button>
        </div>
      </div>

      {/* 2. Stat KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(st.path)}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {st.label}
                </span>
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${st.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {st.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* 3. Recharts Analytics */}
      <ReportCharts report={report} />

      {/* 4. Recent Bookings Master Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Campus Bookings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest reservation submissions requiring admin oversight
            </p>
          </div>
          <button
            onClick={() => onNavigate('/admin/bookings')}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Manage All ({bookings.length})
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Booking Ref</th>
                <th className="py-3 px-3">Applicant</th>
                <th className="py-3 px-3">Venue</th>
                <th className="py-3 px-3">Schedule</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.slice(0, 6).map(b => {
                const hall = halls.find(h => h.hallId === b.hallId);
                const applicant = allUsers.find(u => u.userId === b.userId);

                return (
                  <tr key={b.bookingId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {b.bookingId}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {applicant?.name || b.userId}
                      </p>
                      <p className="text-[10px] text-slate-400">{applicant?.email || 'Student'}</p>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {hall?.hallName || b.hallId}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      <div>{formatDate(b.date)}</div>
                      <div className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">{b.timeSlot}</div>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigate('/admin/bookings')}
                        className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
