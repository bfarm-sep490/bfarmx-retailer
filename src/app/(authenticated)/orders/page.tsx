import type { Order } from '@/types';
import type { GetListResponse } from '@refinedev/core';

import { OrdersTable } from '@/components/orders/table';
import { Skeleton } from '@/components/ui/skeleton';
import { dataProvider } from '@/providers/data-provider/server';
import { Suspense } from 'react';

export default async function OrdersPage() {
  const { orders } = await getData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Danh sách đơn hàng</h1>
        <p className="mt-2 text-gray-600">
          Xem và quản lý các đơn hàng của bạn
        </p>
      </div>

      <Suspense fallback={<OrdersTableSkeleton />}>
        <OrdersTable
          refineCoreProps={{
            queryOptions: {
              initialData: orders,
            },
          }}
        />
      </Suspense>
    </div>
  );
}

function OrdersTableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array.from({ length: 3 })].map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-4 rounded-lg border p-4 md:flex-row md:gap-8">
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
    const orderData: GetListResponse<Order> = await dataProvider.getList({
      resource: 'orders',
    });

    return {
      orders: orderData,
    };
  } catch (error) {
    console.error(error);
    return {
      orders: {
        total: 0,
        data: [],
      },
    };
  }
}
