import React from 'react';
import { useAuth } from '../../hooks';
import { ThemeToggle } from './ThemeToggle';
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  CalendarCheck,
  User as UserIcon,
  Users as UsersIcon,
  BarChart3,
  LogOut,
  Sliders,
  Shield,
  Home,
  CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, isAdmin = false }) => {
  const { user, logout } = useAuth();

  const userNavItems = [
    { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { label: 'Browse Halls', path: '/halls', icon: Building2 },
    { label: 'Availability', path: '/availability', icon: CalendarDays },
    { label: 'My Bookings', path: '/my-bookings', icon: CalendarCheck },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: UsersIcon },
    { label: 'Halls', path: '/admin/halls', icon: Building2 },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Availability', path: '/admin/availability', icon: CalendarDays },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/90 backdrop-blur-md min-h-screen p-5">
      {/* Brand Header */}
      <div>
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 cursor-pointer group pb-6 border-b border-slate-100 dark:border-slate-800"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                HallBook
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isAdmin
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {isAdmin ? 'ADMIN' : 'STUDENT'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
              PBCST304 OOP Mini Project
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="mt-6 space-y-1.5">
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
            {isAdmin ? 'Administration Menu' : 'Student Portal'}
          </span>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('/')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Public Homepage</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Info & Footer Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {/* User Card */}
        {user && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <div className="h-8 w-8 rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xs shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 px-1">
          <ThemeToggle />
          <button
            onClick={logout}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
