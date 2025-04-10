import type { ReactNode } from 'react';
import { Refine } from '@refinedev/core';
import { RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/nextjs-router';
import { LiveProviderWrapper } from './live-provider-wrapper';
import { RefineClient } from './refine-client';

export function RefineServer({ children }: { children: ReactNode }) {
  return (
    <RefineKbarProvider>
      <Refine
        routerProvider={routerProvider}
      >
        <LiveProviderWrapper>
          <RefineClient>{children}</RefineClient>
        </LiveProviderWrapper>
      </Refine>
    </RefineKbarProvider>
  );
}
