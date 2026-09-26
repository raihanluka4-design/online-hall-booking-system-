import React from 'react';
import { Booking, Hall, User } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { triggerPrint } from '../../utils/exportUtils';
import { Printer, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, Users, Building2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface PrintablePassProps {
  booking: Booking;
  hall?: Hall;
  user?: User | null;
  onClose?: () => void;
}

export const PrintablePass: React.FC<PrintablePassProps> = ({ booking, hall, user, onClose }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Action Header */}
      <div className="flex items-center justify-between no-print">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Official College Reservation Pass
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={triggerPrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-md transition-all"
          >
            <Printer className="h-4 w-4" />
            Print Pass
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Printable Card Area */}
      <div
        id="printable-receipt"
        className="rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 md:p-8 shadow-xl relative overflow-hidden"
      >
        {/* Decorative Watermark Badge */}
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <Building2 className="w-48 h-48 text-brand-600" />
        </div>

        {/* College Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="h-4 w-4" />
            PBCST304 OOP Mini Project • AI & ML Dept
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            HALLBOOK RESERVATION PASS
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Academic Year 2026–27 • Department of Artificial Intelligence & Machine Learning
          </p>
        </div>

        {/* Pass Key Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 mb-6">
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">
              Booking Ref
            </span>
            <p className="text-base font-mono font-bold text-brand-600 dark:text-brand-400 mt-0.5">
              {booking.bookingId}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">
              Status
            </span>
            <div className="mt-0.5">
              <StatusBadge status={booking.status} size="sm" />
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">
              Booked Date
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">
              Verification
            </span>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
            </p>
          </div>
        </div>

        {/* Hall & Schedule Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Venue Specifications</h4>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {hall?.hallName || booking.hallId}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {hall?.location || 'Campus Facility'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  Max Capacity: {hall?.capacity || 'Standard'} seats
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Reserved Schedule</h4>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <Calendar className="h-4 w-4 text-brand-500" />
                {formatDate(booking.date)}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400">
                <Clock className="h-4 w-4" />
                {booking.timeSlot}
              </div>
            </div>
          </div>
        </div>

        {/* Event Purpose & Reserving Party */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400">Event Purpose</span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">
                {booking.purpose}
              </p>
              {booking.attendees && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Expected Attendees: <span className="font-semibold">{booking.attendees}</span>
                </p>
              )}
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400">Reserved For / Applicant</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {user?.name || 'Authorized College User'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email || 'N/A'} • {user?.department || 'AI & ML Dept'}
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Visual & Footer Verification */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm">
            <p className="font-medium text-slate-700 dark:text-slate-300 mb-0.5">Instructions & Rules:</p>
            <p>Please present this digital or printed pass to the campus facility manager upon arrival. Equipment power-off check required after event.</p>
          </div>

          <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            {/* SVG Simulated QR Code */}
            <svg className="w-12 h-12 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h-2v2h2v-2zm-4 0h2v2h-2v-2zm2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-6 0h2v2h-2v-2zm4-4h2v2h-2v-2zm-4-2h2v2h-2v-2z" />
            </svg>
            <div className="text-[10px] text-slate-400 leading-tight">
              <span className="font-mono block font-bold text-slate-800 dark:text-slate-200">HB-DIGITAL-SIGN</span>
              <span>Valid for Session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
