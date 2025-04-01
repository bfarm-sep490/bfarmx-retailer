'use client';

import type { Order } from '@/types';
import type { UseShowProps } from '@refinedev/core';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { usePayOS } from '@payos/payos-checkout';
import { useShow } from '@refinedev/core';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type OrderPageProps = {
  useShowProps?: UseShowProps<Order>;
};

type PaymentResponse = {
  status: number;
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

export const OrderDetail: React.FC<OrderPageProps> = ({ useShowProps }) => {
  const { query: queryResult } = useShow<Order>({
    resource: 'orders',
    ...useShowProps,
  });
  const order = queryResult.data?.data;
  const [paymentData, setPaymentData] = useState<PaymentResponse['data'] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [_error, setError] = useState<string | null>(null);

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: 'http://localhost:3000/payment-success',
    ELEMENT_ID: 'embedded-payment-container',
    CHECKOUT_URL: '',
    embedded: true,
    onSuccess: () => {
      setIsOpen(false);
      setMessage('Thanh toán thành công');
      window.location.reload();
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const handlePaymentClick = async () => {
    try {
      const paymentResponse = await axios.post<PaymentResponse>(
        'https://api.outfit4rent.online/api/payments/deposit-payment/payos',
        {
          order_id: order?.id,
          amount: order?.deposit_price,
          description: 'Thanh toan don hang',
        },
      );

      if (paymentResponse.data.status === 200) {
        setPaymentData(paymentResponse.data.data);
        setPayOSConfig(oldConfig => ({
          ...oldConfig,
          CHECKOUT_URL: paymentResponse.data.data.checkoutUrl,
        }));
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.');
      } else {
        setError('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.');
      }
    }
  };

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL && isOpen) {
      const timer1 = setTimeout(() => {
        const timer2 = setTimeout(() => {
          open();
        }, 500);
        return () => clearTimeout(timer2);
      }, 500);
      return () => clearTimeout(timer1);
    }
    return undefined;
  }, [payOSConfig.CHECKOUT_URL, isOpen]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-white shadow-lg p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  {[1, 2, 3].map(j => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-white shadow-lg p-6">
          <div className="text-center">
            <p className="text-lg font-medium text-red-600">{_error}</p>
            <Button
              onClick={() => setError(null)}
              className="mt-4"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-white shadow-lg p-6">
          <div className="text-center">
            <p className="text-lg font-medium text-green-600">{message}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Quay lại trang chi tiết
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isWaitingForDeposit = order.status === 'WaitingForDeposit';
  const hasPendingTransaction = order.transactions?.some(t => t.status === 'Pending');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WaitingForDeposit':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-xl bg-white shadow-lg overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-white">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold uppercase">
                Chi tiết đơn hàng
              </h1>
              <p className="text-sm text-green-100 mt-1">
                Mã đơn hàng: #
                {order.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {(isWaitingForDeposit || hasPendingTransaction) && (
              <Button
                onClick={handlePaymentClick}
                className="bg-white text-green-600 hover:bg-white/90"
              >
                Thanh toán ngay
              </Button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium">{dayjs(order.created_at).format('DD/MM/YYYY HH:mm')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ngày dự kiến nhận:</span>
                  <span className="font-medium">{dayjs(order.estimate_pick_up_date).format('DD/MM/YYYY')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tên cây:</span>
                  <span className="font-medium">{order.plant_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Loại bao bì:</span>
                  <span className="font-medium">{order.packaging_type_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số lượng:</span>
                  <span className="font-medium">{order.preorder_quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giá đặt cọc:</span>
                  <span className="font-medium text-green-600">
                    {order.deposit_price.toLocaleString('vi-VN')}
                    đ
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Thông tin người đặt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tên người đặt:</span>
                  <span className="font-medium">{order.retailer_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-medium">{order.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="font-medium">{order.address}</span>
                </div>
              </CardContent>
            </Card>

            {order.transactions && order.transactions.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin thanh toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.transactions.map(transaction => (
                      <div key={transaction.id} className="rounded-lg border p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Nội dung:</span>
                          <span className="font-medium">{transaction.content}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Số tiền:</span>
                          <span className="font-medium text-green-600">
                            {transaction.price.toLocaleString('vi-VN')}
                            đ
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Trạng thái:</span>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    setIsOpen(false);
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
    </div>
  );
};
