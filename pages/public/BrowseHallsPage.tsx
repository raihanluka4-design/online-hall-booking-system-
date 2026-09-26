import React, { useState, useMemo } from 'react';
import { useBookingContext } from '../../hooks';
import { HallCard } from '../../components/halls/HallCard';
import { HallFilters } from '../../components/halls/HallFilters';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { Building2 } from 'lucide-react';

interface BrowseHallsPageProps {
  onViewHallDetails: (hallId: string) => void;
  onBookHall: (hallId: string) => void;
}

export const BrowseHallsPage: React.FC<BrowseHallsPageProps> = ({
  onViewHallDetails,
  onBookHall,
}) => {
  const { halls, isLoading } = useBookingContext();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedFacility, setSelectedFacility] = useState('ALL');
  const [minCapacity, setMinCapacity] = useState(0);

  const filteredHalls = useMemo(() => {
    return halls.filter(hall => {
      // Search text query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = hall.hallName.toLowerCase().includes(q);
        const matchesLoc = hall.location.toLowerCase().includes(q);
        const matchesDesc = hall.description.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesDesc) return false;
      }

      // Hall Type
      if (selectedType !== 'ALL' && hall.type !== selectedType) {
        return false;
      }

      // Facility
      if (selectedFacility !== 'ALL') {
        const hasFac = hall.facilities.some(
          f => f.toLowerCase() === selectedFacility.toLowerCase()
        );
        if (!hasFac) return false;
      }

      // Min Capacity
      if (minCapacity > 0 && hall.capacity < minCapacity) {
        return false;
      }

      return true;
    });
  }, [halls, search, selectedType, selectedFacility, minCapacity]);

  const handleReset = () => {
    setSearch('');
    setSelectedType('ALL');
    setSelectedFacility('ALL');
    setMinCapacity(0);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 text-xs font-bold mb-2">
          <Building2 className="h-3.5 w-3.5" />
          Campus Facilities
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Find Your Perfect Hall
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore auditoriums, lecture halls, and labs available for college events and workshops.
        </p>
      </div>

      {/* Filter Toolbar */}
      <HallFilters
        search={search}
        onSearchChange={setSearch}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedFacility={selectedFacility}
        onFacilityChange={setSelectedFacility}
        minCapacity={minCapacity}
        onCapacityChange={setMinCapacity}
        onReset={handleReset}
      />

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredHalls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredHalls.map(hall => (
            <HallCard
              key={hall.hallId}
              hall={hall}
              onViewDetails={onViewHallDetails}
              onBookNow={onBookHall}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No Halls Found"
          description="No campus halls matched your current search filters. Try clearing some criteria."
          actionText="Reset All Filters"
          onAction={handleReset}
        />
      )}
    </div>
  );
};
