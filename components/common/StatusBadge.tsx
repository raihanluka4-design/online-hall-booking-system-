import React from 'react';
import { BookingStatus, HallStatus, UserStatus } from '../../types';

interface StatusBadgeProps {
  status: BookingStatus | HallStatus | UserStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status.toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let dotColor = 'bg-slate-400';

  if (s === 'CONFIRMED' || s === 'AVAILABLE' || s === 'ACTIVE') {
    styles = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
    dotColor = 'bg-emerald-500';
  } else if (s === 'PENDING' || s === 'MAINTENANCE') {
    styles = 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
    dotColor = 'bg-amber-500';
  } else if (s === 'COMPLETED') {
    styles = 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
    dotColor = 'bg-blue-500';
  } else if (s === 'CANCELLED' || s === 'DISABLED' || s === 'INACTIVE') {
    styles = 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
    dotColor = 'bg-rose-500';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${sizeClasses[size]} ${styles} transition-colors`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`} />
      {status}
    </span>
  );
};
