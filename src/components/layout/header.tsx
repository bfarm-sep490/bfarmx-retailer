import type { Dispatch, SetStateAction } from 'react';
import { useBasketContext } from '@/hooks/useBasketContext';
import { useOrdersModalContext } from '@/hooks/useOrdersModalContext';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Heart,
  Home,
  LogOut,
  Menu as MenuIcon,
  Package,
  Phone,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';

const iconVariants = {
  initial: { rotate: 180, opacity: 0 },
  animate: { rotate: 0, opacity: 1 },
  exit: { rotate: -180, opacity: 0 },
};

const menuVariants = {
  open: {
    scale: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  closed: {
    scale: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.05,
    },
  },
};

const menuLinkVariants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: -15,
    opacity: 0,
  },
};

type IconType = React.ElementType;

const MenuLink = ({ text, Icon }: { text: string; Icon: IconType }) => {
  return (
    <motion.a
      variants={menuLinkVariants}
      href="#"
      rel="nofollow"
      className="text-sm hover:text-indigo-500 transition-colors flex items-center gap-2 py-2"
    >
      <Icon className="w-4 h-4" />
      {text}
    </motion.a>
  );
};

const Link = ({ text, Icon }: { text: string; Icon: IconType }) => {
  return (
    <button
      type="button"
      className="text-sm w-12 hover:text-indigo-500 transition-colors flex flex-col gap-1 items-center"
    >
      <Icon />
      <span className="text-xs">{text}</span>
    </button>
  );
};

const MenuButton = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <button
      type="button"
      onClick={() => setOpen(pv => !pv)}
      className="text-xl font-bold h-full bg-black text-white p-4"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {open
            ? (
                <motion.span
                  key="icon-1"
                  className="block"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.125, ease: 'linear' }}
                >
                  <X />
                </motion.span>
              )
            : (
                <motion.span
                  key="icon-2"
                  className="block"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.125, ease: 'linear' }}
                >
                  <MenuIcon />
                </motion.span>
              )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
};

const Menu = () => {
  return (
    <motion.div
      variants={menuVariants}
      style={{ transformOrigin: 'bottom', x: '-50%' }}
      className="p-6 bg-white shadow-lg absolute bottom-[125%] left-[50%] flex flex-col w-[calc(100vw_-_48px)] max-w-md"
    >
      {/* User Profile Section */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h4 className="font-semibold">Nguyễn Văn A</h4>
          <p className="text-sm text-gray-500">example@email.com</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-2">
        <MenuLink text="Đơn hàng của tôi" Icon={Package} />
        <MenuLink text="Sản phẩm yêu thích" Icon={Heart} />
        <MenuLink text="Cài đặt tài khoản" Icon={Settings} />
      </div>

      {/* Logout Button */}
      <button
        type="button"
        className="mt-6 flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Đăng xuất</span>
      </button>
    </motion.div>
  );
};

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { setOrdersModalVisible } = useOrdersModalContext();
  const { orders, totalPrice } = useBasketContext();
  const isBasketHaveOrders = orders.length > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <motion.nav
        animate={open ? 'open' : 'closed'}
        initial="closed"
        className="bg-white text-black shadow-lg flex items-center justify-between absolute bottom-8 left-[50%] -translate-x-[50%]"
      >
        <MenuButton setOpen={setOpen} open={open} />
        <div className="flex gap-6 px-6">
          <Link text="Home" Icon={Home} />
          <Link text="Shop" Icon={ShoppingBag} />
          <Link text="Support" Icon={Phone} />
          <button
            type="button"
            onClick={() => setOrdersModalVisible((prev: boolean) => !prev)}
            className="text-sm w-12 hover:text-indigo-500 transition-colors flex flex-col gap-1 items-center"
          >
            <ShoppingCart />
            <span className="text-xs">Cart</span>
            {isBasketHaveOrders && (
              <span className="text-xs font-semibold">
                {orders.length}
                {' '}
                / $
                {totalPrice}
              </span>
            )}
          </button>
        </div>
        <Menu />
      </motion.nav>
    </div>
  );
};
