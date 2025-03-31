import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
      <div className="container relative z-10 text-center space-y-6 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-green-800 dark:text-green-100">
          Kế Hoạch Trồng Cây
        </h1>
        <p className="text-xl text-green-700 dark:text-green-200 max-w-2xl mx-auto">
          Khám phá và đặt hàng các loại cây giống chất lượng cao. Hãy cùng chúng tôi xây dựng một tương lai xanh hơn.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            <Link href="/plans">
              Xem Kế Hoạch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
            <Link href="/pre-orders">Đặt Hàng Ngay</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
