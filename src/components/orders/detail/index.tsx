'use client';

import type { Order } from '@/types';
import type { UseShowProps } from '@refinedev/core';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { usePayOS } from '@payos/payos-checkout';
import { useShow } from '@refinedev/core';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { AlertCircle, ArrowLeft, CreditCard, History, Package, Receipt, Truck, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { query: queryResult } = useShow<Order>({
    resource: 'orders',
    ...useShowProps,
  });
  const order = queryResult.data?.data;
  const [paymentData, setPaymentData] = useState<PaymentResponse['data'] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [_error, setError] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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
          description: 'Thanh toán đặt cọc',
        },
      );

      if (paymentResponse.data.status === 200) {
        setPaymentData(paymentResponse.data.data);
        setPayOSConfig(oldConfig => ({
          ...oldConfig,
          CHECKOUT_URL: paymentResponse.data.data.checkoutUrl,
        }));
        setIsOpen(true);
        await queryClient.invalidateQueries({ queryKey: ['orders', order?.id] });
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

  const handleCancelOrder = async () => {
    try {
      const response = await axios.put(
        `https://api.outfit4rent.online/api/orders/${order?.id}/cancel`,
      );

      if (response.data.status === 200) {
        setMessage('Hủy đơn hàng thành công');
        queryClient.invalidateQueries({ queryKey: ['orders', order?.id] });
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.');
      } else {
        setError('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.');
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
      <div className="container max-w-7xl mx-auto px-4 py-8">
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
      <div className="container max-w-7xl mx-auto px-4 py-8">
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
      <div className="container max-w-7xl mx-auto px-4 py-8">
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Deposit':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Paid':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getHeaderColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'from-orange-600 to-orange-700';
      case 'Deposit':
        return 'from-yellow-600 to-yellow-700';
      case 'Paid':
        return 'from-green-600 to-green-700';
      case 'Cancelled':
        return 'from-red-600 to-red-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ thanh toán';
      case 'Deposit':
        return 'Đã đặt cọc';
      case 'Paid':
        return 'Đã thanh toán';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getOrderProgress = (status: string) => {
    switch (status) {
      case 'Pending':
        return 25;
      case 'Deposit':
        return 50;
      case 'Paid':
        return 100;
      case 'Cancelled':
        return 0;
      default:
        return 0;
    }
  };

  const canMakePayment = order.status === 'Pending';

  const filteredTransactions = order?.transactions?.filter(
    transaction => transaction.status === 'Pending' || transaction.status === 'Paid',
  );

  const hasOtherTransactions = order?.transactions?.some(
    transaction => transaction.status !== 'Pending' && transaction.status !== 'Paid',
  );

  const bentoItems = [
    {
      title: 'Thông tin đơn hàng',
      meta: `#${order.id}`,
      description: 'Chi tiết về đơn hàng và trạng thái',
      icon: <Package className="w-4 h-4 text-green-500" />,
      status: getStatusText(order.status),
      tags: ['Đơn hàng', 'Trạng thái'],
      colSpan: 2,
      hasPersistentHover: true,
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Ngày tạo:</span>
            <span className="font-medium font-mono">{dayjs(order.created_at).format('DD/MM/YYYY HH:mm')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Ngày dự kiến nhận:</span>
            <span className="font-medium font-mono">{dayjs(order.estimate_pick_up_date).format('DD/MM/YYYY')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Trạng thái:</span>
            <Badge variant="outline" className={cn('border-2', getStatusColor(order.status))}>
              {getStatusText(order.status)}
            </Badge>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tiến độ đơn hàng</span>
              <span>
                {getOrderProgress(order.status)}
                %
              </span>
            </div>
            <Progress value={getOrderProgress(order.status)} className="h-2" />
          </div>
        </div>
      ),
    },
    {
      title: 'Thông tin sản phẩm',
      meta: `${order.preorder_quantity} kg`,
      description: 'Chi tiết về sản phẩm và giá trị đơn hàng',
      icon: <Truck className="w-4 h-4 text-blue-500" />,
      tags: ['Sản phẩm', 'Giá trị'],
      content: (
        <div className="space-y-3">
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
            <span className="font-medium font-mono">
              {order.preorder_quantity}
              {' '}
              kg
            </span>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Giá đặt cọc:</span>
              <span className="font-medium text-green-600 font-mono">
                {order.deposit_price.toLocaleString('vi-VN')}
                đ
              </span>
            </div>
            {order.total_price && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng giá trị:</span>
                <span className="font-medium text-green-600 font-mono">
                  {order.total_price.toLocaleString('vi-VN')}
                  đ
                </span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Thông tin người đặt',
      meta: order.phone,
      description: 'Thông tin liên hệ và địa chỉ',
      icon: <User className="w-4 h-4 text-purple-500" />,
      tags: ['Khách hàng', 'Liên hệ'],
      content: (
        <div className="space-y-3">
          <div className="flex justify-between gap-4 items-center">
            <span className="text-gray-600">Tên người đặt:</span>
            <span className="font-medium">{order.retailer_name}</span>
          </div>
          <div className="flex justify-between gap-4 items-center">
            <span className="text-gray-600">Số điện thoại:</span>
            <span className="font-medium font-mono">{order.phone}</span>
          </div>
          <div className="flex justify-between gap-4 items-center">
            <span className="text-gray-600 whitespace-nowrap">Địa chỉ:</span>
            <span className="font-medium">{order.address}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Lịch sử thanh toán',
      meta: `${filteredTransactions?.length || 0} giao dịch`,
      description: 'Chi tiết các giao dịch thanh toán',
      icon: <Receipt className="w-4 h-4 text-orange-500" />,
      tags: ['Thanh toán', 'Giao dịch'],
      colSpan: 2,
      content: (
        <div className="space-y-4">
          {filteredTransactions?.map((transaction, _index) => (
            <div key={transaction.id} className="rounded-lg border p-4 bg-gray-50/50 hover:bg-gray-50 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Nội dung:</span>
                <span className="font-medium">{transaction.content}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-medium text-green-600 font-mono">
                  {transaction.price.toLocaleString('vi-VN')}
                  đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái:</span>
                <Badge variant="outline" className={cn('border-2', getStatusColor(transaction.status))}>
                  {getStatusText(transaction.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/orders')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {order?.status === 'Pending' && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
          <div>
            <p className="text-sm text-orange-800 font-medium">
              Lưu ý: Đơn hàng sẽ tự động hủy sau 1 giờ nếu chưa thanh toán
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Vui lòng hoàn tất thanh toán trước khi đơn hàng bị hủy
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className={cn('relative px-8 py-6 text-white overflow-hidden', `bg-gradient-to-r ${getHeaderColor(order.status)}`)}>
          <div className="absolute inset-0 bg-[url('/blockchain-pattern.png')] opacity-10"></div>
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-wider">
                  Chi tiết đơn hàng
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-green-100 font-mono">
                    Mã đơn hàng: #
                    {order.id}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {canMakePayment && (
                <Button
                  onClick={handlePaymentClick}
                  className="bg-white text-green-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Thanh toán ngay
                </Button>
              )}
              {order.status === 'Pending' && (
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  variant="destructive"
                  className="shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  Hủy đơn hàng
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {bentoItems.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'group relative p-4 rounded-xl overflow-hidden transition-all duration-300',
                  'border border-gray-100/80 bg-white',
                  'hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)]',
                  'hover:-translate-y-0.5 will-change-transform',
                  item.colSpan || 'col-span-1',
                  item.colSpan === 2 ? 'md:col-span-2' : '',
                  {
                    'shadow-[0_2px_12px_rgba(0,0,0,0.03)] -translate-y-0.5':
                      item.hasPersistentHover,
                  },
                )}
              >
                <div
                  className={`absolute inset-0 ${
                    item.hasPersistentHover
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  } transition-opacity duration-300`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
                </div>

                <div className="relative flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 group-hover:bg-gradient-to-br transition-all duration-300">
                      {item.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.title === 'Lịch sử thanh toán' && hasOtherTransactions && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowHistoryModal(true)}
                          className="h-8 w-8 text-gray-500 hover:text-gray-700"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                      )}

                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 tracking-tight text-[15px]">
                      {item.title}
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        {item.meta}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 leading-snug font-[425]">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {item.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-md bg-black/5 backdrop-blur-sm transition-all duration-200 hover:bg-black/10"
                        >
                          #
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    {item.content}
                  </div>
                </div>

                <div
                  className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent ${
                    item.hasPersistentHover
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  } transition-opacity duration-300`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-green-600">●</span>
              Thanh toán đơn hàng
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            {paymentData && (
              <>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Vui lòng hoàn tất thanh toán trong form bên dưới</p>
                  <p className="text-lg font-semibold mt-2 text-green-600 font-mono">
                    {paymentData.amount.toLocaleString('vi-VN')}
                    đ
                  </p>
                </div>
                <div className="text-sm text-gray-500 space-y-2 w-full bg-gray-50/50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>Ngân hàng:</span>
                    <span className="font-medium font-mono">{paymentData.bin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số tài khoản:</span>
                    <span className="font-medium font-mono">{paymentData.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nội dung:</span>
                    <span className="font-medium font-mono">{paymentData.description}</span>
                  </div>
                </div>
                <div
                  id="embedded-payment-container"
                  className="border rounded-lg overflow-hidden"
                  style={{
                    height: '330px',
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
                  className="w-full hover:bg-gray-100 transition-colors duration-300"
                >
                  Đóng
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-orange-500" />
              Lịch sử giao dịch cũ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {order.transactions
              ?.filter(transaction => transaction.status !== 'Pending' && transaction.status !== 'Paid')
              .map((transaction, _index) => (
                <div key={transaction.id} className="rounded-lg border p-4 bg-gray-50/50 hover:bg-gray-50 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Nội dung:</span>
                    <span className="font-medium">{transaction.content}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-medium text-green-600 font-mono">
                      {transaction.price.toLocaleString('vi-VN')}
                      đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trạng thái:</span>
                    <Badge variant="outline" className={cn('border-2', getStatusColor(transaction.status))}>
                      {getStatusText(transaction.status)}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng #
              {order?.id}
              ? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder} className="bg-red-600 hover:bg-red-700">
              Xác nhận hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
