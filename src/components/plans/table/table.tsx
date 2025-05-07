'use client';

import type { IPlan } from '@/types';
import type { HttpError, useTableProps } from '@refinedev/core';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { useTable } from '@refinedev/react-table';
import { flexRender } from '@tanstack/react-table';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock,
  InboxIcon,
  Leaf,
  Package,
  User,
} from 'lucide-react';
import { useMemo } from 'react';
import { ProjectStatusCard } from '../expandable-card';

type Props = {
  refineCoreProps?: Partial<useTableProps<IPlan, HttpError, IPlan>>;
};

export const PlansTable = ({ refineCoreProps }: Props) => {
  const columns = useMemo<ColumnDef<IPlan>[]>(
    () => [
      {
        id: 'plan',
        accessorFn: row => row,
        cell: function render({ row }) {
          const plan = row.original;

          const getStatusIcon = (status: IPlan['status']) => {
            switch (status) {
              case 'Completed':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
              case 'Ongoing':
                return <Clock className="h-4 w-4 text-blue-500" />;
              case 'Pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
              case 'Cancelled':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
              default:
                return <Clock className="h-4 w-4 text-muted-foreground" />;
            }
          };

          return (
            <div className="block">
              <ProjectStatusCard
                id={plan.id}
                title={plan.plan_name}
                progress={plan.status === 'Completed' ? 100 : 50}
                status={plan.status}
                statusIcon={getStatusIcon(plan.status)}
                metadata={{
                  plant: { name: plan.plant_name, icon: <Leaf className="h-4 w-4 text-muted-foreground" /> },
                  yield: { name: plan.yield_name, icon: <Package className="h-4 w-4 text-muted-foreground" /> },
                  expert: { name: plan.expert_name, icon: <User className="h-4 w-4 text-muted-foreground" /> },
                  timeline: {
                    start: plan.start_date,
                    end: plan.end_date,
                    icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
                  },
                }}
                tasks={[
                  { title: `Giống cây: ${plan.plant_name}`, completed: true },
                  { title: `Đất trồng: ${plan.yield_name}`, completed: true },
                  { title: `Sản lượng dự kiến: ${plan.estimated_product} kg`, completed: plan.status === 'Completed' },
                  { title: `Số lượng giống: ${plan.seed_quantity}`, completed: true },
                ]}
                qr_code={plan.qr_code}
                contract_address={plan?.contract_address}
              />
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
  } = useTable<IPlan>({
    columns,
    refineCoreProps: {
      syncWithLocation: true,
      resource: 'plans',
      initialPageSize: 3,
      pagination: {
        mode: 'client',
      },
      ...(refineCoreProps || {}),
    },
  });

  const rows = getRowModel().rows;
  const pageIndex = pagination?.pageIndex ?? 0;
  const pageSize = pagination?.pageSize ?? 20;

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <InboxIcon className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium text-foreground">Không có kế hoạch nào</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Hiện tại không có kế hoạch nào có sẵn. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
          kế hoạch
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
