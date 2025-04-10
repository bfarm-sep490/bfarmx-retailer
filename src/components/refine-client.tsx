'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { authProviderClient } from '@/providers/auth-provider/auth-provider.client';
import { dataProvider } from '@/providers/data-provider/client';
import { Refine } from '@refinedev/core';
import { RefineKbar } from '@refinedev/kbar';

export function RefineClient({ children }: { children: ReactNode }) {
  return (
    <Refine
      dataProvider={dataProvider}
      authProvider={authProviderClient}
      resources={[
        {
          name: 'categories',
          show: '/categories/:id',
        },
        {
          name: 'orders',
          show: '/orders/:id',
        },
        {
          name: 'plans',
          list: '/plans',
          show: '/plans/:id',
        },
      ]}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        storageKey="bfarmx-theme"
      >
        {children}
      </ThemeProvider>
      <RefineKbar />
    </Refine>
  );
}
