import React, { useState, useMemo } from 'react';
import { useBookingContext, useToast } from '../../hooks';
import { reportService } from '../../services/reportService';
import { ReportCharts } from '../../components/admin/ReportCharts';
import { downloadCSV, triggerPrint } from '../../utils/exportUtils';
import { formatDate } from '../../utils/dateUtils';
import { INITIAL_PROJECT_INFO } from '../../data/initialData';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Building2,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { bookings, halls } = useBookingContext();
  const { success } = useToast();
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'all'>('all');

  const report = useMemo(() => {
    return reportService.generateReport(period);
  }, [period, bookings, halls]);

  const handleExportCSV = () => {
    const csvContent = reportService.exportBookingsToCSV();
    downloadCSV(csvContent, `HallBook_Report_${new Date().toISOString().split('T')[0]}.csv`);
    success('Report Exported', 'CSV booking report downloaded successfully.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 text-xs font-bold mb-2">
            <BarChart3 className="h-3.5 w-3.5" /> Institutional Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Reports & Hall Utilization Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit term reservations, venue popularity metrics, and export data for college records.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerPrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Period Filter Bar */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-2">
          Report Timeframe:
        </span>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {(['day', 'week', 'month', 'all'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                period === p
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {p === 'all' ? 'All Time' : `Past ${p}`}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Bookings
          </span>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {report.totalBookings}
          </h3>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
            {report.confirmedBookings} Confirmed Reservations
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Most Popular Venue
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 truncate">
            {report.mostBookedHall}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Highest reservation volume
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Least Booked Venue
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 truncate">
            {report.leastBookedHall}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Available for additional sessions
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Campus Utilization
          </span>
          <h3 className="text-3xl font-black text-brand-600 dark:text-brand-400 mt-1">
            {report.averageUtilization}%
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Average slot occupancy
          </p>
        </div>
      </div>

      {/* Recharts Graphical Reports */}
      <ReportCharts report={report} />

      {/* Printable Report Summary Card (for Project Documentation) */}
      <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Institutional Venue Utilization Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Department of {INITIAL_PROJECT_INFO.department} • PBCST304 OOP Mini Project
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Report Ref: {report.reportId}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.hallUtilization.map(h => (
            <div
              key={h.hallId}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                  {h.hallName}
                </span>
                <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                  {h.utilizationPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${h.utilizationPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{h.capacity} Seats</span>
                <span>{h.totalBookings} Total Bookings</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
