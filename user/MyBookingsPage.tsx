import React, { useState, useMemo } from 'react';
import { useAuth, useBookingContext } from '../../hooks';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ModifyBookingModal } from '../../components/booking/ModifyBookingModal';
import { CancelBookingModal } from '../../components/booking/CancelBookingModal';
import { Modal } from '../../components/common/Modal';
import { PrintablePass } from '../../components/common/PrintablePass';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/dateUtils';
import {
  CalendarCheck,
  Search,
  Printer,
  Edit3,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  Building2,
  CalendarPlus,
} from 'lucide-react';

interface MyBookingsPageProps {
  onNavigate: (path: string) => void;
  onBookHall: () => void;
}

type TabType = 'all' | 'upcoming' | 'completed' | 'cancelled';

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  onNavigate,
  onBookHall,
}) => {
  const { user } = useAuth();
  const { userBookings, halls } = useBookingContext();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [search, setSearch] = useState('');

  const [selectedPassBooking, setSelectedPassBooking] = useState<Booking | null>(null);
  const [selectedModifyBooking, setSelectedModifyBooking] = useState<Booking | null>(null);
  const [selectedCancelBooking, setSelectedCancelBooking] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    return userBookings.filter(b => {
      // Tab filter
      if (activeTab === 'upcoming') {
        if (b.status !== 'CONFIRMED' && b.status !== 'PENDING') return false;
      } else if (activeTab === 'completed') {
        if (b.status !== 'COMPLETED') return false;
      } else if (activeTab === 'cancelled') {
        if (b.status !== 'CANCELLED') return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const hall = halls.find(h => h.hallId === b.hallId);
        const matchesId = b.bookingId.toLowerCase().includes(q);
        const matchesHall = hall?.hallName.toLowerCase().includes(q);
        const matchesPurpose = b.purpose.toLowerCase().includes(q);
        const matchesDate = b.date.includes(q);
        if (!matchesId && !matchesHall && !matchesPurpose && !matchesDate) return false;
      }

      return true;
    });
  }, [userBookings, activeTab, search, halls]);

  const counts = {
    all: userBookings.length,
    upcoming: userBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length,
    completed: userBookings.filter(b => b.status === 'COMPLETED').length,
    cancelled: userBookings.filter(b => b.status === 'CANCELLED').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 text-xs font-bold mb-2">
            <CalendarCheck className="h-3.5 w-3.5" /> Reservation History
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            My Campus Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your scheduled events, reschedule dates, and print authorized hall passes.
          </p>
        </div>

        <button
          onClick={onBookHall}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <CalendarPlus className="h-4 w-4" />
          Reserve New Hall
        </button>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'upcoming', 'completed', 'cancelled'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab} ({counts[tab]})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, hall, or purpose..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>
      </div>

      {/* Bookings List / Table */}
      {filteredBookings.length > 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">Booking Ref</th>
                  <th className="py-4 px-4">Venue</th>
                  <th className="py-4 px-4">Schedule</th>
                  <th className="py-4 px-4">Event Purpose</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBookings.map(booking => {
                  const hall = halls.find(h => h.hallId === booking.hallId);
                  const canModify = booking.status === 'CONFIRMED' || booking.status === 'PENDING';

                  return (
                    <tr
                      key={booking.bookingId}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                        {booking.bookingId}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {hall?.hallName || booking.hallId}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" /> {hall?.location || 'Campus'}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-brand-500" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="text-[11px] text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {booking.timeSlot}
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {booking.purpose}
                        </p>
                        {booking.attendees && (
                          <span className="text-[11px] text-slate-400">
                            {booking.attendees} Attendees
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={booking.status} size="sm" />
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedPassBooking(booking)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            <Printer className="h-3.5 w-3.5 text-brand-500" />
                            Pass
                          </button>

                          {canModify && (
                            <>
                              <button
                                onClick={() => setSelectedModifyBooking(booking)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                Reschedule
                              </button>
                              <button
                                onClick={() => setSelectedCancelBooking(booking)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Cancel
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
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title="No Bookings Found"
          description={
            search
              ? 'No reservations matched your search query.'
              : activeTab === 'all'
              ? "You don't have any bookings yet. Find and reserve a hall for your next event."
              : `You do not have any ${activeTab} reservations.`
          }
          actionText="Browse Campus Halls"
          onAction={() => onNavigate('/halls')}
        />
      )}

      {/* Modals */}
      {selectedPassBooking && (
        <Modal
          isOpen={!!selectedPassBooking}
          onClose={() => setSelectedPassBooking(null)}
          maxWidth="2xl"
        >
          <PrintablePass
            booking={selectedPassBooking}
            hall={halls.find(h => h.hallId === selectedPassBooking.hallId)}
            user={user}
            onClose={() => setSelectedPassBooking(null)}
          />
        </Modal>
      )}

      {selectedModifyBooking && (
        <ModifyBookingModal
          isOpen={!!selectedModifyBooking}
          booking={selectedModifyBooking}
          onClose={() => setSelectedModifyBooking(null)}
        />
      )}

      {selectedCancelBooking && (
        <CancelBookingModal
          isOpen={!!selectedCancelBooking}
          booking={selectedCancelBooking}
          onClose={() => setSelectedCancelBooking(null)}
        />
      )}
    </div>
  );
};
