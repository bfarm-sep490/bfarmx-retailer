'use client';

import type { IPlan } from '@/types';
import { useOne } from '@refinedev/core';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeftIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PlanDetailPage() {
  const params = useParams();
  const { data, isLoading, isError } = useOne<IPlan>({
    resource: 'plans',
    id: params.id as string,
  });

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
          <p className="text-red-500">Không tìm thấy thông tin kế hoạch</p>
          <Link href="/plans">
            <Button className="mt-4" variant="outline">
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const plan = data.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/plans">
          <Button variant="ghost" className="mb-4">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Thông tin cơ bản */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{plan.plan_name}</h1>
            <p className="mt-2 text-lg text-gray-600">{plan.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-4">
              <div className="text-sm text-gray-500">Cây trồng</div>
              <div className="mt-1 text-lg font-medium text-gray-900">
                {plan.plant_name}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-gray-500">Giống cây</div>
              <div className="mt-1 text-lg font-medium text-gray-900">
                {plan.yield_name}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-gray-500">Chuyên gia</div>
              <div className="mt-1 text-lg font-medium text-gray-900">
                {plan.expert_name}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-gray-500">Trạng thái</div>
              <div className="mt-1 text-lg font-medium text-gray-900">
                {plan.status}
              </div>
            </Card>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-4">
              <div className="text-sm text-gray-500">Ngày bắt đầu</div>
              <div className="mt-1 text-lg font-medium text-gray-900">
                {plan.start_date}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-gray-500">Ngày kết thúc</div>
              <div className="mt-1 text-lg font-medium text-gray-900">
                {plan.end_date}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-gray-500">Sản lượng ước tính</div>
              <div className="mt-1 text-lg font-medium text-gray-900">
                {plan.estimated_product}
                {' '}
                {plan.estimated_unit}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-gray-500">Số lượng hạt giống</div>
              <div className="mt-1 text-lg font-medium text-gray-900">
                {plan.seed_quantity}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Thông tin bổ sung</h2>
            <div className="grid gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-500">Người tạo</div>
                <div className="mt-1 text-lg font-medium text-gray-900">
                  {plan.created_by}
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-sm text-gray-500">Ngày tạo</div>
                <div className="mt-1 text-lg font-medium text-gray-900">
                  {plan.created_at}
                </div>
              </Card>

              {plan.updated_by && (
                <Card className="p-4">
                  <div className="text-sm text-gray-500">Người cập nhật</div>
                  <div className="mt-1 text-lg font-medium text-gray-900">
                    {plan.updated_by}
                  </div>
                </Card>
              )}

              {plan.updated_at && (
                <Card className="p-4">
                  <div className="text-sm text-gray-500">Ngày cập nhật</div>
                  <div className="mt-1 text-lg font-medium text-gray-900">
                    {plan.updated_at}
                  </div>
                </Card>
              )}

              {plan.complete_date && (
                <Card className="p-4">
                  <div className="text-sm text-gray-500">Ngày hoàn thành</div>
                  <div className="mt-1 text-lg font-medium text-gray-900">
                    {plan.complete_date}
                  </div>
                </Card>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              asChild
            >
              <Link href={`/plans/${plan.id}/order`}>
                Đặt hàng ngay
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
