'use client';

import { SearchIcon } from '@/components/icons';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo } from 'react';

type Props = {
  onSearch: (value: string) => void;
  onTypeChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
  searchValue: string;
  typeValue: string;
  priceRangeValue: string;
};

export const Filters = ({
  onSearch,
  onTypeChange,
  onPriceRangeChange,
  searchValue,
  typeValue,
  priceRangeValue,
}: Props) => {
  const types = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      { value: 'Rau lá', label: 'Rau lá' },
      { value: 'Gia vị', label: 'Gia vị' },
      { value: 'Củ', label: 'Củ' },
      { value: 'Quả', label: 'Quả' },
    ],
    [],
  );

  const priceRanges = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      { value: '0-15000', label: 'Dưới 15.000đ' },
      { value: '15000-25000', label: '15.000đ - 25.000đ' },
      { value: '25000-50000', label: '25.000đ - 50.000đ' },
      { value: '50000', label: 'Trên 50.000đ' },
    ],
    [],
  );

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Tìm kiếm cây trồng..."
          className="pl-9"
          value={searchValue}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select value={typeValue} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Loại cây" />
          </SelectTrigger>
          <SelectContent>
            {types.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priceRangeValue} onValueChange={onPriceRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Khoảng giá" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
