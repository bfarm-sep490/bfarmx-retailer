'use client';

import type { BaseRecord, HttpError } from '@refinedev/core';
import type { IIdentity } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreate, useGetIdentity } from '@refinedev/core';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarDays, CalendarIcon, CheckCircle2, Clock, Info, Loader2, Minus, Package, Phone, Plus, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ChevronLeftIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useConfiguration } from '@/hooks/useConfiguration';
import { usePackagingTypes } from '@/hooks/usePackagingTypes';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart';

const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ tên'),
  phone: z.string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại không được quá 11 số')
    .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
  packaging_type_id: z.number().min(1, 'Vui lòng chọn loại đóng gói'),
  estimate_pick_up_date: z.date({
    required_error: 'Vui lòng chọn ngày dự kiến nhận hàng',
  }),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { data: user } = useGetIdentity<IIdentity>();
  const { mutate: createOrder, isLoading } = useCreate<BaseRecord, HttpError>();
  const { items, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { packagingTypes, isLoading: isLoadingPackagingTypes } = usePackagingTypes();
  const { depositPercent } = useConfiguration();
  const [month, setMonth] = useState(new Date());

  const getEarliestPickUpDate = () => {
    const minDate = new Date();
    if (items[0]?.plant?.average_duration_date) {
      minDate.setDate(minDate.getDate() + items[0].plant.average_duration_date);
    }
    return minDate;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      phone: '',
      packaging_type_id: 1,
      estimate_pick_up_date: getEarliestPickUpDate(),
    },
  });

  // Reset form values when items change
  useEffect(() => {
    if (items.length > 0) {
      const earliestDate = getEarliestPickUpDate();
      form.reset({
        ...form.getValues(),
        estimate_pick_up_date: earliestDate,
      });
      setMonth(earliestDate);
    }
  }, [items]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    createOrder({
      resource: 'orders',
      values: {
        retailer_id: user?.id,
        plant_id: items[0]?.plant.id,
        packaging_type_id: values.packaging_type_id,
        deposit_price: Math.round(getTotalPrice() * (depositPercent / 100)),
        phone: values.phone,
        preorder_quantity: getTotalItems(),
        estimate_pick_up_date: values.estimate_pick_up_date.toISOString(),
      },
      successNotification: {
        message: 'Đặt hàng thành công',
        type: 'success',
      },
      errorNotification: {
        message: 'Đặt hàng thất bại',
        type: 'error',
      },
    }, {
      onSuccess: (data) => {
        clearCart();
        router.push(`/orders/${data.data.id}`);
      },
    });
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
                  <span>
                    Đặt cọc
                    {' '}
                    {depositPercent}
                    %
                  </span>
                  <span className="font-medium">
                    {Math.round(getTotalPrice() * (depositPercent / 100)).toLocaleString('vi-VN')}
                    đ
                  </span>
                </div>
                <div className="h-px w-full bg-border" />
                <div className="flex justify-between text-lg font-medium text-primary">
                  <span></span>
                  <span>
                    {Math.round(getTotalPrice() * (depositPercent / 100)).toLocaleString('vi-VN')}
                    đ
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </aside>

      <div className="container-sm px-4 mt-4 lg:mt-12 m-0 flex flex-col gap-6 lg:gap-8 md:gap-8 w-full lg:w-[calc(80vw_-_40px_-_396px)]">
        <section className="flex flex-col gap-6 lg:gap-8 md:gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Thông tin khách hàng */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Thông tin khách hàng</h2>
                    <p className="text-sm text-muted-foreground">Thông tin liên hệ để nhận hàng</p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Họ tên
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            {...field}
                            className="h-10 text-sm md:text-base bg-muted/50 dark:bg-muted"
                            aria-label="Họ tên"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          Số điện thoại
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập số điện thoại của bạn"
                            className="h-10 text-sm md:text-base focus-visible:ring-primary"
                            {...field}
                            aria-label="Số điện thoại"
                          />
                        </FormControl>

                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              {/* Thông tin đơn hàng */}
              <Card className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground">Thông tin đơn hàng</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">Chọn loại đóng gói và ngày nhận hàng</p>
                  </div>
                </div>
                <div className="space-y-6 sm:space-y-8">
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-medium text-foreground">Loại đóng gói</h3>
                      </div>
                      <FormField
                        control={form.control}
                        name="packaging_type_id"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              value={field.value.toString()}
                              onValueChange={value => field.onChange(Number(value))}
                            >
                              <FormControl>
                                <SelectTrigger className="h-9 sm:h-10 text-sm focus-visible:ring-primary">
                                  <SelectValue placeholder="Chọn loại đóng gói" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {packagingTypes.map(type => (
                                  <SelectItem
                                    key={type?.id}
                                    value={type?.id?.toString() || ''}
                                    className="text-sm"
                                  >
                                    {type?.name}
                                    {' '}
                                    (
                                    {type?.quantity_per_pack}
                                    kg)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {field.value && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {packagingTypes.find(type => type.id === field.value)?.description}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-medium text-foreground">Ngày nhận hàng</h3>
                      </div>
                      <FormField
                        control={form.control}
                        name="estimate_pick_up_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'w-full h-9 sm:h-10 text-sm justify-start text-left font-normal truncate',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                    aria-label="Chọn ngày nhận hàng"
                                  >
                                    {field.value
                                      ? format(field.value, 'PPP', { locale: vi })
                                      : <span>Chọn ngày</span>}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <div className="rounded-lg border border-border">
                                  <div className="flex max-sm:flex-col">
                                    <div className="relative border-border py-3 sm:py-4 max-sm:order-1 max-sm:border-t sm:w-44">
                                      <div className="h-full border-border sm:border-e">
                                        <div className="flex flex-col px-2 gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start hover:bg-primary/10 text-xs sm:text-sm"
                                            onClick={() => {
                                              const minDate = new Date();
                                              minDate.setDate(minDate.getDate() + item.plant.average_duration_date);
                                              field.onChange(minDate);
                                              setMonth(minDate);
                                            }}
                                          >
                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                            Sớm nhất
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start hover:bg-primary/10 text-xs sm:text-sm"
                                            onClick={() => {
                                              const nextWeek = new Date();
                                              nextWeek.setDate(nextWeek.getDate() + item.plant.average_duration_date + 7);
                                              field.onChange(nextWeek);
                                              setMonth(nextWeek);
                                            }}
                                          >
                                            <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                            7 ngày sau
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start hover:bg-primary/10 text-xs sm:text-sm"
                                            onClick={() => {
                                              const nextWeek = new Date();
                                              nextWeek.setDate(nextWeek.getDate() + item.plant.average_duration_date + 14);
                                              field.onChange(nextWeek);
                                              setMonth(nextWeek);
                                            }}
                                          >
                                            <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                            14 ngày sau
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start hover:bg-primary/10 text-xs sm:text-sm"
                                            onClick={() => {
                                              const nextMonth = new Date();
                                              nextMonth.setDate(nextMonth.getDate() + item.plant.average_duration_date + 30);
                                              field.onChange(nextMonth);
                                              setMonth(nextMonth);
                                            }}
                                          >
                                            <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                            30 ngày sau
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={(date) => {
                                        field.onChange(date);
                                        if (date) {
                                          setMonth(date);
                                        }
                                      }}
                                      month={month}
                                      onMonthChange={setMonth}
                                      className="p-2 bg-background"
                                      disabled={(date) => {
                                        const minDate = new Date();
                                        minDate.setDate(minDate.getDate() + item.plant.average_duration_date);
                                        return date < minDate;
                                      }}
                                      locale={vi}
                                    />
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <div className="mt-2 space-y-2 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Info className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                <span>
                                  {`Thời gian phát triển: ${item.plant.average_duration_date} ngày`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                <span>
                                  {`Ngày sớm nhất có thể lấy: ${format(new Date(new Date().setDate(new Date().getDate() + item.plant.average_duration_date)), 'PPP', { locale: vi })}`}
                                </span>
                              </div>
                              {field.value && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                  <span>
                                    {`Ngày đã chọn: ${format(field.value, 'PPP', { locale: vi })}`}
                                  </span>
                                </div>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 dark:bg-muted p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2">
                      <Info className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      <span className="text-xs sm:text-sm font-medium text-foreground">Thông tin thêm</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-0.5" />
                        <span>
                          {`Số lượng đặt hàng: ${getTotalItems()} kg`}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-0.5" />
                        <span>
                          {`Giá trị đơn hàng: ${getTotalPrice().toLocaleString('vi-VN')} đ`}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-0.5" />
                        <span>
                          {`Tiền đặt cọc (${depositPercent}%): ${Math.round(getTotalPrice() * (depositPercent / 100)).toLocaleString('vi-VN')} đ`}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Lưu ý */}
              <Card className="p-6 bg-muted/50 dark:bg-muted">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium text-foreground">Lưu ý khi đặt hàng</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
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
              </Card>

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
          </Form>
        </section>
      </div>
    </div>
  );
}
