'use client';

import { OrdersModalContext } from '@/context';
import { use } from 'react';

export const useOrdersModalContext = () => {
  const { ordersModalVisible, setOrdersModalVisible } = use(OrdersModalContext);
  return { ordersModalVisible, setOrdersModalVisible };
};
