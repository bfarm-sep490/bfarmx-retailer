'use client';

import type { IIdentity, Order } from '@/types';
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
import { useGetIdentity } from '@refinedev/core';
import { useTable } from '@refinedev/react-table';
import { flexRender } from '@tanstack/react-table';
import Link from 'next/link';
import { useMemo } from 'react';

type Props = {
  refineCoreProps?: Partial<useTableProps<Order, HttpError, Order>>;
};

export const OrdersTable = ({ refineCoreProps }: Props) => {
  const { data: user } = useGetIdentity<IIdentity>();

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
                <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">
                          Đơn hàng #
                          {order.id}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {order.plant_name}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
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

                    <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PackageIcon className="h-4 w-4" />
                        <span>{order.packaging_type_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(order.estimate_pick_up_date).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="truncate">{order.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{order.phone}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Số lượng đặt hàng</p>
                        <p className="text-base font-semibold text-foreground">
                          {order.preorder_quantity}
                          {' '}
                          kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Tiền đặt cọc</p>
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
    setPageIndex,
  } = useTable<Order>({
    columns,
    refineCoreProps: {
      syncWithLocation: true,
      resource: 'orders',
      filters: {
        permanent: [
          {
            field: 'retailer_id',
            operator: 'eq',
            value: user?.id,
          },
        ],
      },
      initialPageSize: 6,
      pagination: {
        mode: 'client',
      },
      ...(refineCoreProps || {}),
    },
  });

  const rows = getRowModel().rows;
  const pageIndex = pagination?.pageIndex ?? 0;

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-8 text-center">
        <InboxIcon className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium text-foreground">Không có đơn hàng nào</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Hiện tại không có đơn hàng nào. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(row => (
          <div key={row.id} className="w-full">
            {row.getVisibleCells().map(cell => (
              <div key={cell.id} className="w-full">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-4 py-4">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Trang
          {' '}
          {pageIndex + 1}
          {' '}
          của
          {' '}
          {getPageOptions().length}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => previousPage()}
            disabled={!getCanPreviousPage()}
            className="h-8 w-8"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {getPageOptions().map(page => (
              <Button
                key={page}
                variant={pageIndex === page ? 'default' : 'outline'}
                onClick={() => setPageIndex(page)}
                className="h-8 w-8 p-0"
              >
                {page + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => nextPage()}
            disabled={!getCanNextPage()}
            className="h-8 w-8"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
