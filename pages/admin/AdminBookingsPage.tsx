import React, { useState, useMemo } from 'react';
import { useBookingContext } from '../../hooks';
import { authService } from '../../services/authService';
import { Booking, BookingStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminBookingActionModal } from '../../components/admin/AdminBookingActionModal';
import { Modal } from '../../components/common/Modal';
import { PrintablePass } from '../../components/common/PrintablePass';
import { formatDate } from '../../utils/dateUtils';
import {
  CalendarCheck,
  Search,
  Printer,
  Edit3,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Filter,
} from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const { bookings, halls } = useBookingContext();
  const allUsers = authService.getAllUsers();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [hallFilter, setHallFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  const [selectedBookingForPass, setSelectedBookingForPass] = useState<Booking | null>(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
      if (hallFilter !== 'ALL' && b.hallId !== hallFilter) return false;
      if (dateFilter && b.date !== dateFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const hall = halls.find(h => h.hallId === b.hallId);
        const user = allUsers.find(u => u.userId === b.userId);
        const matchesId = b.bookingId.toLowerCase().includes(q);
        const matchesHall = hall?.hallName.toLowerCase().includes(q);
        const matchesUser = user?.name.toLowerCase().includes(q);
        const matchesPurpose = b.purpose.toLowerCase().includes(q);
        if (!matchesId && !matchesHall && !matchesUser && !matchesPurpose) return false;
      }

      return true;
    });
  }, [bookings, statusFilter, hallFilter, dateFilter, search, halls, allUsers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
            <CalendarCheck className="h-3.5 w-3.5" /> Institutional Master Bookings
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Booking & Reservation Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit campus reservations, update statuses, add approval notes, and verify passes.
          </p>
        </div>
      </div>

      {/* Filter Controls Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, user, or hall..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
            >
              <option value="ALL">All Statuses ({bookings.length})</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Hall Filter */}
          <div>
            <select
              value={hallFilter}
              onChange={e => setHallFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
            >
              <option value="ALL">All Halls</option>
              {halls.map(h => (
                <option key={h.hallId} value={h.hallId}>
                  {h.hallName}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-xs text-rose-500 hover:underline shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Booking Ref</th>
                <th className="py-4 px-4">Applicant</th>
                <th className="py-4 px-4">Venue</th>
                <th className="py-4 px-4">Schedule</th>
                <th className="py-4 px-4">Purpose</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBookings.map(b => {
                const hall = halls.find(h => h.hallId === b.hallId);
                const applicant = allUsers.find(u => u.userId === b.userId);

                return (
                  <tr key={b.bookingId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-4 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {b.bookingId}
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {applicant?.name || b.userId}
                      </p>
                      <p className="text-[10px] text-slate-400">{applicant?.email || 'N/A'}</p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {hall?.hallName || b.hallId}
                      </span>
                      <span className="text-[10px] text-slate-400">{hall?.location}</span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatDate(b.date)}
                      </div>
                      <div className="text-[10px] text-brand-600 dark:text-brand-400 font-bold">
                        {b.timeSlot}
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-xs truncate text-slate-700 dark:text-slate-300">
                      {b.purpose}
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={b.status} size="sm" />
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBookingForPass(b)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                          title="Print Pass"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedBookingForReview(b)}
                          className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Action Modal */}
      {selectedBookingForReview && (
        <AdminBookingActionModal
          isOpen={!!selectedBookingForReview}
          booking={selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
        />
      )}

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
            user={allUsers.find(u => u.userId === selectedBookingForPass.userId)}
            onClose={() => setSelectedBookingForPass(null)}
          />
        </Modal>
      )}
    </div>
  );
};
