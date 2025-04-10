import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { ablyClient } from '@/lib/ablyClient';
import { authProviderClient } from '@/providers/auth-provider/auth-provider.client';
import { dataProvider } from '@/providers/data-provider/client';
import { liveProvider } from '@refinedev/ably';
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <Suspense>
          <RefineKbarProvider>
            <Refine
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                liveMode: 'auto',
              }}
              liveProvider={liveProvider(ablyClient)}
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
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              authProvider={authProviderClient}
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
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
