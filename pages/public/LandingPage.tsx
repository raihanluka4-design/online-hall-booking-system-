import React from 'react';
import { HeroSection } from '../../components/landing/HeroSection';
import { StatsSection } from '../../components/landing/StatsSection';
import { FeaturesSection } from '../../components/landing/FeaturesSection';
import { HowItWorksSection } from '../../components/landing/HowItWorksSection';
import { ProjectBanner } from '../../components/landing/ProjectBanner';
import { HallCard } from '../../components/halls/HallCard';
import { useBookingContext } from '../../hooks';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onBookHall: (hallId: string) => void;
  onViewHallDetails: (hallId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onBookHall,
  onViewHallDetails,
}) => {
  const { halls } = useBookingContext();
  const featuredHalls = halls.slice(0, 3);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection
        onExplore={() => onNavigate('/halls')}
        onGetStarted={() => onNavigate('/register')}
      />

      {/* 2. Stats Section */}
      <StatsSection />

      {/* 3. Featured Halls Preview */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-900">
                Campus Venues
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                Popular Academic Halls
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Explore campus seminar halls, conference suites and computing centers.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/halls')}
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors self-start sm:self-auto"
            >
              View All {halls.length} Halls
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredHalls.map(hall => (
              <HallCard
                key={hall.hallId}
                hall={hall}
                onViewDetails={onViewHallDetails}
                onBookNow={onBookHall}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Core Features Section */}
      <FeaturesSection />

      {/* 5. How It Works Section */}
      <HowItWorksSection onBookNow={() => onNavigate('/halls')} />

      {/* 6. College Project Banner */}
      <ProjectBanner />
    </div>
  );
};
