import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RefineConfig } from '@/components/refine-config';
import { ThemeProvider } from '@/components/theme-provider';
import { RefineKbarProvider } from '@refinedev/kbar';
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
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
              storageKey="bfarmx-theme"
            >
              <RefineConfig>{children}</RefineConfig>
            </ThemeProvider>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
