import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse">
    <div className="h-48 w-full rounded-2xl bg-slate-200 dark:bg-slate-800 mb-4" />
    <div className="h-6 w-3/4 rounded-md bg-slate-200 dark:bg-slate-800 mb-2" />
    <div className="h-4 w-1/2 rounded-md bg-slate-200 dark:bg-slate-800 mb-4" />
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
    <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
  </div>
);

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800/60">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 w-full max-w-[120px] rounded bg-slate-200 dark:bg-slate-800" />
      </td>
    ))}
  </tr>
);

export const StatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800 mb-3" />
        <div className="h-8 w-1/3 rounded bg-slate-200 dark:bg-slate-800 mb-2" />
        <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    ))}
  </div>
);
