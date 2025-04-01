'use client';

import type { IIdentity } from '@/types';
import type { PayOSConfig } from '@payos/payos-checkout';
import { ChevronLeftIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dataProvider } from '@/providers/data-provider/server';
import { useCartStore } from '@/store/cart';
import { usePayOS } from '@payos/payos-checkout';
import { useGetIdentity } from '@refinedev/core';
import axios from 'axios';
import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type PaymentResponse = {
  status: number;
  message: string;
  data: {
    bin: string;
    accountNumber: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    status: string;
    expiredAt: number;
    checkoutUrl: string;
    qrCode: string;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: user } = useGetIdentity<IIdentity>();
  const { items, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState('');

  const handlePaymentSuccess = () => {
    clearCart();
    if (orderId) {
      router.push(`/orders/${orderId}`);
    }
  };

  const payOSConfig: PayOSConfig = {
    RETURN_URL: 'http://localhost:3000/payment-success',
    ELEMENT_ID: 'embedded-payment-container',
    CHECKOUT_URL: checkoutUrl,
    embedded: true,
    onSuccess: () => {
      setShowPaymentDialog(false);
      handlePaymentSuccess();
    },
    onCancel: () => {
      // TODO: Hành động sau khi người dùng Hủy đơn hàng
    },
    onExit: () => {
      // TODO: Hành động sau khi người dùng tắt Pop up
    },
  };

  const { open, exit } = usePayOS(payOSConfig);

  useEffect(() => {
    if (checkoutUrl && showPaymentDialog) {
      setTimeout(() => {
        setTimeout(() => {
          open();
        }, 500);
      }, 500);
    }
  }, [checkoutUrl, showPaymentDialog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderResponse = await dataProvider.create({
        resource: 'orders',
        variables: {
          retailer_id: user?.id,
          plant_id: items[0]?.plant.id,
          packaging_type_id: 1,
          deposit_price: getTotalPrice(),
          address: formData.address,
          phone: formData.phone,
          preorder_quantity: getTotalItems(),
          estimate_pick_up_date: new Date().toISOString(),
        },
      });

      if (orderResponse.data) {
        setOrderId(Number(orderResponse.data.id));

        const paymentResponse = await axios.post<PaymentResponse>(
          'https://api.outfit4rent.online/api/payments/deposit-payment/payos',
          {
            order_id: orderResponse.data.id,
            amount: getTotalPrice(),
            description: formData.note || 'Thanh toan don hang',
          },
        );

        if (paymentResponse.data.status === 200) {
          setPaymentData(paymentResponse.data.data);
          setCheckoutUrl(paymentResponse.data.data.checkoutUrl);
          setShowPaymentDialog(true);
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setShowPaymentDialog(open);
    if (!open && orderId) {
      router.push(`/orders/${orderId}`);
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">Chưa có sản phẩm</h3>
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/plants">
          <Button variant="ghost" className="mb-4">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Quay lại danh sách cây
          </Button>
        </Link>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thanh toán đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            {paymentData && (
              <>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Vui lòng hoàn tất thanh toán trong form bên dưới</p>
                  <p className="text-lg font-semibold mt-2 text-green-600">
                    {paymentData.amount.toLocaleString('vi-VN')}
                    đ
                  </p>
                </div>
                <div className="text-sm text-gray-500 space-y-2 w-full">
                  <div className="flex justify-between">
                    <span>Ngân hàng:</span>
                    <span className="font-medium">{paymentData.bin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số tài khoản:</span>
                    <span className="font-medium">{paymentData.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nội dung:</span>
                    <span className="font-medium">{paymentData.description}</span>
                  </div>
                </div>
                <div
                  id="embedded-payment-container"
                  style={{
                    height: '380px',
                  }}
                >
                </div>
                <div className="text-sm text-gray-500 text-center">
                  Sau khi thanh toán thành công, vui lòng đợi từ 5 - 10s để hệ thống tự động cập nhật.
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPaymentDialog(false);
                    exit();
                  }}
                  className="w-full"
                >
                  Đóng
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Thông tin đặt hàng</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Họ tên</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Input
                  id="note"
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
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
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Đơn hàng</h2>
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
                <div className="relative h-16 w-16 flex-none overflow-hidden rounded-lg">
                  <Image
                    src={item.plant.image_url}
                    alt={item.plant.plant_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="font-medium text-gray-900">
                    {item.plant.plant_name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.plant.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      max={item.plant.quantity}
                      value={item.quantity}
                      onChange={e => updateQuantity(item.plant.id, Math.min(item.plant.quantity, Math.max(1, Number.parseInt(e.target.value) || 1)))}
                      className="w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.plant.id, Math.min(item.plant.quantity, item.quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.plant.base_price.toLocaleString('vi-VN')}
                    đ
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tổng số sản phẩm</span>
                <span>{getTotalItems()}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-gray-900">
                <span>Tổng tiền</span>
                <span>
                  {getTotalPrice().toLocaleString('vi-VN')}
                  đ
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
