'use client';

import type { LayoutProps } from '@refinedev/core';
import { useIsAuthenticated } from '@refinedev/core';
import React, { useEffect } from 'react';
import { FloatingBadge } from '@/components/cart/floating-badge';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import Particles from '@/components/particles';

export default function Layout({ children }: LayoutProps) {
  const { refetch } = useIsAuthenticated();
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 60000);
    return () => {
      clearInterval(intervalId);
    };
  }, [refetch]);

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
      <FloatingBadge />
      <Particles className="-z-10 fixed inset-0" />
    </>
  );
}
