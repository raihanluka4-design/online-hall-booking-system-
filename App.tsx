import React, { useState, useEffect } from 'react';
import { useAuth, useToast } from './hooks';
import { PublicLayout } from './layouts/PublicLayout';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { BrowseHallsPage } from './pages/public/BrowseHallsPage';
import { HallDetailPage } from './pages/public/HallDetailPage';
import { AvailabilityPage } from './pages/public/AvailabilityPage';
import { AboutPage } from './pages/public/AboutPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// User Pages
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { BookHallPage } from './pages/user/BookHallPage';
import { MyBookingsPage } from './pages/user/MyBookingsPage';
import { ProfilePage } from './pages/user/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminHallsPage } from './pages/admin/AdminHallsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminAvailabilityPage } from './pages/admin/AdminAvailabilityPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';

// Modals
import { HallFormModal } from './components/admin/HallFormModal';

export const App: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const { warning } = useToast();

  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  });

  const [selectedHallId, setSelectedHallId] = useState<string>('');
  const [bookingHallId, setBookingHallId] = useState<string>('');
  const [isAdminAddHallOpen, setIsAdminAddHallOpen] = useState(false);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = hash || '/';

      // Check if path is hall details (e.g. /halls/HALL-01)
      if (path.startsWith('/halls/') && path.length > 7) {
        const id = path.split('/')[2];
        setSelectedHallId(id);
      }

      setCurrentPath(path);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = `#${path}`;
  };

  const handleViewHallDetails = (hallId: string) => {
    setSelectedHallId(hallId);
    navigate(`/halls/${hallId}`);
  };

  const handleBookHall = (hallId?: string) => {
    if (!isAuthenticated) {
      warning('Login Required', 'Please sign in to complete a hall reservation.');
      navigate('/login');
      return;
    }
    if (hallId) setBookingHallId(hallId);
    navigate('/book');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-500">Initializing HallBook...</span>
        </div>
      </div>
    );
  }

  // --- Route Guarding ---
  const isUserRoute = currentPath.startsWith('/user/') || currentPath === '/book' || currentPath === '/my-bookings' || (currentPath === '/profile' && !isAdmin);
  const isAdminRoute = currentPath.startsWith('/admin/') || (currentPath === '/profile' && isAdmin);

  if (isUserRoute && !isAuthenticated) {
    return (
      <PublicLayout currentPath="/login" onNavigate={navigate}>
        <LoginPage onNavigate={navigate} />
      </PublicLayout>
    );
  }

  if (isAdminRoute && (!isAuthenticated || !isAdmin)) {
    return (
      <PublicLayout currentPath="/login" onNavigate={navigate}>
        <div className="py-20 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Admin Access Restricted</h2>
          <p className="text-xs text-slate-500">You must be logged in as an administrator (admin@example.com) to view this page.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md"
          >
            Sign in as Admin
          </button>
        </div>
      </PublicLayout>
    );
  }

  // --- Render by Route & Layout ---

  // 1. Admin Layout Routes
  if (isAdminRoute) {
    return (
      <AdminLayout
        currentPath={currentPath}
        onNavigate={navigate}
        action={
          <button
            onClick={() => setIsAdminAddHallOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm hover:bg-brand-700 transition-all"
          >
            + Add Hall
          </button>
        }
      >
        {currentPath === '/admin/dashboard' && (
          <AdminDashboardPage
            onNavigate={navigate}
            onAddHall={() => setIsAdminAddHallOpen(true)}
          />
        )}
        {currentPath === '/admin/users' && <AdminUsersPage />}
        {currentPath === '/admin/halls' && <AdminHallsPage />}
        {currentPath === '/admin/bookings' && <AdminBookingsPage />}
        {currentPath === '/admin/availability' && <AdminAvailabilityPage />}
        {currentPath === '/admin/reports' && <AdminReportsPage />}
        {currentPath === '/profile' && <ProfilePage />}

        {/* Global Admin Add Hall Modal */}
        <HallFormModal
          isOpen={isAdminAddHallOpen}
          onClose={() => setIsAdminAddHallOpen(false)}
        />
      </AdminLayout>
    );
  }

  // 2. User Layout Routes
  if (isUserRoute) {
    return (
      <UserLayout
        currentPath={currentPath}
        onNavigate={navigate}
        title={
          currentPath === '/user/dashboard'
            ? 'Student Dashboard'
            : currentPath === '/book'
            ? 'Venue Booking Wizard'
            : currentPath === '/my-bookings'
            ? 'My Reservations'
            : 'Personal Profile'
        }
      >
        {currentPath === '/user/dashboard' && (
          <UserDashboardPage
            onNavigate={navigate}
            onBookHall={handleBookHall}
          />
        )}
        {currentPath === '/book' && (
          <BookHallPage
            initialHallId={bookingHallId}
            onNavigate={navigate}
          />
        )}
        {currentPath === '/my-bookings' && (
          <MyBookingsPage
            onNavigate={navigate}
            onBookHall={() => handleBookHall()}
          />
        )}
        {currentPath === '/profile' && <ProfilePage />}
      </UserLayout>
    );
  }

  // 3. Public Layout Routes
  return (
    <PublicLayout currentPath={currentPath} onNavigate={navigate}>
      {currentPath === '/' && (
        <LandingPage
          onNavigate={navigate}
          onBookHall={handleBookHall}
          onViewHallDetails={handleViewHallDetails}
        />
      )}
      {currentPath === '/halls' && (
        <BrowseHallsPage
          onViewHallDetails={handleViewHallDetails}
          onBookHall={handleBookHall}
        />
      )}
      {currentPath.startsWith('/halls/') && (
        <HallDetailPage
          hallId={selectedHallId || 'HALL-01'}
          onBack={() => navigate('/halls')}
          onBookHall={(id) => handleBookHall(id)}
        />
      )}
      {currentPath === '/availability' && (
        <AvailabilityPage
          onBookHall={handleBookHall}
          onViewHallDetails={handleViewHallDetails}
        />
      )}
      {currentPath === '/how-it-works' && (
        <LandingPage
          onNavigate={navigate}
          onBookHall={handleBookHall}
          onViewHallDetails={handleViewHallDetails}
        />
      )}
      {currentPath === '/about' && <AboutPage />}
      {currentPath === '/login' && <LoginPage onNavigate={navigate} />}
      {currentPath === '/register' && <RegisterPage onNavigate={navigate} />}
      {currentPath === '/forgot-password' && <ForgotPasswordPage onNavigate={navigate} />}
    </PublicLayout>
  );
};
export default App;
