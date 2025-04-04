'use client';

import { Home } from '@/components/pages/home';

import { Suspense } from 'react';

export default function IndexPage() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
