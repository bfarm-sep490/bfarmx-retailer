'use client';

import type { PropsWithChildren } from 'react';
import React, { useState } from 'react';

export const OrdersModalContext = React.createContext<{
  ordersModalVisible: boolean;
  setOrdersModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  ordersModalVisible: false,
  setOrdersModalVisible: () => null,
});

export const OrdersModalContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);

  return (
    <OrdersModalContext value={{ ordersModalVisible, setOrdersModalVisible }}>
      {children}
    </OrdersModalContext>
  );
};
