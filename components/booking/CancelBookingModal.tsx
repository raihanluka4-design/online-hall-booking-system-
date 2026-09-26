import React, { useState } from 'react';
import { Booking } from '../../types';
import { useBookingContext, useToast } from '../../hooks';
import { Modal } from '../common/Modal';
import { formatDate } from '../../utils/dateUtils';
import { AlertTriangle, XCircle } from 'lucide-react';

interface CancelBookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { halls, cancelBooking } = useBookingContext();
  const { success, error } = useToast();
  const [reason, setReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  if (!booking) return null;

  const hall = halls.find(h => h.hallId === booking.hallId);

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelBooking(booking.bookingId, reason);
      success('Booking cancelled successfully.', `Reservation ${booking.bookingId} is now cancelled.`);
      onClose();
    } catch (err: any) {
      error('Cancellation Error', err.message || 'Failed to cancel booking.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="h-5 w-5" />
          Cancel Reservation
        </span>
      }
      maxWidth="md"
    >
      <div className="space-y-4 pt-2">
        <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Are you sure you want to cancel this booking?
        </p>

        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 space-y-1">
          <p className="font-bold">Booking Ref: {booking.bookingId}</p>
          <p>Venue: {hall?.hallName || booking.hallId}</p>
          <p>Date & Time: {formatDate(booking.date)} ({booking.timeSlot})</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Reason for cancellation (optional):
          </label>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="e.g. Schedule clash or event postponement"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Keep Booking
          </button>
          <button
            type="button"
            onClick={handleConfirmCancel}
            disabled={isCancelling}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md shadow-rose-500/20 transition-all disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
