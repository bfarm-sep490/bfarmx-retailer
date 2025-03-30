'use client';

import type { LayoutProps } from '@refinedev/core';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { OrdersModal } from '@/components/orders';
import { useOrdersModalContext } from '@/hooks/useOrdersModalContext';
import { Authenticated } from '@refinedev/core';
import React from 'react';

export default function Layout({ children }: LayoutProps) {
  const { ordersModalVisible } = useOrdersModalContext();

  return (
    <Authenticated key="authenticated-layout">
      <div className="grid min-h-[calc(100vh-48px)] grid-rows-[64px_1fr_auto]">
        <Header />
        <main className="bg-primary px-2 lg:px-0">{children}</main>
        <Footer />
      </div>
      {ordersModalVisible && <OrdersModal />}
    </Authenticated>
  );
};
