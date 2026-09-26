import React from 'react';
import { Hall, User } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { Calendar, Clock, MapPin, Users, CheckCircle, Building } from 'lucide-react';

interface BookingSummaryCardProps {
  hall: Hall;
  date: string;
  timeSlot: string;
  purpose: string;
  attendees?: number;
  user?: User | null;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  hall,
  date,
  timeSlot,
  purpose,
  attendees,
  user,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
      {/* Hall Header & Thumbnail */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <img
          src={hall.image}
          alt={hall.hallName}
          className="h-16 w-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              {hall.type}
            </span>
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">
            {hall.hallName}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-slate-400" />
            {hall.location}
          </p>
        </div>
      </div>

      {/* Reservation Specs Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Calendar className="h-3.5 w-3.5 text-brand-500" />
            <span>Reservation Date</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            {formatDate(date)}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Clock className="h-3.5 w-3.5 text-brand-500" />
            <span>Assigned Slot</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 truncate">
            {timeSlot}
          </p>
        </div>
      </div>

      {/* Purpose & Reserved For */}
      <div className="space-y-3 pt-2 text-xs">
        <div>
          <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Event Purpose</span>
          <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 font-medium text-slate-800 dark:text-slate-200">
            {purpose || 'Not specified'}
          </p>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-400" /> Expected Attendees:
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {attendees || 'General'}
          </span>
        </div>

        {user && (
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-slate-400" /> Applicant:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {user.name} ({user.department || 'AI & ML'})
            </span>
          </div>
        )}
      </div>

      {/* Confirmation Guarantee Banner */}
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs">
        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Instant validation & conflict-free reservation guarantee.</span>
      </div>
    </div>
  );
};
