'use client';

import type { Plant } from '@/types';
import { ChevronLeftIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cart';
import { useOne } from '@refinedev/core';
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
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
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
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/plants">
          <Button variant="ghost" className="mb-4">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Hình ảnh */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={plant.image_url}
            alt={plant.plant_name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{plant.plant_name}</h1>
            <p className="mt-2 text-lg text-gray-600">{plant.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-4">
              <div className="text-sm text-gray-500">Giá bán</div>
              <div className="mt-1 text-2xl font-bold text-primary">
                {plant.base_price.toLocaleString('vi-VN')}
                đ
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-gray-500">Số lượng còn lại</div>
              <div className="mt-1 text-2xl font-bold text-blue-600">
                {plant.quantity}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-gray-500">Loại cây</div>
              <div className="mt-1 text-lg font-medium text-gray-900">
                {plant.type}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-gray-500">Thời gian bảo quản</div>
              <div className="mt-1 text-lg font-medium text-gray-900">
                {plant.preservation_day}
                {' '}
                ngày
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Thông tin kỹ thuật</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-4">
                <div className="text-sm text-gray-500">Delta One</div>
                <div className="mt-1 text-lg font-medium text-gray-900">
                  {plant.delta_one}
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-sm text-gray-500">Delta Two</div>
                <div className="mt-1 text-lg font-medium text-gray-900">
                  {plant.delta_two}
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-sm text-gray-500">Delta Three</div>
                <div className="mt-1 text-lg font-medium text-gray-900">
                  {plant.delta_three}
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-sm text-gray-500">Estimated Per One</div>
                <div className="mt-1 text-lg font-medium text-gray-900">
                  {plant.estimated_per_one}
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-sm text-gray-500">Trạng thái</div>
                <div className="mt-1 text-lg font-medium text-gray-900">
                  {plant.status}
                </div>
              </Card>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <Input
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
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
            >
              Tiến hành đặt hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
