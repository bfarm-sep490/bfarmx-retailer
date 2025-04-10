'use client';

import { useState } from 'react';
import { Filters } from './filters';

export const OrderFiltersWrapper = () => {
  const [searchValue, setSearchValue] = useState('');
  const [statusValue, setStatusValue] = useState('PendingConfirmation');

  return (
    <div className="space-y-4">
      <Filters
        searchValue={searchValue}
        statusValue={statusValue}
        onSearch={setSearchValue}
        onStatusChange={setStatusValue}
      />
    </div>
  );
};
