'use client';

import type { IPlan } from '@/types';
import { useList } from '@refinedev/core';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import { PlansTable } from '@/components/plans/table/table';

export default function PlansPage() {
  const { data: planData, isLoading } = useList<IPlan>({
    resource: 'plans',
    filters: [
      {
        field: 'status',
        operator: 'eq',
        value: 'Ongoing',
      },
    ],
    pagination: {
      mode: 'client',
      pageSize: 3,
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Kế hoạch canh tác</h1>
        <p className="mt-2 text-muted-foreground">
          Theo dõi và quản lý kế hoạch đang diễn ra trong hệ thống.
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        <PlansTable
          refineCoreProps={{
            queryOptions: {
              initialData: planData,
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
