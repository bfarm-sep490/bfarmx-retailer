'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo mã đơn hàng hoặc tên cây trồng..."
          value={searchValue}
          onChange={e => onSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="space-y-2 w-full">
          <Select value={statusValue} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full" id="plant-type">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả đơn hàng</SelectItem>
              <SelectItem value="PendingConfirmation">Chờ xác nhận</SelectItem>
              <SelectItem value="Pending">Chờ thanh toán</SelectItem>
              <SelectItem value="Deposit">Đặt cọc</SelectItem>
              <SelectItem value="Paid">Đã thanh toán</SelectItem>
              <SelectItem value="Cancel">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
