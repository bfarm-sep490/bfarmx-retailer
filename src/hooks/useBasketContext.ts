'use client';

import { BasketContext } from '@/context';
import { use } from 'react';

export const useBasketContext = () => {
  const basket = use(BasketContext);
  return basket;
};
