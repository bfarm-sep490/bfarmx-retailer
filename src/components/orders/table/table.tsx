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
import { useMemo } from 'react';

type Props = {
  refineCoreProps?: Partial<useTableProps<Order, HttpError, Order>>;
};

const statusOrder = {
  Pending: 1,
  PendingConfirmation: 2,
  Deposit: 3,
  Paid: 4,
  Cancel: 5,
} as const;

type StatusOrder = typeof statusOrder;
type StatusKey = keyof StatusOrder;

export const OrdersTable = ({ refineCoreProps }: Props) => {
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
                <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-primary/5 shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-foreground">
                          Đơn hàng #
                          {order.id}
                        </h3>
                        <p className="mt-1 text-sm text-foreground">
                          {order.plant_name}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                        order.status === 'Deposit'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'PendingConfirmation'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Pending'
                              ? 'bg-orange-100 text-orange-800'
                              : order.status === 'Paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                      }`}
                      >
                        {order.status === 'Deposit'
                          ? 'Đặt cọc'
                          : order.status === 'PendingConfirmation'
                            ? 'Chờ xác nhận'
                            : order.status === 'Pending'
                              ? 'Chờ thanh toán'
                              : order.status === 'Paid'
                                ? 'Đã thanh toán'
                                : 'Đã hủy'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <PackageIcon className="h-4 w-4" />
                        <span>{order.packaging_type_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(order.estimate_pick_up_date).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="truncate">{order.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{order.phone}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-sm text-foreground">Số lượng đặt hàng</p>
                        <p className="text-base font-semibold text-pretty">
                          {order.preorder_quantity}
                          {' '}
                          kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">Tiền đặt cọc</p>
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

  const rows = useMemo(() => {
    const sortedRows = getRowModel().rows;
    return sortedRows.sort((a, b) => {
      const statusA = statusOrder[a.original.status as StatusKey] || 999;
      const statusB = statusOrder[b.original.status as StatusKey] || 999;

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      return new Date(b.original.created_at).getTime() - new Date(a.original.created_at).getTime();
    });
  }, [getRowModel().rows]);

  const pageIndex = pagination?.pageIndex ?? 0;

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <InboxIcon className="h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Không có đơn hàng nào</h3>
        <p className="mt-1 text-sm text-foreground">
          Hiện tại không có đơn hàng nào. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {rows.map(row => (
          <div key={row.id}>
            {row.getVisibleCells().map(cell => (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => previousPage()}
            disabled={!getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => nextPage()}
            disabled={!getCanNextPage()}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-700">
            Trang
            {' '}
            {pageIndex + 1}
            {' '}
            của
            {' '}
            {getPageOptions().length}
          </span>
        </div>
      </div>
    </div>
  );
};
