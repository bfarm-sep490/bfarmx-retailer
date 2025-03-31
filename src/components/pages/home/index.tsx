import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calendar, Package, Scale, ShoppingCart, TreePine } from 'lucide-react';
import Link from 'next/link';
import { Hero } from './hero';
import { PlanCard } from './PlanCard';

export const Home = () => {
  return (
    <div className="page home flex flex-col gap-12">
      {/* Hero Section */}
      <Hero
        title="BFarmX"
        subtitle="Đặt trước cây giống và tham gia kế hoạch trồng cây với cam kết về chất lượng và giá cả tốt nhất. Đơn giản, uy tín, hiệu quả."
        actions={[
          {
            label: 'Xem Cây Giống',
            href: '#pre-orders',
            variant: 'outline',
          },
          {
            label: 'Tham Gia Kế Hoạch',
            href: '#plans',
            variant: 'default',
          },
        ]}
        titleClassName="text-5xl md:text-6xl font-extrabold"
        subtitleClassName="text-lg md:text-xl max-w-[600px]"
        actionsClassName="mt-8"
      />
      {/* Featured Plans Section */}
      <section className="container space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold">Kế Hoạch Đang Chạy</h2>
          <Button variant="outline" asChild className="group">
            <Link href="/plans">
              Xem Tất Cả
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Plan Card */}
          <PlanCard id="1" title="Cây Sầu Riêng" startDate="01/04/2024" endDate="30/04/2024" daysLeft={15} totalOrders={50} maxOrders={100} />
        </div>
      </section>

      {/* Pre-order Plants Section */}
      <section className="container space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold">Cây Giống Đặt Trước</h2>
          <Button variant="outline" asChild className="group">
            <Link href="/pre-orders">
              Xem Tất Cả
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pre-order Card 1 */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TreePine className="w-6 h-6 text-green-600 dark:text-green-400" />
                Rau Cải Xanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Thu hoạch: 30 ngày</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Scale className="w-4 h-4" />
                  <span>Đơn vị: kg</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>Đã đặt: 200/500 kg</span>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
                <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                  25.000đ/kg
                </div>
              </div>
              <Button className="w-full mt-6 group-hover:bg-green-600" asChild>
                <Link href="/pre-orders/1">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào Giỏ
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pre-order Card 2 */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TreePine className="w-6 h-6 text-green-600 dark:text-green-400" />
                Cà Chua
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Thu hoạch: 45 ngày</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Scale className="w-4 h-4" />
                  <span>Đơn vị: kg</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>Đã đặt: 150/300 kg</span>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
                <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                  35.000đ/kg
                </div>
              </div>
              <Button className="w-full mt-6 group-hover:bg-green-600" asChild>
                <Link href="/pre-orders/2">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào Giỏ
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pre-order Card 3 */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TreePine className="w-6 h-6 text-green-600 dark:text-green-400" />
                Hành Tím
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Thu hoạch: 60 ngày</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Scale className="w-4 h-4" />
                  <span>Đơn vị: tấn</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>Đã đặt: 2/5 tấn</span>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
                <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                  15.000.000đ/tấn
                </div>
              </div>
              <Button className="w-full mt-6 group-hover:bg-green-600" asChild>
                <Link href="/pre-orders/3">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào Giỏ
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pre-order Card 4 */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TreePine className="w-6 h-6 text-green-600 dark:text-green-400" />
                Rau Muống
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Thu hoạch: 25 ngày</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Scale className="w-4 h-4" />
                  <span>Đơn vị: bó</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>Đã đặt: 100/200 bó</span>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
                <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                  5.000đ/bó
                </div>
              </div>
              <Button className="w-full mt-6 group-hover:bg-green-600" asChild>
                <Link href="/pre-orders/4">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào Giỏ
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container bg-gray-50 dark:bg-gray-900 rounded-3xl p-12">
        <h2 className="text-3xl font-bold text-center mb-12">Cách Hoạt Động</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Plans Option */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold">Kế Hoạch Trồng Cây</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 dark:text-green-400 font-semibold">1</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Xem danh sách các kế hoạch trồng cây đang được triển khai
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Thời gian giao hàng: 3-6 tháng sau khi đặt hàng
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 dark:text-green-400 font-semibold">2</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Chọn kế hoạch phù hợp và kiểm tra số lượng còn lại
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Đặt cọc 30% giá trị đơn hàng
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 dark:text-green-400 font-semibold">3</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Thanh toán phần còn lại khi nhận cây
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Nhận cây giống đã được ươm mầm và chăm sóc
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-green-600 dark:text-green-400">Lưu ý:</span>
                  {' '}
                  Kế hoạch sẽ tự động đóng khi đủ số lượng đặt hàng
                </p>
              </div>
            </div>
          </div>

          {/* Plants Option */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <TreePine className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold">Cây Giống Đặt Trước</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 dark:text-green-400 font-semibold">1</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Chọn loại cây giống và số lượng mong muốn
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Thời gian giao hàng: 2-4 tháng sau khi đặt hàng
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 dark:text-green-400 font-semibold">2</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Đặt cọc 50% giá trị đơn hàng
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Chúng tôi sẽ bắt đầu ươm mầm và chăm sóc
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 dark:text-green-400 font-semibold">3</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Thanh toán phần còn lại khi nhận cây
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Nhận cây giống đã được chăm sóc theo yêu cầu
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-green-600 dark:text-green-400">Lưu ý:</span>
                  {' '}
                  Có thể hủy đơn hàng và hoàn tiền đặt cọc nếu cây chưa được ươm mầm
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
