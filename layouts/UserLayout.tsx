import React, { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { ToastContainer } from '../components/common/Toast';
import { useAuth } from '../hooks';
import {
  Menu,
  X,
  Bell,
  Building2,
  CalendarPlus,
  LayoutDashboard,
  CalendarCheck,
  User as UserIcon,
  LogOut,
} from 'lucide-react';

interface UserLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
  title,
  subtitle,
  action,
}) => {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { label: 'Browse Halls', path: '/halls', icon: Building2 },
    { label: 'Book Hall', path: '/book', icon: CalendarPlus },
    { label: 'My Bookings', path: '/my-bookings', icon: CalendarCheck },
    { label: 'My Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop Left Sidebar */}
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} isAdmin={false} />

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 bg-white dark:bg-slate-900 h-full p-6 flex flex-col justify-between shadow-2xl z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm">HallBook Portal</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 rounded-lg text-slate-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-1.5">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-brand-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  logout();
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-rose-600 font-bold text-xs"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {title || 'Student Dashboard'}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {action}

            {/* Notifications toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-40 text-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200">System Notifications</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-bold">
                      Online
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    🎉 Welcome to <strong>HallBook</strong>. You can book campus venues up to 60 days in advance with automatic conflict prevention.
                  </p>
                </div>
              )}
            </div>

            <ThemeToggle />

            {/* Quick Profile Badge */}
            {user && (
              <div
                onClick={() => onNavigate('/profile')}
                className="flex items-center gap-2 pl-2 cursor-pointer"
              >
                <div className="h-8 w-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
