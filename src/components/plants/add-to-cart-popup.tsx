import type { Plant } from '@/types';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useConfiguration } from '@/hooks/useConfiguration';
import { useCartStore } from '@/store/cart';

type Props = {
  plant: Plant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddToCartPopup = ({ plant, open, onOpenChange }: Props) => {
  const { addItem } = useCartStore();
  const { depositPercent } = useConfiguration();
  const [quantity, setQuantity] = useState(50);

  const handleAddToCart = () => {
    addItem(plant, quantity);
    onOpenChange(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleQuantityChange = (value: number) => {
    const newValue = Math.max(50, Math.min(1000, value));
    setQuantity(newValue);
  };

  const totalPrice = quantity * plant.base_price;
  const deposit = totalPrice * (depositPercent / 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-xl">
              <img
                src={plant.image_url}
                alt={plant.plant_name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{plant.plant_name}</h3>
                <Badge variant="outline" className="mt-1">
                  {plant.type}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(plant.base_price)}
                </span>
                <span className="text-sm text-muted-foreground">/kg</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="quantity" className="text-sm font-medium text-foreground">
                Số lượng đặt hàng
              </label>
              <span className="text-sm text-muted-foreground">
                Từ 50kg đến 1000kg
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="relative flex-1">
                <input
                  id="quantity"
                  type="number"
                  min={50}
                  max={1000}
                  value={quantity}
                  onChange={e => handleQuantityChange(Number(e.target.value))}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-center text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  kg
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tổng giá trị đơn hàng</span>
              <span className="font-semibold text-foreground">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Đặt cọc
                {' '}
                {' '}
                {depositPercent}
                %
              </span>
              <span className="font-semibold text-primary">
                {formatPrice(deposit)}
              </span>
            </div>
            <div className="h-px w-full bg-border" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Số tiền cần thanh toán</span>
              <span className="font-bold text-primary">
                {formatPrice(deposit)}
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Thêm vào giỏ hàng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
