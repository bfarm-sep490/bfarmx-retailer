'use client';

import type { IPlan } from '@/types';
import Loading from '@/app/loading';
import { PlansTable } from '@/components/plans/table/table';
import { useList } from '@refinedev/core';
import { Suspense } from 'react';

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
      pageSize: 6,
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
          Theo dõi và quản lý kế hoạch canh tác của bạn. Giám sát tiến độ, năng suất và phối hợp với chuyên gia.
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
