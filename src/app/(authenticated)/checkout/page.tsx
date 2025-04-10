'use client';

import type { IIdentity } from '@/types';
import { ChevronLeftIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePackagingTypes } from '@/hooks/usePackagingTypes';
import { dataProvider } from '@/providers/data-provider/server';
import { useCartStore } from '@/store/cart';
import { useGetIdentity } from '@refinedev/core';
import { CheckCircle2, Info, Loader2, Minus, Plus, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: user } = useGetIdentity<IIdentity>();
  const { items, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { packagingTypes, isLoading: isLoadingPackagingTypes } = usePackagingTypes();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    packaging_type_id: 1,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderResponse = await dataProvider.create({
        resource: 'orders',
        variables: {
          retailer_id: user?.id,
          plant_id: items[0]?.plant.id,
          packaging_type_id: formData.packaging_type_id,
          deposit_price: getTotalPrice(),
          address: formData.address,
          phone: formData.phone,
          preorder_quantity: getTotalItems(),
          estimate_pick_up_date: new Date().toISOString(),
        },
      });

      if (orderResponse.data) {
        clearCart();
        router.push(`/orders/${orderResponse.data.id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/plants">
            <Button variant="ghost" className="mb-4">
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Quay lại danh sách cây
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="text-4xl">🛒</div>
          <h3 className="mt-4 text-lg font-medium text-primary">Chưa có sản phẩm</h3>
          <p className="mt-1 text-sm text-gray-500">
            Vui lòng chọn sản phẩm từ danh sách cây trồng.
          </p>
          <Link href="/plants">
            <Button className="mt-4">Chọn cây ngay</Button>
          </Link>
        </div>
      </div>
    );
  }

  const item = items[0];
  if (!item) {
    return null;
  }

  return (
    <div className="page mx-auto flex md:max-w-[80vw] max-w-[100vw] flex-col items-center justify-start lg:w-full lg:max-w-container lg:grid-cols-[396px_auto] lg:items-stretch lg:px-6 lg:grid">
      <aside className="w-full lg:w-auto">
        <div className="sticky top-0 lg:top-12 md:top-12 z-10 lg:z-auto">
          <section className="flex flex-col mt-4 lg:mt-12 gap-4 lg:gap-6 md:gap-10 px-4 lg:px-0">
            <Link className="duration-200 flex font-mono gap-2 group hover:text-primary items-center md:text-sm/[1.25rem] text-muted-foreground text-sm/[0.875rem] transition-colors" href="/plants">
              <ChevronLeftIcon className="duration-200 group-hover:-translate-x-1 h-4 md:h-5 md:w-5 transition-transform w-4" />
              <span className="tracking-wider uppercase">Quay lại</span>
            </Link>
          </section>

          <div className="mt-4 space-y-4 px-4 lg:px-0">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-foreground">Đơn hàng</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => {
                    clearCart();
                    router.push('/plants');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-none overflow-hidden rounded-xl">
                    <Image
                      src={item.plant.image_url}
                      alt={item.plant.plant_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="font-medium text-foreground">
                      {item.plant.plant_name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full md:h-10 md:w-10"
                        onClick={() => updateQuantity(item.plant.id, Math.max(50, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min={50}
                        max={1000}
                        value={item.quantity}
                        onChange={e => updateQuantity(item.plant.id, Math.min(1000, Math.max(50, Number.parseInt(e.target.value) || 50)))}
                        className="w-20 md:w-24 text-center text-sm md:text-base"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full md:h-10 md:w-10"
                        onClick={() => updateQuantity(item.plant.id, Math.min(1000, item.quantity + 1))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.plant.base_price.toLocaleString('vi-VN')}
                      đ/kg
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tổng số lượng</span>
                  <span className="font-medium text-foreground">
                    {getTotalItems()}
                    kg
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tổng giá trị đơn hàng</span>
                  <span className="font-medium text-foreground">
                    {getTotalPrice().toLocaleString('vi-VN')}
                    đ
                  </span>
                </div>
                <div className="flex justify-between text-sm text-primary">
                  <span>Đặt cọc 30%</span>
                  <span className="font-medium">
                    {(getTotalPrice() * 0.3).toLocaleString('vi-VN')}
                    đ
                  </span>
                </div>
                <div className="h-px w-full bg-border" />
                <div className="flex justify-between text-lg font-medium text-primary">
                  <span></span>
                  <span>
                    {(getTotalPrice() * 0.3).toLocaleString('vi-VN')}
                    đ
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </aside>

      <div className="container-sm px-4 mt-4 lg:mt-12 m-0 flex flex-col gap-4 lg:gap-6 md:gap-6 w-full lg:w-[calc(80vw_-_40px_-_396px)]">
        <section className="flex flex-col gap-4 lg:gap-6 md:gap-10">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Thông tin đặt hàng</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">Họ tên</Label>
                  <Input
                    id="name"
                    disabled
                    value={formData.name}
                    className="h-10 text-sm md:text-base bg-muted/50 dark:bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">Số điện thoại</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Nhập số điện thoại của bạn"
                    className="h-10 text-sm md:text-base focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-muted-foreground">Địa chỉ giao hàng</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nhập địa chỉ giao hàng"
                  className="h-10 text-sm md:text-base focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="packaging_type" className="text-sm font-medium text-muted-foreground">Loại đóng gói</Label>
                <Select
                  value={formData.packaging_type_id.toString()}
                  onValueChange={value => setFormData({ ...formData, packaging_type_id: Number(value) })}
                >
                  <SelectTrigger className="h-10 text-sm md:text-base focus-visible:ring-primary">
                    <SelectValue placeholder="Chọn loại đóng gói" />
                  </SelectTrigger>
                  <SelectContent>
                    {packagingTypes.map(type => (
                      <SelectItem key={type?.id} value={type?.id?.toString() || ''} className="text-sm md:text-base">
                        {type?.name}
                        {' '}
                        (
                        {type?.quantity_per_pack}
                        kg)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.packaging_type_id && (
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {packagingTypes.find(type => type.id === formData.packaging_type_id)?.description}
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted/50 dark:bg-muted p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Lưu ý khi đặt hàng</span>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Đơn hàng sẽ được xác nhận trong vòng 24h</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Liên hệ hotline nếu cần hỗ trợ: 1900 1234</span>
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 h-10 md:h-12 text-sm md:text-base font-medium text-primary-foreground"
                disabled={isLoading || isLoadingPackagingTypes}
              >
                {isLoading
                  ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    )
                  : (
                      'Đặt hàng'
                    )}
              </Button>
            </form>
          </Card>
        </section>
      </div>
    </div>
  );
}
