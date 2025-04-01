import type { Plant } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  plant: Plant;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (plant: Plant, quantity?: number) => void;
  removeItem: (plantId: number) => void;
  updateQuantity: (plantId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (plant, quantity = 1) => {
        set({
          items: [{ plant, quantity }],
        });
      },
      removeItem: (plantId) => {
        set(state => ({
          items: state.items.filter(item => item.plant.id !== plantId),
        }));
      },
      updateQuantity: (plantId, quantity) => {
        set(state => ({
          items: state.items.map(item =>
            item.plant.id === plantId ? { ...item, quantity } : item,
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.plant.base_price * item.quantity,
          0,
        );
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
