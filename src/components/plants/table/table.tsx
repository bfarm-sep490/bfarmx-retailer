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
import { PlantFilters } from '../filters/filters';

type Props = {
  refineCoreProps?: Partial<useTableProps<Plant, HttpError, Plant>>;
  showFilters?: boolean;
};

export const PlantsTable = ({ refineCoreProps, showFilters = false }: Props) => {
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    priceRange: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

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

                  <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-bold text-foreground">
                      {plant.plant_name}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {plant.type}
                      </Badge>

                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Giá bán</div>
                        <div className="text-sm font-bold text-primary">
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
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90"
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
      syncWithLocation: true,
      resource: 'plants',
      initialPageSize: 9,
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
        .includes(filters.search.toLowerCase());
      const matchesType = filters.type === 'all' || plant.type === filters.type;
      const matchesPrice = filters.priceRange === 'all' || (() => {
        const price = plant.base_price;
        switch (filters.priceRange) {
          case '0-15000':
            return price <= 15000;
          case '15000-25000':
            return price > 15000 && price <= 25000;
          case '25000-50000':
            return price > 25000 && price <= 50000;
          case '50000-100000':
            return price > 50000 && price <= 100000;
          case '100000':
            return price > 100000;
          default:
            return true;
        }
      })();
      return matchesSearch && matchesType && matchesPrice;
    }).sort((a, b) => {
      const plantA = a.original;
      const plantB = b.original;
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          comparison = plantA.plant_name.localeCompare(plantB.plant_name);
          break;
        case 'price':
          comparison = plantA.base_price - plantB.base_price;
          break;
        case 'quantity':
          comparison = plantA.quantity - plantB.quantity;
          break;
        case 'createdAt':
          // Fallback to name sorting if createdAt is not available
          comparison = plantA.plant_name.localeCompare(plantB.plant_name);
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [rows, filters]);

  if (showFilters) {
    return <PlantFilters onFilterChange={handleFilterChange} />;
  }

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-8 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium text-foreground">Không tìm thấy kết quả</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Vui lòng thử lại với bộ lọc khác.
              </p>
            </div>
          )
        : (
            <div className="flex items-center justify-between border-t px-4 py-4">
              <div className="text-sm text-muted-foreground">
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
                  <ChevronLeft className="h-4 w-4" />
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
                  <ChevronRight className="h-4 w-4" />
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
