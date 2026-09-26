import React, { useState } from 'react';
import { useBookingContext } from '../../hooks';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FacilityIcon } from '../../components/halls/FacilityIcon';
import { SlotSelector } from '../../components/booking/SlotSelector';
import { getTodayString, getMaxBookingDateString, formatDate } from '../../utils/dateUtils';
import {
  MapPin,
  Users,
  Building2,
  Calendar,
  Clock,
  ShieldAlert,
  ArrowLeft,
  CalendarPlus,
  Info,
} from 'lucide-react';

interface HallDetailPageProps {
  hallId: string;
  onBack: () => void;
  onBookHall: (hallId: string, initialDate?: string, initialSlot?: string) => void;
}

export const HallDetailPage: React.FC<HallDetailPageProps> = ({
  hallId,
  onBack,
  onBookHall,
}) => {
  const { getHallById } = useBookingContext();
  const hall = getHallById(hallId);

  const [checkDate, setCheckDate] = useState<string>(getTodayString());
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  if (!hall) {
    return (
      <div className="py-20 max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Hall Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The requested hall ID does not exist or has been removed.</p>
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold shadow-md"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Halls
        </button>
      </div>
    );
  }

  const isAvailable = hall.status === 'AVAILABLE';

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Halls Directory
        </button>

        <StatusBadge status={hall.status} size="md" />
      </div>

      {/* Hero Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Large Image & Meta */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
            <img
              src={hall.image}
              alt={hall.hallName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider bg-brand-600/90 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
                {hall.type}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">{hall.hallName}</h1>
              <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 pt-1">
                <MapPin className="h-4 w-4 text-brand-400 shrink-0" />
                {hall.location}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="h-4 w-4 text-brand-500" /> Venue Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {hall.description}
            </p>
          </div>

          {/* Facilities Detail Section */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Included Facilities & Equipment
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hall.facilities.map((fac, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  <FacilityIcon name={fac} className="h-4 w-4 text-brand-500 shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Venue Usage Rules */}
          {hall.rules && hall.rules.length > 0 && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" /> Usage Guidelines & Rules
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                {hall.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Live Availability & Instant Booking Box */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Live Reservation Engine
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Check Availability & Book
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                  <Users className="h-3.5 w-3.5 text-brand-500" /> {hall.capacity} Max Seats
                </span>
                <span>•</span>
                <span>4 College Standard Slots</span>
              </div>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-brand-500" />
                Select Event Date
              </label>
              <input
                type="date"
                value={checkDate}
                min={getTodayString()}
                max={getMaxBookingDateString(60)}
                onChange={e => setCheckDate(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
              <p className="text-[11px] text-slate-400">
                Checking availability for: <strong className="text-brand-600 dark:text-brand-400">{formatDate(checkDate)}</strong>
              </p>
            </div>

            {/* Slot Matrix for Selected Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-500" />
                Available Time Slots
              </label>
              <SlotSelector
                hallId={hall.hallId}
                selectedDate={checkDate}
                selectedSlot={selectedSlot}
                onSelectSlot={slot => setSelectedSlot(slot)}
              />
            </div>

            {/* Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onBookHall(hall.hallId, checkDate, selectedSlot)}
                disabled={!isAvailable}
                className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition-all ${
                  isAvailable
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 hover:shadow-brand-500/35 hover:-translate-y-0.5'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                }`}
              >
                <CalendarPlus className="h-4 w-4" />
                {isAvailable ? 'Proceed to Book This Hall' : 'Hall Under Maintenance'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
