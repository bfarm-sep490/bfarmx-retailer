'use client';

import type { Order } from '@/types';
import { usePayOS } from '@payos/payos-checkout';
import { useApiUrl, useOne } from '@refinedev/core';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { AlertCircle, ArrowLeft, CheckCircle2, CreditCard, History, Package, Receipt, Truck, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
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
import { cn } from '@/lib/utils';
import { axiosInstance } from '@/rest-data-provider/utils';

// Types
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

type BentoItem = {
  title: string;
  meta: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  colSpan?: number;
  hasPersistentHover?: boolean;
  content: React.ReactNode;
};

// Constants
const STATUS_COLORS = {
  Pending: {
    light: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    dark: 'dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
  },
  Deposit: {
    light: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    dark: 'dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
  },
  Paid: {
    light: 'bg-green-500/10 text-green-500 border-green-500/20',
    dark: 'dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
  },
  Cancel: {
    light: 'bg-red-500/10 text-red-500 border-red-500/20',
    dark: 'dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
  },
  default: {
    light: 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20',
    dark: 'dark:bg-neutral-500/20 dark:text-neutral-400 dark:border-neutral-500/30',
  },
};

const STATUS_GRADIENTS = {
  Pending: {
    light: 'from-orange-600 to-orange-700',
    dark: 'dark:from-orange-700 dark:to-orange-800',
  },
  Deposit: {
    light: 'from-yellow-600 to-yellow-700',
    dark: 'dark:from-yellow-700 dark:to-yellow-800',
  },
  Paid: {
    light: 'from-green-600 to-green-700',
    dark: 'dark:from-green-700 dark:to-green-800',
  },
  Cancel: {
    light: 'from-red-600 to-red-700',
    dark: 'dark:from-red-700 dark:to-red-800',
  },
  default: {
    light: 'from-neutral-600 to-neutral-700',
    dark: 'dark:from-neutral-700 dark:to-neutral-800',
  },
};

const STATUS_TEXTS = {
  PendingConfirmation: 'Chờ xác nhận',
  Pending: 'Chờ thanh toán',
  Deposit: 'Đặt cọc',
  Paid: 'Đã thanh toán',
  Cancel: 'Đã hủy',
};

const STATUS_PROGRESS = {
  PendingConfirmation: 25,
  Pending: 50,
  Deposit: 75,
  Paid: 100,
  Cancel: 0,
};

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="container max-w-7xl mx-auto px-4 py-8">
    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-lg dark:shadow-neutral-800/50 p-6">
      <div className="text-center">
        <p className="text-lg font-medium text-red-600 dark:text-red-400">{error}</p>
        <Button
          onClick={onRetry}
          className="mt-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
        >
          Thử lại
        </Button>
      </div>
    </div>
  </div>
);

const MessageState = ({ message }: { message: string }) => (
  <div className="container max-w-7xl mx-auto px-4 py-8">
    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-lg dark:shadow-neutral-800/50 p-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 animate-bounce" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
            Thành công!
          </h3>
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            {message}
          </p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white transition-all duration-300 transform hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại trang chi tiết
        </Button>
      </div>
    </div>
  </div>
);

