import type { Order } from '@/types';
import type { GetListResponse } from '@refinedev/core';
import Loading from '@/app/loading';
import { OrderFiltersWrapper } from '@/components/orders/filters/filters-wrapper';
import { OrdersTable } from '@/components/orders/table';
import { Skeleton } from '@/components/ui/skeleton';
import { dataProvider } from '@/providers/data-provider/server';
import { Separator } from '@radix-ui/react-separator';
import { Suspense } from 'react';

export default async function OrdersPage() {
  const { orders } = await getData();

  return (
    <div className="page mx-auto flex md:max-w-[80vw] max-w-[100vw] flex-col items-center justify-start lg:w-full lg:max-w-container lg:grid-cols-[296px_auto] lg:items-stretch lg:px-6 lg:grid">
      <aside className="w-full lg:w-auto">
        <div className="sticky top-0 lg:top-12 md:top-12 z-10 lg:z-auto">
          <section className="flex flex-col mt-4 lg:mt-12 px-4 lg:px-0">
            <h1 className="text-3xl font-bold text-foreground">Đơn hàng</h1>
            <p className="text-muted-foreground">
              Xem và quản lý các đơn hàng của bạn
            </p>
          </section>

          <Separator className="my-4" />

          <div className="mt-4 space-y-4 px-4 lg:px-0">
            <div>
              <h3 className="text-base lg:text-lg font-semibold text-foreground mb-4">Bộ lọc tìm kiếm</h3>
              <Suspense fallback={<Loading />}>
                <OrderFiltersWrapper />
              </Suspense>
            </div>
          </div>
        </div>
      </aside>

      <div className="container-sm px-4 mt-4 lg:mt-12 m-0 flex flex-col gap-4 lg:gap-6 md:gap-6 w-full lg:w-[calc(80vw_-_40px_-_296px)]">
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
