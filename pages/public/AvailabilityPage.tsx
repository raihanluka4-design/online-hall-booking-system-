import React, { useState } from 'react';
import { useBookingContext } from '../../hooks';
import { bookingService, HallAvailabilityMatrix } from '../../services/bookingService';
import { STANDARD_TIME_SLOTS } from '../../types';
import { getTodayString, getMaxBookingDateString, formatDate } from '../../utils/dateUtils';
import { Calendar, Clock, CheckCircle2, XCircle, Building2, MapPin, Users, CalendarPlus } from 'lucide-react';

interface AvailabilityPageProps {
  onBookHall: (hallId: string, initialDate?: string, initialSlot?: string) => void;
  onViewHallDetails: (hallId: string) => void;
}

export const AvailabilityPage: React.FC<AvailabilityPageProps> = ({
  onBookHall,
  onViewHallDetails,
}) => {
  const { halls } = useBookingContext();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const matrix: HallAvailabilityMatrix[] = bookingService.getAvailabilityMatrix(selectedDate);

  const filteredMatrix = matrix.filter(h => {
    if (selectedType !== 'ALL') {
      const hall = halls.find(hallObj => hallObj.hallId === h.hallId);
      if (hall && hall.type !== selectedType) return false;
    }
    return true;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
            <Clock className="h-3.5 w-3.5" />
            Live Reservation Grid
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Campus Availability Matrix
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time schedule of all 5 academic halls across standard college time slots.
          </p>
        </div>

        {/* Date Selector Tool */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 px-1">
            <Calendar className="h-4 w-4 text-brand-500" />
            <span>Select Date:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            min={getTodayString()}
            max={getMaxBookingDateString(60)}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>
      </div>

      {/* Date Banner & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
        <div className="text-xs text-slate-700 dark:text-slate-300">
          Showing availability for: <strong className="text-brand-600 dark:text-brand-400 text-sm">{formatDate(selectedDate)}</strong>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
            <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" /> Available for Booking
          </span>
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="h-3 w-3 rounded-full bg-slate-400 inline-block" /> Reserved / Unavailable
          </span>
        </div>
      </div>

      {/* Availability Matrix Table / Cards */}
      <div className="space-y-4">
        {filteredMatrix.map(item => {
          const isHallUnderMaintenance = item.status !== 'AVAILABLE';

          return (
            <div
              key={item.hallId}
              className="rounded-3xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Hall Meta Column */}
                <div className="lg:col-span-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md">
                      {item.hallId}
                    </span>
                    {isHallUnderMaintenance && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                        Maintenance
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => onViewHallDetails(item.hallId)}
                    className="text-lg font-bold text-slate-900 dark:text-white hover:text-brand-600 cursor-pointer transition-colors"
                  >
                    {item.hallName}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {item.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                      <Users className="h-3 w-3" /> {item.capacity} Seats
                    </span>
                  </div>
                </div>

                {/* Slots Grid Column */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {STANDARD_TIME_SLOTS.map(slot => {
                    const slotInfo = item.slots[slot];
                    const isAvailable = slotInfo?.isAvailable && !isHallUnderMaintenance;

                    return (
                      <div
                        key={slot}
                        className={`p-3 rounded-2xl border flex flex-col justify-between text-xs transition-all ${
                          isAvailable
                            ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100'
                            : 'bg-slate-100/80 border-slate-200 dark:bg-slate-800/40 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="font-bold text-[11px] leading-tight">{slot}</span>
                          {isAvailable ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          )}
                        </div>

                        {isAvailable ? (
                          <button
                            type="button"
                            onClick={() => onBookHall(item.hallId, selectedDate, slot)}
                            className="w-full mt-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            Book Slot
                          </button>
                        ) : (
                          <span className="block text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-lg">
                            {isHallUnderMaintenance ? 'Maintenance' : 'Booked'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
