'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  searchValue: string;
  statusValue: string;
  onSearch: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export const Filters = ({
  searchValue,
  statusValue,
  onSearch,
  onStatusChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm md:flex-row md:items-center">
      <div className="flex-1">
        <Input
          placeholder="Tìm kiếm theo mã đơn hàng hoặc tên cây trồng..."
          value={searchValue}
          onChange={e => onSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="w-full md:w-48">
        <Select value={statusValue} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả đơn hàng</SelectItem>
            <SelectItem value="Deposit">Đặt cọc</SelectItem>
            <SelectItem value="Pending">Chờ thanh toán</SelectItem>
            <SelectItem value="Paid">Đã thanh toán</SelectItem>
            <SelectItem value="Cancel">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
