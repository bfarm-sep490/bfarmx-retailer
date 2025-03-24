import type { Order } from '@/types';
import type { GetOneResponse } from '@refinedev/core';
import { OrderDetail } from '@/components/orders';
import { dataProvider } from '@/providers/data-provider/server';
import { redirect } from 'next/navigation';
import React from 'react';

type OrderShowPagePageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function OrderShowPage({
  params,
}: OrderShowPagePageProps) {
  const { order } = await getData({
    orderId: params.id,
  });

  if (!order) {
    return redirect('/');
  }

  return (
    <OrderDetail
      useShowProps={{
        id: params.id,
        queryOptions: {
          initialData: order,
        },
      }}
    />
  );
}

type GetDataProps = {
  orderId: string;
};

async function getData(props: GetDataProps) {
  try {
    const orderData: GetOneResponse<Order> = await dataProvider.getOne({
      resource: 'orders',
      id: props.orderId,
    });

    return {
      order: orderData,
    };
  } catch (error) {
    console.error(error);
    return {
      order: null,
    };
  }
}
