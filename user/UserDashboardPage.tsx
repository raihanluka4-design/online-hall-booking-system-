import React, { useState } from 'react';
import { useAuth, useBookingContext } from '../../hooks';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ModifyBookingModal } from '../../components/booking/ModifyBookingModal';
import { CancelBookingModal } from '../../components/booking/CancelBookingModal';
import { Modal } from '../../components/common/Modal';
import { PrintablePass } from '../../components/common/PrintablePass';
import { formatDate } from '../../utils/dateUtils';
import { Booking } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  CalendarCheck,
  CalendarX,
  Building2,
  ArrowRight,
  Printer,
  Edit3,
  XCircle,
  Sparkles,
  CalendarPlus,
} from 'lucide-react';

interface UserDashboardPageProps {
  onNavigate: (path: string) => void;
  onBookHall: (hallId?: string) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  onNavigate,
  onBookHall,
}) => {
  const { user } = useAuth();
  const { userBookings, halls } = useBookingContext();

  const [selectedBookingForPass, setSelectedBookingForPass] = useState<Booking | null>(null);
  const [selectedBookingForModify, setSelectedBookingForModify] = useState<Booking | null>(null);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);

  // Computed metrics
  const totalBookings = userBookings.length;
  const activeBookings = userBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const completedBookings = userBookings.filter(b => b.status === 'COMPLETED').length;
  const cancelledBookings = userBookings.filter(b => b.status === 'CANCELLED').length;

  // Next Upcoming Booking spotlight
  const upcomingBookings = userBookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING')
    .sort((a, b) => a.date.localeCompare(b.date));

  const nextUpcoming = upcomingBookings[0];
  const nextUpcomingHall = nextUpcoming ? halls.find(h => h.hallId === nextUpcoming.hallId) : null;

  return (
    <div className="space-y-8">
      {/* 1. Welcome Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-primary-600 text-white shadow-xl shadow-brand-500/15">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Student Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Student'} 👋
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
            Department of {user?.department || 'AI & ML'}. Reserve campus auditoriums and manage event approvals effortlessly.
          </p>
        </div>

        <button
          onClick={() => onBookHall()}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-brand-700 hover:bg-indigo-50 font-bold text-sm shadow-md hover:shadow-lg transition-all self-start sm:self-auto shrink-0"
        >
          <CalendarPlus className="h-4 w-4" />
          Book a Hall
        </button>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Bookings
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {totalBookings}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Bookings
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {activeBookings}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CalendarCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Completed
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {completedBookings}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Cancelled
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {cancelledBookings}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <CalendarX className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 3. Upcoming Booking Spotlight */}
      {nextUpcoming && (
        <div className="rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100 dark:border-indigo-900/50 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-600 text-white px-2.5 py-0.5 rounded-full">
                Next Upcoming Reservation
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">
                {nextUpcomingHall?.hallName || nextUpcoming.hallId}
              </h3>
            </div>
            <StatusBadge status={nextUpcoming.status} size="md" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-400 block">Date</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-brand-500" />
                {formatDate(nextUpcoming.date)}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-400 block">Time Slot</span>
              <p className="text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 mt-0.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {nextUpcoming.timeSlot}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-400 block">Location</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-500" />
                {nextUpcomingHall?.location || 'Campus'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-400 block">Ref ID</span>
              <p className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {nextUpcoming.bookingId}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Purpose: <strong className="text-slate-700 dark:text-slate-300">{nextUpcoming.purpose}</strong>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedBookingForPass(nextUpcoming)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Printer className="h-3.5 w-3.5" />
                View & Print Pass
              </button>
              <button
                onClick={() => setSelectedBookingForModify(nextUpcoming)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Reschedule
              </button>
              <button
                onClick={() => setSelectedBookingForCancel(nextUpcoming)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Recent Bookings Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity & Reservations</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">All recent booking history</p>
          </div>

          <button
            onClick={() => onNavigate('/my-bookings')}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View All ({userBookings.length})
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Hall</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Time Slot</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {userBookings.slice(0, 5).map(b => {
                const h = halls.find(hall => hall.hallId === b.hallId);
                const canModify = b.status === 'CONFIRMED' || b.status === 'PENDING';

                return (
                  <tr key={b.bookingId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {b.bookingId}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {h?.hallName || b.hallId}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {formatDate(b.date)}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">
                      {b.timeSlot}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBookingForPass(b)}
                          title="Print Pass"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                        {canModify && (
                          <>
                            <button
                              onClick={() => setSelectedBookingForModify(b)}
                              title="Reschedule"
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setSelectedBookingForCancel(b)}
                              title="Cancel"
                              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pass View Modal */}
      {selectedBookingForPass && (
        <Modal
          isOpen={!!selectedBookingForPass}
          onClose={() => setSelectedBookingForPass(null)}
          maxWidth="2xl"
        >
          <PrintablePass
            booking={selectedBookingForPass}
            hall={halls.find(h => h.hallId === selectedBookingForPass.hallId)}
            user={user}
            onClose={() => setSelectedBookingForPass(null)}
          />
        </Modal>
      )}

      {/* Modify Modal */}
      {selectedBookingForModify && (
        <ModifyBookingModal
          isOpen={!!selectedBookingForModify}
          booking={selectedBookingForModify}
          onClose={() => setSelectedBookingForModify(null)}
        />
      )}

      {/* Cancel Modal */}
      {selectedBookingForCancel && (
        <CancelBookingModal
          isOpen={!!selectedBookingForCancel}
          booking={selectedBookingForCancel}
          onClose={() => setSelectedBookingForCancel(null)}
        />
      )}
    </div>
  );
};
