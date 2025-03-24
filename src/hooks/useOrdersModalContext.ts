'use client';

import { OrdersModalContext } from '@/context';

export const useOrdesModalContext = () => {
  const { ordersModalVisible, setOrdersModalVisible } = use(OrdersModalContext);
  return { ordersModalVisible, setOrdersModalVisible };
};
