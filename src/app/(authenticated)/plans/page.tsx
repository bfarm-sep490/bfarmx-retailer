import type { IPlan } from '@/types';
import type { GetListResponse } from '@refinedev/core';
import Loading from '@/app/loading';
import { PlansTable } from '@/components/plans/table/table';
import { dataProvider } from '@/providers/data-provider/server';
import { Suspense } from 'react';

export default async function PlansPage() {
  const { plans } = await getData();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Plans</h1>
        <p className="mt-2 text-gray-600">
          View and manage your farming plans. Track progress, monitor yields, and coordinate with experts.
        </p>
      </div>
      <Suspense fallback={<Loading />}>
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
