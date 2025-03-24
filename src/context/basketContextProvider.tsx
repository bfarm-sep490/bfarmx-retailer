'use client';

import type { PropsWithChildren } from 'react';
import type { BasketOrder, Product } from '../types';
import { OrdersModalContextProvider } from '@/context';
import { useMany } from '@refinedev/core';
import { createContext, useReducer } from 'react';

export const BasketContext = createContext<{
  orders: BasketOrder[];
  findOrderByProductId: (productId: number) => BasketOrder | undefined;
  dispatch: (action: { type: string; payload: BasketOrder }) => void;
  totalPrice: number;
  products: Product[];
}>({
      orders: [],
      findOrderByProductId: () => undefined,
      dispatch: () => null,
      totalPrice: 0,
      products: [],
    });

const initialBasket: BasketOrder[] = [];

const basketReducer = (
  state: BasketOrder[],
  action: {
    payload: BasketOrder;
    type: string;
  },
): BasketOrder[] => {
  switch (action.type) {
    case 'addProduct': {
      const currentOrder = state.find(order => order.productId === action.payload.productId);

      if (currentOrder) {
        return state.map(order =>
          order.productId === action.payload.productId
            ? { ...order, amount: order.amount + 1 }
            : order,
        );
      }

      return [...state, action.payload];
    }

    case 'incrementProductAmount':
      return state.map((order) => {
        return order.productId === action.payload.productId
          ? { ...order, amount: order.amount + 1 }
          : order;
      });
    case 'decrementProductAmount': {
      const currentOrder = state.find(order => order.productId === action.payload.productId);
      if (!currentOrder) {
        return state;
      }

      if (currentOrder.amount === 1) {
        return state.filter(order => order.productId !== action.payload.productId);
      }

      return state.map(order =>
        order.productId === action.payload.productId
          ? { ...order, amount: order.amount - 1 }
          : order,
      );
    }
    case 'setProductAmount': {
      if (action.payload.amount <= 0) {
        return state.filter(order => order.productId !== action.payload.productId);
      }

      return state.map(order =>
        order.productId === action.payload.productId
          ? { ...order, amount: action.payload.amount }
          : order,
      );
    }

    case 'resetBasket':
      return [];
    default:
      return [];
  }
};
export const BasketContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [orders, dispatch] = useReducer(basketReducer, initialBasket);
  const isBasketHaveOrders = orders.length > 0;

  const productIds = orders
    .map(o => o.productId)
    .filter((value, index, array) => array.indexOf(value) === index);

  const { data: productsData } = useMany<Product>({
    resource: 'products',
    ids: productIds,
    queryOptions: {
      enabled: isBasketHaveOrders,
    },
  });

  const totalPrice = orders.reduce((total, currentValue) => {
    const product = productsData?.data.find(value => value.id === currentValue.productId);

    return total + currentValue.amount * (product?.price ?? 0);
  }, 0);

  const findOrderByProductId = (productId: number) => {
    return orders.find(order => order.productId === productId);
  };

  return (
    <BasketContext
      value={{
        orders,
        findOrderByProductId,
        dispatch,
        totalPrice,
        products: productsData?.data ?? [],
      }}
    >
      <OrdersModalContextProvider>{children}</OrdersModalContextProvider>
    </BasketContext>
  );
};
