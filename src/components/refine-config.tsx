'use client';

import { Refine } from '@refinedev/core';
import { RefineKbar } from '@refinedev/kbar';
import routerProvider from '@refinedev/nextjs-router';
import { Toast } from '@/components/ui/toast';
import { ablyClient } from '@/lib/ablyClient';
import { authProviderClient } from '@/providers/auth-provider/auth-provider.client';
import { dataProvider } from '@/providers/data-provider/client';
import { liveProvider } from '@/providers/live-provider/live-provider.client';
import { notificationProvider } from '@/providers/notification-provider';

export function RefineConfig({ children }: { children: React.ReactNode }) {
  return (
    <Refine
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        liveMode: 'auto',
      }}
      resources={[
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
      routerProvider={routerProvider}
      dataProvider={dataProvider}
      authProvider={authProviderClient}
      liveProvider={liveProvider(ablyClient)}
      notificationProvider={notificationProvider}
    >
      {children}
      <RefineKbar />
      <Toast />
    </Refine>
  );
}
