import React, { useState, useEffect } from 'react';
import { Booking, Hall } from '../../types';
import { useAuth, useBookingContext, useToast } from '../../hooks';
import { getTodayString, getMaxBookingDateString, formatDate } from '../../utils/dateUtils';
import { SlotSelector } from './SlotSelector';
import { BookingSummaryCard } from './BookingSummaryCard';
import { PrintablePass } from '../common/PrintablePass';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Building2,
  Clock,
  FileCheck,
  Sparkles,
  MapPin,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingWizardProps {
  initialHallId?: string;
  onFinish?: (booking: Booking) => void;
  onCancel?: () => void;
}

const STEPS = [
  { id: 1, label: 'Select Hall', icon: Building2 },
  { id: 2, label: 'Pick Date', icon: Calendar },
  { id: 3, label: 'Slot & Details', icon: Clock },
  { id: 4, label: 'Review & Verify', icon: FileCheck },
  { id: 5, label: 'Confirmation', icon: Sparkles },
];

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialHallId,
  onFinish,
  onCancel,
}) => {
  const { user } = useAuth();
  const { halls, createBooking } = useBookingContext();
  const { success, error } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedHallId, setSelectedHallId] = useState<string>(initialHallId || '');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [attendees, setAttendees] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (initialHallId) {
      setSelectedHallId(initialHallId);
      // If initial hall is passed, start on Step 2
      setCurrentStep(2);
    }
  }, [initialHallId]);

  const selectedHall = halls.find(h => h.hallId === selectedHallId);

  // Stepper forward validation
  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedHallId) {
        error('Please select a hall to proceed.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedDate) {
        error('Please select a reservation date.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!selectedSlot) {
        error('Please choose an available time slot.');
        return;
      }
      if (!purpose || purpose.trim().length < 3) {
        error('Please provide an event purpose (at least 3 characters).');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedHallId || !selectedDate || !selectedSlot || !purpose) {
      error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await createBooking({
        hallId: selectedHallId,
        date: selectedDate,
        timeSlot: selectedSlot,
        purpose,
        attendees: attendees ? parseInt(attendees, 10) : undefined,
        remarks,
      });

      setConfirmedBooking(newBooking);
      setCurrentStep(5);
      success('Booking Confirmed!', `Reservation ${newBooking.bookingId} created successfully.`);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore confetti errors
      }

      if (onFinish) onFinish(newBooking);
    } catch (err: any) {
      error('Booking Error', err.message || 'Unable to confirm booking. Please choose another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xl overflow-hidden">
      {/* Progress Header */}
      <div className="bg-slate-50/80 dark:bg-slate-800/50 p-6 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id || (currentStep === 5 && step.id === 5);
            const isCurrent = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-1.5 z-10">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : isCurrent
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-100 dark:ring-brand-950'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5 stroke-[2.5]" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span
                    className={`text-[11px] font-semibold hidden sm:block ${
                      isCurrent
                        ? 'text-brand-600 dark:text-brand-400 font-bold'
                        : isCompleted
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                      currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content Area */}
      <div className="p-6 md:p-8 min-h-[420px]">
        {/* STEP 1: Select Hall */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Step 1: Choose Venue</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select an academic auditorium or hall for your event.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {halls.map(hall => {
                const isSelected = selectedHallId === hall.hallId;
                const isAvailable = hall.status === 'AVAILABLE';

                return (
                  <div
                    key={hall.hallId}
                    onClick={() => isAvailable && setSelectedHallId(hall.hallId)}
                    className={`relative flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      !isAvailable
                        ? 'opacity-60 bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                        : isSelected
                        ? 'bg-brand-50/70 border-brand-500 dark:bg-brand-950/40 dark:border-brand-500 shadow-md ring-2 ring-brand-500/20'
                        : 'bg-white border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 hover:border-brand-300'
                    }`}
                  >
                    <img
                      src={hall.image}
                      alt={hall.hallName}
                      className="h-20 w-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase">
                          {hall.type}
                        </span>
                        {isSelected && (
                          <span className="h-5 w-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {hall.hallName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {hall.location}
                      </p>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3" /> {hall.capacity} Seats
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Pick Date */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Step 2: Select Date</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Pick the date for your hall reservation. Booking is allowed up to 60 days ahead.
              </p>
            </div>

            {selectedHall && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-3">
                <Building2 className="h-5 w-5 text-brand-600 dark:text-brand-400 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Selected Hall:</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedHall.hallName} ({selectedHall.location})
                  </p>
                </div>
              </div>
            )}

            <div className="max-w-md mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Reservation Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                min={getTodayString()}
                max={getMaxBookingDateString(60)}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selected: <strong className="text-brand-600 dark:text-brand-400">{formatDate(selectedDate)}</strong>
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Slot & Event Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Step 3: Select Time Slot & Details</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Choose an available slot for {formatDate(selectedDate)} and provide event specifics.
              </p>
            </div>

            {/* Slot Picker Component */}
            <SlotSelector
              hallId={selectedHallId}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onSelectSlot={slot => setSelectedSlot(slot)}
            />

            {/* Purpose & Attendees Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Event Purpose / Activity Title *
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  placeholder="e.g. AI & ML Workshop on Computer Vision"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Expected Attendees
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedHall?.capacity || 500}
                  value={attendees}
                  onChange={e => setAttendees(e.target.value)}
                  placeholder={`Max ${selectedHall?.capacity || 100} capacity`}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Special Remarks / Equipment Needs
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="e.g. Need podium microphone & HDMI cable"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Verify */}
        {currentStep === 4 && selectedHall && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Step 4: Review Reservation Summary</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Please double-check your event details before final submission.
              </p>
            </div>

            <BookingSummaryCard
              hall={selectedHall}
              date={selectedDate}
              timeSlot={selectedSlot}
              purpose={purpose}
              attendees={attendees ? parseInt(attendees, 10) : undefined}
              user={user}
            />
          </div>
        )}

        {/* STEP 5: Confirmation Pass */}
        {currentStep === 5 && confirmedBooking && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 shadow-lg shadow-emerald-500/20 mb-3 animate-bounce">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Booking Confirmed!
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Your reservation ref is{' '}
                <strong className="text-brand-600 dark:text-brand-400 font-mono">
                  {confirmedBooking.bookingId}
                </strong>
              </p>
            </div>

            {/* Printable Pass Component */}
            <PrintablePass
              booking={confirmedBooking}
              hall={selectedHall}
              user={user}
            />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        {currentStep < 5 ? (
          <>
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                  >
                    Cancel
                  </button>
                )
              )}
            </div>

            <div>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Validating...' : 'Confirm & Reserve Slot'}
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => {
                if (onCancel) onCancel();
                else window.location.hash = '#/my-bookings';
              }}
              className="px-6 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              View My Bookings
            </button>
            <button
              onClick={() => {
                if (onCancel) onCancel();
                else window.location.hash = '#/user/dashboard';
              }}
              className="px-6 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