const BentoCard = ({ item }: { item: BentoItem }) => (
  <div
    className={cn(
      'group relative p-4 rounded-xl overflow-hidden transition-all duration-300',
      'border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900',
      'hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.1)]',
      'hover:-translate-y-0.5 will-change-transform',
      item.colSpan || 'col-span-1',
      item.colSpan === 2 ? 'md:col-span-2' : '',
      {
        'shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.1)] -translate-y-0.5':
          item.hasPersistentHover,
      },
    )}
  >
    <div
      className={`absolute inset-0 ${
        item.hasPersistentHover ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      } transition-opacity duration-300`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:4px_4px]" />
    </div>

    <div className="relative flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 group-hover:bg-gradient-to-br transition-all duration-300">
          {item.icon}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 tracking-tight text-[15px]">
          {item.title}
          <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400 font-normal">
            {item.meta}
          </span>
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-snug font-[425]">
          {item.description}
        </p>
      </div>

      {item.tags && (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400">
            {item.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 backdrop-blur-sm transition-all duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                #
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">{item.content}</div>
    </div>

    <div
      className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-neutral-100/50 dark:via-neutral-800/50 to-transparent ${
        item.hasPersistentHover ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      } transition-opacity duration-300`}
    />
  </div>
);

export default function OrderShowPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: queryResult } = useOne<Order>({
    resource: 'orders',
    id: params.id as string,
  });
  const order = queryResult?.data;
  const [paymentData, setPaymentData] = useState<PaymentResponse['data'] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [_error, setError] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: 'https://bfarmx.space/payment-success',
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
  const apiUrl = useApiUrl();

  const handlePaymentClick = async () => {
    try {
      const paymentResponse = await axiosInstance.post<PaymentResponse>(
        'https://api.bfarmx.space/api/payments/deposit-payment/payos',
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
      const response = await axiosInstance.put(
        `${apiUrl}/orders/${order?.id}/status?status=Cancel`,
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
    return <Loading />;
  }

  if (_error) {
    return <ErrorState error={_error} onRetry={() => setError(null)} />;
  }

  if (message) {
    return <MessageState message={message} />;
  }

  const getStatusColor = (status: string) => {
    const statusKey = status as keyof typeof STATUS_COLORS;
    const colors = STATUS_COLORS[statusKey] || STATUS_COLORS.default;
    return `${colors.light} ${colors.dark}`;
  };

  const getHeaderColor = (status: string) => {
    const statusKey = status as keyof typeof STATUS_GRADIENTS;
    const gradients = STATUS_GRADIENTS[statusKey] || STATUS_GRADIENTS.default;
    return `${gradients.light} ${gradients.dark}`;
  };

  const getStatusText = (status: string) => {
    return STATUS_TEXTS[status as keyof typeof STATUS_TEXTS] || status;
  };

  const getOrderProgress = (status: string) => {
    return STATUS_PROGRESS[status as keyof typeof STATUS_PROGRESS] || 0;
  };

  const canMakePayment = order.status === 'Pending';
  const filteredTransactions = order?.transactions?.filter(
    transaction => transaction.status === 'Pending' || transaction.status === 'Paid',
  );

  const bentoItems: BentoItem[] = [
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
            <span className="text-neutral-600 dark:text-neutral-300">Ngày tạo:</span>
            <span className="font-medium font-mono">{dayjs(order.created_at).format('DD/MM/YYYY HH:mm')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600 dark:text-neutral-300">Ngày dự kiến nhận:</span>
            <span className="font-medium font-mono">{dayjs(order.estimate_pick_up_date).format('DD/MM/YYYY')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600 dark:text-neutral-300">Trạng thái:</span>
            <Badge variant="outline" className={cn('border-2', getStatusColor(order.status))}>
              {getStatusText(order.status)}
            </Badge>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
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
            <span className="text-neutral-600 dark:text-neutral-300">Tên cây:</span>
            <span className="font-medium">{order.plant_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600 dark:text-neutral-300">Loại bao bì:</span>
            <span className="font-medium">{order.packaging_type_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600 dark:text-neutral-300">Số lượng:</span>
            <span className="font-medium font-mono">
              {order.preorder_quantity}
              {' '}
              kg
            </span>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600 dark:text-neutral-300">Giá đặt cọc:</span>
              <span className="font-medium text-green-600 dark:text-green-400 font-mono">
                {order.deposit_price.toLocaleString('vi-VN')}
                {' '}
                đ
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600 dark:text-neutral-300">Tổng giá trị:</span>
              <span className="font-medium text-green-600 dark:text-green-400 font-mono">
                {(order.total_price || order.deposit_price / 0.3).toLocaleString('vi-VN')}
                {' '}
                đ
              </span>
            </div>
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
            <span className="text-neutral-600 dark:text-neutral-300">Tên người đặt:</span>
            <span className="font-medium">{order.retailer_name}</span>
          </div>
          <div className="flex justify-between gap-4 items-center">
            <span className="text-neutral-600 dark:text-neutral-300">Số điện thoại:</span>
            <span className="font-medium font-mono">{order.phone}</span>
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
            <div
              key={transaction.id}
              className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-600 dark:text-neutral-300">Nội dung:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{transaction.content}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-600 dark:text-neutral-300">Số tiền:</span>
                <span className="font-medium text-green-600 dark:text-green-400 font-mono">
                  {transaction.price.toLocaleString('vi-VN')}
                  {' '}
                  đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-300">Trạng thái:</span>
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
          className="flex items-center gap-2 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {order?.status === 'Pending' && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 dark:text-orange-400 mt-0.5" />
          <div>
            <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
              Lưu ý: Đơn hàng sẽ tự động hủy sau 3 ngày nếu chưa thanh toán
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">
              Vui lòng hoàn tất thanh toán trước khi đơn hàng bị hủy
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl shadow-lg dark:shadow-neutral-800/50 overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <div className={cn('relative px-8 py-6 text-white overflow-hidden', `bg-gradient-to-r ${getHeaderColor(order.status)}`)}>
          <div className="absolute inset-0 bg-[url('/blockchain-pattern.png')] opacity-10"></div>
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-wider">
                  Chi tiết đơn hàng
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-neutral-100 font-mono">
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
                  className="bg-white dark:bg-neutral-100 text-green-600 dark:text-green-700 hover:bg-white/90 dark:hover:bg-neutral-200 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
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

        <div className="p-6 bg-white dark:bg-neutral-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {bentoItems.map((item, index) => (
              <BentoCard key={index} item={item} />
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <span className="text-green-600 dark:text-green-400">●</span>
              Thanh toán đơn hàng
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            {paymentData && (
              <>
                <div className="text-center">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Vui lòng hoàn tất thanh toán trong form bên dưới
                  </p>
                  <p className="text-lg font-semibold mt-2 text-green-600 dark:text-green-400 font-mono">
                    {paymentData.amount.toLocaleString('vi-VN')}
                    {' '}
                    đ
                  </p>
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 space-y-2 w-full bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
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
                  className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
                  style={{
                    height: '330px',
                  }}
                />
                <div className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                  Sau khi thanh toán thành công, vui lòng đợi từ 5 - 10s để hệ thống tự động cập nhật.
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    exit();
                  }}
                  className="w-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300 border-neutral-200 dark:border-neutral-800"
                >
                  Đóng
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <History className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              Lịch sử giao dịch cũ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {order.transactions
              ?.filter(transaction => transaction.status !== 'Pending' && transaction.status !== 'Paid')
              .map((transaction, _index) => (
                <div
                  key={transaction.id}
                  className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-600 dark:text-neutral-300">Nội dung:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{transaction.content}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-600 dark:text-neutral-300">Số tiền:</span>
                    <span className="font-medium text-green-600 dark:text-green-400 font-mono">
                      {transaction.price.toLocaleString('vi-VN')}
                      {' '}
                      đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-neutral-300">Trạng thái:</span>
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
        <AlertDialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-neutral-900 dark:text-neutral-100">
              Xác nhận hủy đơn hàng
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600 dark:text-neutral-300">
              Bạn có chắc chắn muốn hủy đơn hàng #
              {order?.id}
              ? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder} className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
              Xác nhận hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
