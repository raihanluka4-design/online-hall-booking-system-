import React from 'react';
import { STANDARD_TIME_SLOTS } from '../../types';
import { bookingService, SlotAvailability } from '../../services/bookingService';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface SlotSelectorProps {
  hallId: string;
  selectedDate: string;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
  excludeBookingId?: string;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({
  hallId,
  selectedDate,
  selectedSlot,
  onSelectSlot,
  excludeBookingId,
}) => {
  if (!hallId || !selectedDate) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        Please select a hall and a date to view available time slots.
      </div>
    );
  }

  const slotData: SlotAvailability[] = bookingService.getSlotAvailability(hallId, selectedDate);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
        <span className="font-semibold uppercase tracking-wider">Select College Time Slot:</span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Available
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-400" /> Booked
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slotData.map(item => {
          // If this is the current booking being modified, allow selecting it
          const isCurrentModified = excludeBookingId && item.booking?.bookingId === excludeBookingId;
          const isAvailable = item.isAvailable || isCurrentModified;
          const isSelected = selectedSlot === item.timeSlot;

          return (
            <button
              key={item.timeSlot}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectSlot(item.timeSlot)}
              className={`relative flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 ${
                !isAvailable
                  ? 'bg-slate-100/70 border-slate-200 dark:bg-slate-800/40 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-75'
                  : isSelected
                  ? 'bg-brand-50 border-brand-500 dark:bg-brand-950/40 dark:border-brand-500 text-brand-900 dark:text-brand-100 shadow-md ring-2 ring-brand-500/20'
                  : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock
                  className={`h-4 w-4 shrink-0 ${
                    !isAvailable
                      ? 'text-slate-400'
                      : isSelected
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-500'
                  }`}
                />
                <span className="text-xs sm:text-sm font-semibold tracking-tight">{item.timeSlot}</span>
              </div>

              <div>
                {isAvailable ? (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {isSelected ? 'Selected' : 'Available'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <XCircle className="h-3 w-3" />
                    Booked
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
