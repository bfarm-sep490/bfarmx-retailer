import type { IPlan } from '@/types';
import type { GetListResponse } from '@refinedev/core';
import { PlansTable } from '@/components/plans/table/table';
import { Skeleton } from '@/components/ui/skeleton';
import { dataProvider } from '@/providers/data-provider/server';
import { Suspense } from 'react';

export default async function PlansPage() {
  const { plans } = await getData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Plans</h1>
        <p className="mt-2 text-gray-600">
          View and manage your farming plans. Track progress, monitor yields, and coordinate with experts.
        </p>
      </div>
      <Suspense fallback={<PlansTableSkeleton />}>
        <PlansTable
          refineCoreProps={{
            queryOptions: {
              initialData: plans,
            },
            permanentFilter: [
              {
                field: 'status',
                operator: 'eq',
                value: 'Ongoing',
              },
            ],
          }}
        />
      </Suspense>
    </div>
  );
}

function PlansTableSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array.from({ length: 6 })].map((_, i) => (
        <div key={i} className="flex flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-8 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function getData() {
  try {
    const planData: GetListResponse<IPlan> = await dataProvider.getList({
      resource: 'plans',
      filters: [
        {
          field: 'status',
          operator: 'eq',
          value: 'Available',
        },
      ],
    });

    return {
      plans: planData,
    };
  } catch (error) {
    console.error(error);
    return {
      plans: {
        total: 0,
        data: [],
      },
    };
  }
}
