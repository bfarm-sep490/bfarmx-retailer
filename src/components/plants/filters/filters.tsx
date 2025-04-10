'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useState } from 'react';

type FilterValues = {
  search: string;
  type: string;
  priceRange: string;
  sortBy: string;
  sortOrder: string;
};

type Props = {
  onFilterChange: (filters: FilterValues) => void;
};

export const PlantFilters = ({ onFilterChange }: Props) => {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    type: 'all',
    priceRange: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo tên cây trồng..."
          value={filters.search}
          onChange={e => handleFilterChange('search', e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-2 w-full">
          <label htmlFor="plant-type" className="text-sm font-medium text-foreground">Loại cây trồng</label>
          <Select value={filters.type} onValueChange={value => handleFilterChange('type', value)}>
            <SelectTrigger className="w-full" id="plant-type">
              <SelectValue placeholder="Chọn loại cây trồng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Rau">Rau</SelectItem>
              <SelectItem value="Củ">Củ</SelectItem>
              <SelectItem value="Quả">Quả</SelectItem>
              <SelectItem value="Hoa">Hoa</SelectItem>
              <SelectItem value="Cây cảnh">Cây cảnh</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
