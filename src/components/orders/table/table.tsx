'use client';

import type { Order } from '@/types';
import type { HttpError, useTableProps } from '@refinedev/core';
import type { ColumnDef } from '@tanstack/react-table';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InboxIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
} from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useTable } from '@refinedev/react-table';
import { flexRender } from '@tanstack/react-table';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Filters } from '../filters/filters';

type Props = {
  refineCoreProps?: Partial<useTableProps<Order, HttpError, Order>>;
};

export const OrdersTable = ({ refineCoreProps }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const [statusValue, setStatusValue] = useState('all');

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: 'order',
        accessorFn: row => row,
        cell: function render({ row }) {
          const order = row.original;

          return (
            <div className="block">
              <Link href={`/orders/${order.id}`} className="block">
                <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          Đơn hàng #
                          {order.id}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {order.plant_name}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                        order.status === 'Deposit'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'Pending'
                            ? 'bg-orange-100 text-orange-800'
                            : order.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                      }`}
                      >
                        {order.status === 'Deposit'
                          ? 'Đặt cọc'
                          : order.status === 'Pending'
                            ? 'Chờ thanh toán'
                            : order.status === 'Paid'
                              ? 'Đã thanh toán'
                              : 'Đã hủy'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PackageIcon className="h-4 w-4" />
                        <span>{order.packaging_type_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(order.estimate_pick_up_date).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="truncate">{order.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{order.phone}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-sm text-gray-500">Số lượng đặt hàng</p>
                        <p className="text-base font-semibold text-gray-900">
                          {order.preorder_quantity}
                          {' '}
                          kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Tiền đặt cọc</p>
                        <p className="text-base font-semibold text-primary">
                          {order.deposit_price.toLocaleString('vi-VN')}
                          đ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        },
      },
    ],
    [],
  );

  const {
    options: {
      state: { pagination },
    },
    getRowModel,
    setPageIndex,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    nextPage,
    previousPage,
  } = useTable<Order>({
    columns,
    refineCoreProps: {
      syncWithLocation: true,
      resource: 'orders',
      initialPageSize: 6,
      pagination: {
        mode: 'client',
      },
      ...(refineCoreProps || {}),
    },
  });

  const rows = getRowModel().rows;
  const pageIndex = pagination?.pageIndex ?? 0;
  const pageSize = pagination?.pageSize ?? 12;

  // Lọc dữ liệu theo search và filter
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const order = row.original;
      const matchesSearch
        = order.id.toString().includes(searchValue)
          || order.plant_name.toLowerCase().includes(searchValue.toLowerCase());
      const matchesStatus = statusValue === 'all' || order.status === statusValue;
      return matchesSearch && matchesStatus;
    });
  }, [rows, searchValue, statusValue]);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <InboxIcon className="h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Không có đơn hàng nào</h3>
        <p className="mt-1 text-sm text-gray-500">
          Hiện tại không có đơn hàng nào. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Filters
        searchValue={searchValue}
        statusValue={statusValue}
        onSearch={setSearchValue}
        onStatusChange={setStatusValue}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRows.map((row) => {
          return (
            <div key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <div key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {filteredRows.length === 0
        ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <InboxIcon className="h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Không tìm thấy kết quả</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vui lòng thử lại với bộ lọc khác.
              </p>
            </div>
          )
        : (
            <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm">
              <div className="text-sm text-gray-500">
                Hiển thị
                {' '}
                {pageIndex * pageSize + 1}
                {' '}
                đến
                {' '}
                {Math.min((pageIndex + 1) * pageSize, filteredRows.length)}
                {' '}
                trong tổng số
                {' '}
                {filteredRows.length}
                {' '}
                đơn hàng
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => previousPage()}
                  disabled={!getCanPreviousPage()}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                {getPageOptions().map(page => (
                  <Button
                    key={page}
                    variant={pageIndex === page ? 'default' : 'outline'}
                    onClick={() => setPageIndex(page)}
                  >
                    {page + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => nextPage()}
                  disabled={!getCanNextPage()}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
    </div>
  );
};
