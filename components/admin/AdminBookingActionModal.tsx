import React, { useState } from 'react';
import { Booking, BookingStatus, Hall, User } from '../../types';
import { useBookingContext, useToast } from '../../hooks';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/dateUtils';
import { authService } from '../../services/authService';
import { ShieldCheck, Calendar, Clock, MapPin, Users, Edit } from 'lucide-react';

interface AdminBookingActionModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminBookingActionModal: React.FC<AdminBookingActionModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { halls, updateBooking } = useBookingContext();
  const { success, error } = useToast();

  const [status, setStatus] = useState<BookingStatus>(booking?.status || 'CONFIRMED');
  const [remarks, setRemarks] = useState<string>(booking?.remarks || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (booking) {
      setStatus(booking.status);
      setRemarks(booking.remarks || '');
    }
  }, [booking]);

  if (!booking) return null;

  const hall: Hall | undefined = halls.find(h => h.hallId === booking.hallId);
  const users = authService.getAllUsers();
  const applicant: User | undefined = users.find(u => u.userId === booking.userId);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateBooking(booking.bookingId, {
        status,
        remarks,
      });
      success('Booking Status Updated', `Reservation ${booking.bookingId} is now ${status}.`);
      onClose();
    } catch (err: any) {
      error('Update Failed', err.message || 'Failed to update booking status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          Admin Booking Review: {booking.bookingId}
        </span>
      }
      description="Review booking details, change status, or add administrative notes."
      maxWidth="lg"
    >
      <div className="space-y-4 pt-2">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div>
            <span className="text-slate-400 font-semibold uppercase">Venue</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
              {hall?.hallName || booking.hallId}
            </p>
            <p className="text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" /> {hall?.location}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase">Schedule</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-brand-500" /> {formatDate(booking.date)}
            </p>
            <p className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3" /> {booking.timeSlot}
            </p>
          </div>

          <div className="col-span-2 border-t border-slate-200 dark:border-slate-700 pt-2 flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-semibold uppercase">Applicant</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {applicant?.name || booking.userId} ({applicant?.email || 'N/A'})
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase block text-right">Attendees</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-right">
                {booking.attendees || 'General'}
              </p>
            </div>
          </div>

          <div className="col-span-2 border-t border-slate-200 dark:border-slate-700 pt-2">
            <span className="text-slate-400 font-semibold uppercase">Purpose</span>
            <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
              {booking.purpose}
            </p>
          </div>
        </div>

        {/* Change Status */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Change Reservation Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'] as BookingStatus[]).map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setStatus(st)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  status === st
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md ring-2 ring-brand-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Remarks */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Admin Remarks / Notes
          </label>
          <textarea
            rows={2}
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder="e.g. Approved by Academic Dean. Keys collected."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
