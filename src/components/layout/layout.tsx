'use client';

import type { LayoutProps } from '@refinedev/core';
import React from 'react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="grid min-h-[calc(100vh-48px)] grid-rows-[64px_1fr_auto]">
      <Header />
      <main className="bg-primary px-2 lg:px-0">{children}</main>
      <Footer />
    </div>
  );
};
