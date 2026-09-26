import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface HallFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedFacility: string;
  onFacilityChange: (value: string) => void;
  minCapacity: number;
  onCapacityChange: (value: number) => void;
  onReset: () => void;
}

const HALL_TYPES = ['ALL', 'Auditorium', 'Seminar Hall', 'Conference Hall', 'Computer Lab', 'Mini Hall'];
const FACILITY_OPTIONS = [
  'ALL',
  'Projector',
  'Air Conditioning',
  'Wi-Fi',
  'Sound System',
  'Stage',
  'Computers',
  'Parking',
];

export const HallFilters: React.FC<HallFiltersProps> = ({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedFacility,
  onFacilityChange,
  minCapacity,
  onCapacityChange,
  onReset,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 mb-8 space-y-4">
      {/* Search and Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search halls by name, block, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all dark:text-white"
          />
        </div>

        {/* Hall Type Dropdown */}
        <div>
          <select
            value={selectedType}
            onChange={e => onTypeChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all dark:text-white"
          >
            {HALL_TYPES.map(type => (
              <option key={type} value={type}>
                {type === 'ALL' ? 'All Hall Types' : type}
              </option>
            ))}
          </select>
        </div>

        {/* Facility Dropdown */}
        <div>
          <select
            value={selectedFacility}
            onChange={e => onFacilityChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all dark:text-white"
          >
            {FACILITY_OPTIONS.map(fac => (
              <option key={fac} value={fac}>
                {fac === 'ALL' ? 'All Facilities' : `Facility: ${fac}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Slider & Reset Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
            Min Capacity: <strong className="text-brand-600 dark:text-brand-400">{minCapacity} seats</strong>
          </span>
          <input
            type="range"
            min="0"
            max="500"
            step="25"
            value={minCapacity}
            onChange={e => onCapacityChange(Number(e.target.value))}
            className="w-36 accent-brand-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors self-end sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Filters
        </button>
      </div>
    </div>
  );
};
