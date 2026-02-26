'use client';

import type { Plant } from '@/types';
import type { HttpError, useTableProps } from '@refinedev/core';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTable } from '@refinedev/react-table';
import { flexRender } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Clock, DollarSign, Inbox } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AddToCartPopup } from '../add-to-cart-popup';

type Props = {
  refineCoreProps?: Partial<useTableProps<Plant, HttpError, Plant>>;
};

export const PlantsTable = ({ refineCoreProps }: Props) => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const columns = useMemo<ColumnDef<Plant>[]>(
    () => [
      {
        id: 'plant',
        accessorFn: row => row,
        cell: function render({ row }) {
          const plant = row.original;

          return (
            <div className="block">
              <Link href={`/plants/${plant.id}`} className="block">
                <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={plant.image_url}
                      alt={`Hình ảnh ${plant.plant_name}`}
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-foreground line-clamp-1">
                        {plant.plant_name}
                      </h3>
                      <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                        {plant.type}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Giá bán</div>
                          <div className="text-sm font-semibold text-primary">
                            {plant.base_price.toLocaleString('vi-VN')}
                            đ/kg
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Thời gian bảo quản</div>
                          <div className="text-sm font-semibold text-foreground">
                            {plant.preservation_day}
                            {' '}
                            ngày
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedPlant(plant);
                      }}
                    >
                      Thêm vào giỏ hàng
                    </Button>
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
  } = useTable<Plant>({
    columns,
    refineCoreProps: {
      pagination: {
        mode: 'client',
      },
      syncWithLocation: true,
      resource: 'plants',
      ...(refineCoreProps || {}),
    },
  });

  const rows = getRowModel().rows;
  const pageIndex = pagination?.pageIndex ?? 0;
  const pageSize = pagination?.pageSize ?? 20;

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-8 text-center">
        <Inbox className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium text-foreground">Không có cây trồng nào</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Hiện tại không có cây trồng nào có sẵn. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => {
          return (
            <div key={row.id} className="w-full">
              {row.getVisibleCells().map((cell) => {
                return (
                  <div key={cell.id} className="w-full">
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-4 py-4">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Hiển thị
          {' '}
          {pageIndex * pageSize + 1}
          {' '}
          đến
          {' '}
          {Math.min((pageIndex + 1) * pageSize, rows.length)}
          {' '}
          trong tổng số
          {' '}
          {rows.length}
          {' '}
          cây trồng
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => previousPage()}
            disabled={!getCanPreviousPage()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
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
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedPlant && (
        <AddToCartPopup
          plant={selectedPlant}
          open={!!selectedPlant}
          onOpenChange={open => !open && setSelectedPlant(null)}
        />
      )}
    </div>
  );
};
