import React, { useState } from 'react';
import { useBookingContext, useToast } from '../../hooks';
import { bookingService, HallAvailabilityMatrix } from '../../services/bookingService';
import { STANDARD_TIME_SLOTS, HallStatus } from '../../types';
import { getTodayString, getMaxBookingDateString, formatDate } from '../../utils/dateUtils';
import { CalendarDays, Calendar, Clock, CheckCircle2, XCircle, Wrench, ShieldAlert } from 'lucide-react';

export const AdminAvailabilityPage: React.FC = () => {
  const { halls, updateHall } = useBookingContext();
  const { success } = useToast();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const matrix: HallAvailabilityMatrix[] = bookingService.getAvailabilityMatrix(selectedDate);

  const handleToggleMaintenance = async (hallId: string, currentStatus: HallStatus) => {
    const newStatus: HallStatus = currentStatus === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
    await updateHall(hallId, { status: newStatus });
    success(
      `Hall Status Changed`,
      `${hallId} is now marked as ${newStatus.toLowerCase()}.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <CalendarDays className="h-3.5 w-3.5" /> Institutional Slot Schedule
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Campus Availability & Slot Controller
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-time slot bookings across campus and toggle maintenance restrictions.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Calendar className="h-4 w-4 text-brand-500" />
          <input
            type="date"
            value={selectedDate}
            min={getTodayString()}
            max={getMaxBookingDateString(60)}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Date Notice */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-xs">
        <span className="text-slate-700 dark:text-slate-300">
          Showing real-time campus schedule for: <strong className="text-brand-600 dark:text-brand-400">{formatDate(selectedDate)}</strong>
        </span>
        <span className="font-semibold text-slate-500">4 College Academic Slots</span>
      </div>

      {/* Matrix Cards */}
      <div className="space-y-4">
        {matrix.map(item => {
          const hall = halls.find(h => h.hallId === item.hallId);
          const isUnderMaintenance = item.status === 'MAINTENANCE';

          return (
            <div
              key={item.hallId}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                      {item.hallId}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.hallName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    {item.location} • {item.capacity} Seats Capacity
                  </p>
                </div>

                <button
                  onClick={() => hall && handleToggleMaintenance(hall.hallId, hall.status)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                    isUnderMaintenance
                      ? 'border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950'
                      : 'border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950'
                  }`}
                >
                  <Wrench className="h-3.5 w-3.5" />
                  {isUnderMaintenance ? 'Remove Maintenance' : 'Set Maintenance Mode'}
                </button>
              </div>

              {/* Slots Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {STANDARD_TIME_SLOTS.map(slot => {
                  const slotInfo = item.slots[slot];
                  const isAvailable = slotInfo?.isAvailable && !isUnderMaintenance;

                  return (
                    <div
                      key={slot}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                        isAvailable
                          ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100'
                          : 'bg-slate-100/70 border-slate-200 dark:bg-slate-800/40 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>
                        <span className="font-bold block text-[11px]">{slot}</span>
                        <span className="text-[10px] opacity-80">
                          {isUnderMaintenance
                            ? 'Under Maintenance'
                            : isAvailable
                            ? 'Available'
                            : `Booked: ${slotInfo?.bookingId || 'Reserved'}`}
                        </span>
                      </div>

                      {isAvailable ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
