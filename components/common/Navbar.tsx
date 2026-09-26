import React, { useState } from 'react';
import { useAuth } from '../../hooks';
import { ThemeToggle } from './ThemeToggle';
import {
  Building2,
  Menu,
  X,
  User as UserIcon,
  LogIn,
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  Info,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/', onNavigate }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = `#${path}`;
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Halls', path: '/halls' },
    { label: 'Availability', path: '/availability' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 dark:border-slate-800 dark:bg-slate-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-900 dark:from-white dark:via-brand-200 dark:to-indigo-200 bg-clip-text text-transparent">
                HallBook
              </span>
              <span className="rounded-md bg-brand-100 dark:bg-brand-950 px-1.5 py-0.5 text-[10px] font-bold text-brand-700 dark:text-brand-300">
                CAMPUS
              </span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block -mt-0.5">
              AI & ML Dept • 2026–27
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map(link => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-brand-500" />
                {isAdmin ? 'Admin Console' : 'My Dashboard'}
              </button>

              <button
                onClick={logout}
                title="Sign out"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/20 hover:shadow-brand-500/30 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-brand-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                  currentPath === link.path
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {isAdmin ? 'Admin Console' : 'Go to Dashboard'}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-semibold text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs text-center shadow-md"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
