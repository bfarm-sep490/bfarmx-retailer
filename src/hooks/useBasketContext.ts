'use client';

import { BasketContext } from '@/context';

export const useBasketContext = () => {
  const basket = use(BasketContext);
  return basket;
};
