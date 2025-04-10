'use client';

import { PlantFilters } from './filters';

export const PlantFiltersWrapper = () => {
  const handleFilterChange = (_filters: any) => {
    // TODO: Implement filter change logic
  };

  return <PlantFilters onFilterChange={handleFilterChange} />;
};
