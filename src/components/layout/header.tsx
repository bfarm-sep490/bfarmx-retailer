'use client';

import type React from 'react';
import { useBasketContext } from '@/hooks/useBasketContext';
import { useOrdersModalContext } from '@/hooks/useOrdersModalContext';
import Link from 'next/link';
import { BasketIcon, BFarmXIcon } from '../../components/icons';

export const Header: React.FC = () => {
  const { setOrdersModalVisible } = useOrdersModalContext();
  const { orders, totalPrice } = useBasketContext();
  const isBasketHaveOrders = orders.length > 0;

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-lg">
      <div className="container flex h-full items-center justify-between px-2 md:px-0">
        <Link href="/" className="flex gap-4">
          <BFarmXIcon className="text-white" />
        </Link>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 bg-transparent border-none"
          onClick={() => setOrdersModalVisible((prev: boolean) => !prev)}
        >
          {isBasketHaveOrders && (
            <div className="text-lg font-semibold text-white">
              {isBasketHaveOrders && `${orders.length} items /`}
              {' '}
              <span className="text-xl font-extrabold">
                $
                {totalPrice}
              </span>
            </div>
          )}
          <BasketIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};
