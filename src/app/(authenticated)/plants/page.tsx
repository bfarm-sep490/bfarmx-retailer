import type { Plant } from '@/types';
import type { GetListResponse } from '@refinedev/core';
import { PlantsTable } from '@/components/plants/table';
import { Skeleton } from '@/components/ui/skeleton';
import { dataProvider } from '@/providers/data-provider/server';
import { Suspense } from 'react';

export default async function PlantsPage() {
  const { plants } = await getData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Danh sách cây trồng</h1>
        <p className="mt-2 text-gray-600">
          Khám phá danh sách các loại cây trồng có sẵn tại trang trại của chúng tôi
        </p>
      </div>

      <Suspense fallback={<PlantsTableSkeleton />}>
        <PlantsTable
          refineCoreProps={{
            queryOptions: {
              initialData: plants,
            },
            permanentFilter: [
              {
                field: 'status',
                operator: 'eq',
                value: 'Available',
              },
            ],
          }}
        />
      </Suspense>
    </div>
  );
}

function PlantsTableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array.from({ length: 3 })].map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-4 rounded-lg border p-4 md:flex-row md:gap-8">
          <Skeleton className="h-32 w-32 rounded-lg" />
          <div className="flex-auto space-y-2 text-center md:text-left">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

async function getData() {
  try {
    const plantData: GetListResponse<Plant> = await dataProvider.getList({
      resource: 'plants',
      filters: [
        {
          field: 'status',
          operator: 'eq',
          value: 'Available',
        },
      ],
    });

    return {
      plants: plantData,
    };
  } catch (error) {
    console.error(error);
    return {
      plants: {
        total: 0,
        data: [],
      },
    };
  }
}
