import React, { useState } from 'react';
import { Booking, Hall } from '../../types';
import { useBookingContext, useToast } from '../../hooks';
import { Modal } from '../common/Modal';
import { SlotSelector } from './SlotSelector';
import { getTodayString, getMaxBookingDateString } from '../../utils/dateUtils';
import { Calendar, Clock, Edit3 } from 'lucide-react';

interface ModifyBookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ModifyBookingModal: React.FC<ModifyBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { halls, updateBooking } = useBookingContext();
  const { success, error } = useToast();

  const [date, setDate] = useState<string>(booking?.date || getTodayString());
  const [timeSlot, setTimeSlot] = useState<string>(booking?.timeSlot || '');
  const [purpose, setPurpose] = useState<string>(booking?.purpose || '');
  const [attendees, setAttendees] = useState<string>(booking?.attendees ? String(booking.attendees) : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when booking changes
  React.useEffect(() => {
    if (booking) {
      setDate(booking.date);
      setTimeSlot(booking.timeSlot);
      setPurpose(booking.purpose);
      setAttendees(booking.attendees ? String(booking.attendees) : '');
    }
  }, [booking]);

  if (!booking) return null;

  const hall = halls.find(h => h.hallId === booking.hallId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot) {
      error('Please select both a date and an available time slot.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateBooking(booking.bookingId, {
        date,
        timeSlot,
        purpose,
        attendees: attendees ? parseInt(attendees, 10) : undefined,
      });

      success('Booking Updated', `Reservation ${booking.bookingId} has been successfully rescheduled.`);
      onClose();
    } catch (err: any) {
      error('Conflict / Error', err.message || 'Unable to update booking. Slot might be unavailable.');
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
          <Edit3 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          Reschedule Booking {booking.bookingId}
        </span>
      }
      description={`Update date or time slot for ${hall?.hallName || booking.hallId}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {/* Date Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-brand-500" />
            Reservation Date
          </label>
          <input
            type="date"
            value={date}
            min={getTodayString()}
            max={getMaxBookingDateString(60)}
            onChange={e => setDate(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>

        {/* Slot Selector with exclusion for current booking */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-brand-500" />
            Choose New Time Slot
          </label>
          <SlotSelector
            hallId={booking.hallId}
            selectedDate={date}
            selectedSlot={timeSlot}
            onSelectSlot={slot => setTimeSlot(slot)}
            excludeBookingId={booking.bookingId}
          />
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Event Purpose
          </label>
          <input
            type="text"
            value={purpose}
            onChange={e => setPurpose(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Checking Availability...' : 'Save & Update Booking'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
