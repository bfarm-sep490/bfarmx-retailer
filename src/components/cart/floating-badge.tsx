import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const FloatingBadge = () => {
  const router = useRouter();
  const { items, getTotalItems, clearCart } = useCartStore();
  const isVisible = items.length > 0;

  const handleClick = () => {
    router.push('/checkout');
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearCart();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          onClick={handleClick}
          className="fixed bottom-32 right-4 z-50 bg-white text-primary rounded-lg shadow-lg p-4 flex items-center gap-3 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getTotalItems()}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Đơn hàng đang chờ</span>
            <span className="text-xs text-gray-500">Click để thanh toán</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 text-gray-400 hover:text-red-500"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
