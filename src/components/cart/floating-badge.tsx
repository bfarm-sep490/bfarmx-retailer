import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export const FloatingBadge = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { items, clearCart } = useCartStore();
  const isVisible = items.length > 0 && pathname !== '/checkout';

  const handleClick = () => {
    router.push('/checkout');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
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
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`You have ${items.length} items in your cart. Click to proceed to checkout.`}
          className="fixed bottom-32 right-4 z-50 bg-white text-primary rounded-xl shadow-lg p-4 flex items-center gap-4 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <ShoppingCart className="w-6 h-6" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-md"
            >
              {items.length}
            </motion.div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Đơn hàng đang chờ</span>
            <span className="text-xs text-gray-500">Click để đặt hàng</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            onClick={handleRemove}
            aria-label="Clear cart"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
