import React from 'react';
import { Hall } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { FacilityIcon } from './FacilityIcon';
import { MapPin, Users, ArrowRight, CalendarPlus } from 'lucide-react';

interface HallCardProps {
  hall: Hall;
  onViewDetails: (hallId: string) => void;
  onBookNow: (hallId: string) => void;
}

export const HallCard: React.FC<HallCardProps> = ({ hall, onViewDetails, onBookNow }) => {
  const isAvailable = hall.status === 'AVAILABLE';

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-premium-hover transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
      {/* Hall Image & Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={hall.image}
          alt={hall.hallName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <span className="rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
            {hall.type}
          </span>
          <StatusBadge status={hall.status} size="sm" />
        </div>

        {/* Bottom Image Overlay Meta */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
            <MapPin className="h-3.5 w-3.5 text-brand-400" />
            <span className="truncate max-w-[150px]">{hall.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
            <Users className="h-3.5 w-3.5 text-brand-400" />
            <span>{hall.capacity} Seats</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onViewDetails(hall.hallId)}
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors"
          >
            {hall.hallName}
          </h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {hall.description}
          </p>

          {/* Facilities Preview */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
              Key Facilities
            </span>
            <div className="flex flex-wrap gap-2">
              {hall.facilities.slice(0, 4).map((facility, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50 text-xs text-slate-700 dark:text-slate-300"
                >
                  <FacilityIcon name={facility} className="h-3.5 w-3.5 text-brand-500" />
                  <span>{facility}</span>
                </div>
              ))}
              {hall.facilities.length > 4 && (
                <span className="text-xs text-slate-400 self-center">
                  +{hall.facilities.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
          <button
            onClick={() => onViewDetails(hall.hallId)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onBookNow(hall.hallId)}
            disabled={!isAvailable}
            className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
              isAvailable
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-indigo-500/20 hover:shadow-indigo-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
            }`}
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            {isAvailable ? 'Book Now' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};
