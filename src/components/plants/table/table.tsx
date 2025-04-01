'use client';

import type { Plant } from '@/types';
import type { HttpError, useTableProps } from '@refinedev/core';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InboxIcon,
} from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useTable } from '@refinedev/react-table';
import { flexRender } from '@tanstack/react-table';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AddToCartPopup } from '../add-to-cart-popup';
import { Filters } from '../filters/filters';

type Props = {
  refineCoreProps?: Partial<useTableProps<Plant, HttpError, Plant>>;
};

export const PlantsTable = ({ refineCoreProps }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const [typeValue, setTypeValue] = useState('all');
  const [priceRangeValue, setPriceRangeValue] = useState('all');
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
                <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-square overflow-hidden">
                    <img
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={plant.image_url}
                      alt={`Hình ảnh ${plant.plant_name}`}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="text-sm font-bold text-gray-800">
                      {plant.plant_name}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        {plant.type}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        {plant.quantity}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm font-bold text-primary">
                        {plant.base_price.toLocaleString('vi-VN')}
                        đ
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedPlant(plant);
                        }}
                      >
                        +
                      </Button>
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
  } = useTable<Plant>({
    columns,
    refineCoreProps: {
      syncWithLocation: true,
      resource: 'plants',
      initialPageSize: 20,
      pagination: {
        mode: 'client',
      },
      ...(refineCoreProps || {}),
    },
  });

  const rows = getRowModel().rows;
  const pageIndex = pagination?.pageIndex ?? 0;
  const pageSize = pagination?.pageSize ?? 20;

  // Lọc dữ liệu theo search và filter
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const plant = row.original;
      const matchesSearch = plant.plant_name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const matchesType = typeValue === 'all' || plant.type === typeValue;
      const matchesPrice = priceRangeValue === 'all' || (() => {
        const price = plant.base_price;
        switch (priceRangeValue) {
          case '0-15000':
            return price <= 15000;
          case '15000-25000':
            return price > 15000 && price <= 25000;
          case '25000-50000':
            return price > 25000 && price <= 50000;
          case '50000':
            return price > 50000;
          default:
            return true;
        }
      })();
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [rows, searchValue, typeValue, priceRangeValue]);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <InboxIcon className="h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Không có cây trồng nào</h3>
        <p className="mt-1 text-sm text-gray-500">
          Hiện tại không có cây trồng nào có sẵn. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Filters
        searchValue={searchValue}
        typeValue={typeValue}
        priceRangeValue={priceRangeValue}
        onSearch={setSearchValue}
        onTypeChange={setTypeValue}
        onPriceRangeChange={setPriceRangeValue}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
            <div className="flex items-center justify-between border-t px-4 py-4">
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
                cây trồng
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
