'use client';

import type { LayoutProps } from '@refinedev/core';
import { FloatingBadge } from '@/components/cart/floating-badge';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import React from 'react';

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
      <FloatingBadge />
    </>
  );
}
