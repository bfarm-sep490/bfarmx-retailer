'use client';

import type { LayoutProps } from '@refinedev/core';
import { Footer } from '@/components/layout/footer';

import { Header } from '@/components/layout/header';
import { OrdersModal } from '@/components/orders';
import { useOrdersModalContext } from '@/hooks/useOrdersModalContext';
import React from 'react';

export default function Layout({ children }: LayoutProps) {
  const { ordersModalVisible } = useOrdersModalContext();

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
      {ordersModalVisible && <OrdersModal />}
    </>
  );
};
