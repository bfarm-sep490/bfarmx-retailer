import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BasketContextProvider } from '@/context';
import { authProviderClient } from '@/providers/auth-provider/auth-provider.client';
import { dataProvider } from '@/providers/data-provider/client';
import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/nextjs-router';
import { Suspense } from 'react';
import 'src/styles/globals.css';

export const metadata: Metadata = {
  title: 'BFarmX|Retailer',
  description: 'BFarmX|Retailer',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <RefineKbarProvider>
            <Refine
              resources={[
                {
                  name: 'categories',
                  show: '/categories/:id',
                },
                {
                  name: 'orders',
                  show: '/orders/:id',
                },
              ]}
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              authProvider={authProviderClient}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
              }}
            >
              <BasketContextProvider>
                {children}
              </BasketContextProvider>
              <RefineKbar />
            </Refine>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
