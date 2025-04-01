import type { Plant } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';

type Props = {
  plant: Plant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddToCartPopup = ({ plant, open, onOpenChange }: Props) => {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem(plant, quantity);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm vào giỏ hàng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={plant.image_url}
              alt={plant.plant_name}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium">{plant.plant_name}</h3>
              <p className="text-sm text-gray-500">
                {plant.base_price.toLocaleString('vi-VN')}
                đ
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium">Số lượng</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={plant.quantity}
                value={quantity}
                onChange={e => setQuantity(Math.min(plant.quantity, Math.max(1, Number.parseInt(e.target.value) || 1)))}
                className="w-24 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(plant.quantity, quantity + 1))}
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
