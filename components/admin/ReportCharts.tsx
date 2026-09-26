import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Report } from '../../types';

interface ReportChartsProps {
  report: Report;
}

const STATUS_COLORS = {
  CONFIRMED: '#10b981', // emerald
  PENDING: '#f59e0b', // amber
  COMPLETED: '#3b82f6', // blue
  CANCELLED: '#ef4444', // rose
};

export const ReportCharts: React.FC<ReportChartsProps> = ({ report }) => {
  const pieData = [
    { name: 'Confirmed', value: report.confirmedBookings, color: STATUS_COLORS.CONFIRMED },
    { name: 'Completed', value: report.completedBookings, color: STATUS_COLORS.COMPLETED },
    { name: 'Pending', value: report.pendingBookings, color: STATUS_COLORS.PENDING },
    { name: 'Cancelled', value: report.cancelledBookings, color: STATUS_COLORS.CANCELLED },
  ].filter(item => item.value > 0);

  const barData = report.hallUtilization.map(h => ({
    name: h.hallName.length > 14 ? `${h.hallName.slice(0, 12)}...` : h.hallName,
    fullName: h.hallName,
    bookings: h.totalBookings,
    utilization: h.utilizationPercent,
  }));

  return (
    <div className="space-y-8">
      {/* Chart 1: Booking Trends Area Chart */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Booking Trends & Trajectory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total reservations made over the recent active period
            </p>
          </div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full self-start">
            Activity Timeline
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={report.bookingTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="bookings"
                name="Total Bookings"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
              <Area
                type="monotone"
                dataKey="confirmed"
                name="Confirmed"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorConfirmed)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Donut and Bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart 2: Booking Status Donut Chart */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Booking Status Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Distribution of confirmed, completed, and cancelled reservations
            </p>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner text metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {report.totalBookings}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Bookings
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400">{item.name}:</span>
                <strong className="text-slate-900 dark:text-white">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Hall Utilization Bar Chart */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hall Utilization & Popularity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total bookings received per venue
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="bookings"
                  name="Total Bookings"
                  fill="#4f46e5"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>
              Most Booked: <strong className="text-emerald-600 dark:text-emerald-400">{report.mostBookedHall}</strong>
            </span>
            <span>
              Avg Utilization: <strong className="text-brand-600 dark:text-brand-400">{report.averageUtilization}%</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
