'use client';

import type { ReactNode } from 'react';
import { ablyClient } from '@/lib/ablyClient';
import { liveProvider } from '@refinedev/ably';
import { Refine } from '@refinedev/core';

export function LiveProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Refine
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        liveMode: 'auto',
      }}
      liveProvider={liveProvider(ablyClient)}
    >
      {children}
    </Refine>
  );
}
