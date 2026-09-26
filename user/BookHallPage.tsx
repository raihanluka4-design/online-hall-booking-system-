import React from 'react';
import { BookingWizard } from '../../components/booking/BookingWizard';
import { Booking } from '../../types';
import { Building2, CalendarPlus, ArrowLeft } from 'lucide-react';

interface BookHallPageProps {
  initialHallId?: string;
  onNavigate: (path: string) => void;
}

export const BookHallPage: React.FC<BookHallPageProps> = ({
  initialHallId,
  onNavigate,
}) => {
  const handleFinish = (_booking: Booking) => {
    // Handled in wizard (printable pass displayed)
  };

  return (
    <div className="py-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => onNavigate('/halls')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Halls Directory
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Campus Venue Reservation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Complete the 5-step guided reservation workflow with conflict-free instant verification.
          </p>
        </div>
      </div>

      <BookingWizard
        initialHallId={initialHallId}
        onFinish={handleFinish}
        onCancel={() => onNavigate('/user/dashboard')}
      />
    </div>
  );
};
