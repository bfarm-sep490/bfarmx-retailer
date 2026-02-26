'use client';

import type { Plant } from '@/types';
import Loading from '@/app/loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConfiguration } from '@/hooks/useConfiguration';
import { useCartStore } from '@/store/cart';
import { useOne } from '@refinedev/core';
import { CheckCircle2, ChevronLeft, Clock, DollarSign, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PlantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading, isError } = useOne<Plant>({
    resource: 'plants',
    id: params.id as string,
  });
  const { depositPercent } = useConfiguration();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(50);
  const MAX_QUANTITY = 100000;
  const QUICK_SELECT_OPTIONS = [50, 100, 200];

  const handleQuickSelect = (value: number) => {
    setQuantity(value);
  };

  const calculateTotal = (qty: number) => {
    return data!.data!.base_price * qty;
  };

  const calculateDeposit = (total: number) => {
    return total * (depositPercent / 100);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Không tìm thấy thông tin cây trồng</p>
          <Link href="/plants">
            <Button className="mt-4" variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const plant = data.data;

  const handleAddToCart = () => {
    addItem(plant, quantity);
    router.push('/checkout');
  };

  return (
    <div className="page mx-auto flex md:max-w-[80vw] max-w-[100vw] flex-col items-center justify-start lg:w-full lg:max-w-container lg:grid-cols-[496px_auto] lg:items-stretch lg:px-6 lg:grid">
      <aside className="w-full lg:w-auto">
        <div className="sticky top-0 lg:top-12 md:top-12 z-10 lg:z-auto">
          <section className="flex flex-col mt-4 lg:mt-12 gap-4 lg:gap-6 md:gap-10 px-4 lg:px-0">
            <Link className="duration-200 flex font-mono gap-2 group hover:text-primary items-center md:text-sm/[1.25rem] text-muted-foreground text-sm/[0.875rem] transition-colors" href="/plants">
              <ChevronLeft className="duration-200 group-hover:-translate-x-1 h-4 md:h-5 md:w-5 transition-transform w-4" />
              <span className="tracking-wider uppercase">Quay lại</span>
            </Link>
          </section>

          <div className="mt-4 space-y-4 px-4 lg:px-0">
            <div className="rounded-2xl bg-card p-4 lg:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Số lượng đặt hàng</h3>
                <span className="text-xs lg:text-sm text-muted-foreground">Tối thiểu: 50kg</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {QUICK_SELECT_OPTIONS.map(option => (
                    <Button
                      key={option}
                      variant={quantity === option ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleQuickSelect(option)}
                      className="flex-1 text-xs lg:text-sm"
                    >
                      {option}
                      kg
                    </Button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(50, quantity - 1))}
                    disabled={quantity <= 50}
                    className="h-8 rounded-full lg:h-10 w-8 lg:w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      min={50}
                      max={MAX_QUANTITY}
                      value={quantity}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value) || 50;
                        setQuantity(Math.min(MAX_QUANTITY, Math.max(50, value)));
                      }}
                      className="h-8 lg:h-10 w-full text-center text-sm lg:text-base"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs lg:text-sm text-muted-foreground">kg</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))}
                    disabled={quantity >= MAX_QUANTITY}
                    className="h-8 rounded-full lg:h-10 w-8 lg:w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card p-4 lg:p-6 shadow-sm space-y-4">
              <h3 className="text-base lg:text-lg font-semibold text-foreground">Tổng thanh toán</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-muted  p-3 lg:p-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-foreground">Tổng tiền dự kiến</div>
                    <div className="text-xs text-muted-foreground">
                      Giá bán:
                      {' '}
                      {plant.base_price.toLocaleString('vi-VN')}
                      đ/kg
                    </div>
                  </div>
                  <div className="text-lg lg:text-xl font-bold text-primary">
                    {calculateTotal(quantity).toLocaleString('vi-VN')}
                    đ
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-muted p-3 lg:p-4">
                  <div className="text-sm font-medium text-foreground">
                    Tiền đặt cọc (
                    {depositPercent}
                    %)
                  </div>
                  <div className="text-lg lg:text-xl font-bold text-primary">
                    {calculateDeposit(calculateTotal(quantity)).toLocaleString('vi-VN')}
                    đ
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 h-10 lg:h-12 text-sm lg:text-base font-semibold"
                onClick={handleAddToCart}
              >
                Tiến hành đặt hàng
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <div className="container-sm px-4 mt-4 lg:mt-12 m-0 flex flex-col gap-4 lg:gap-6 md:gap-6 w-full lg:w-[calc(80vw_-_40px_-_496px)]">
        <section className="flex flex-col gap-4 lg:gap-6 md:gap-10">
          <div className="relative aspect-[5/3] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={plant.image_url}
              alt={plant.plant_name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              width={400}
              height={400}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute space-y-2 bottom-0 left-0 right-0 p-4 lg:p-6">
              <Badge variant="outline" className="text-white text-xs lg:text-sm">{plant.type}</Badge>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{plant.plant_name}</h1>
              <p className="text-base lg:text-lg text-white/90 line-clamp-2">{plant.description}</p>
            </div>
          </div>
        </section>

        <div className="space-y-4 lg:space-y-8">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-card p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 lg:h-10 w-8 lg:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-4 lg:h-5 w-4 lg:w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs lg:text-sm text-muted-foreground">Giá bán</div>
                  <div className="text-xl lg:text-2xl font-bold text-primary">
                    {plant.base_price.toLocaleString('vi-VN')}
                    <span className="text-sm lg:text-base font-normal">đ/kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 lg:h-10 w-8 lg:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 lg:h-5 w-4 lg:w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs lg:text-sm text-muted-foreground">Thời gian bảo quản</div>
                  <div className="text-lg lg:text-xl font-semibold text-foreground">
                    {plant.preservation_day}
                    {' '}
                    ngày
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card p-4 lg:p-6 shadow-sm">
              <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-4">Thông tin giao hàng</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 lg:h-5 w-4 lg:w-5 text-primary mt-0.5" />
                  <span className="text-sm lg:text-base">Miễn phí vận chuyển cho đơn hàng từ 500kg</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 lg:h-5 w-4 lg:w-5 text-primary mt-0.5" />
                  <span className="text-sm lg:text-base">Giao hàng trong vòng 3-5 ngày làm việc</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 lg:h-5 w-4 lg:w-5 text-primary mt-0.5" />
                  <span className="text-sm lg:text-base">Giảm 1% cho đơn hàng từ 500kg</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
