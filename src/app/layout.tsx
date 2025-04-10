import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RefineServer } from '@/components/refine-server';
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
          <RefineServer>{children}</RefineServer>
        </Suspense>
      </body>
    </html>
  );
}
