'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Circle } from 'lucide-react';

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-emerald-100/[0.08] dark:from-emerald-900/[0.08]',
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn('absolute', className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-r to-transparent',
            gradient,
            'backdrop-blur-[2px] border-2 border-emerald-200/[0.15] dark:border-emerald-800/[0.15]',
            'shadow-[0_4px_16px_0_rgba(16,185,129,0.05)] dark:shadow-[0_4px_16px_0_rgba(16,185,129,0.1)]',
            'after:absolute after:inset-0 after:rounded-full',
            'after:bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_70%)]',
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function HeroGeometric({
  badge = 'BFARMX RETAILER',
  title1 = 'Nông Sản Sạch',
  title2 = 'Truy Xuất Nguồn Gốc',
}: {
  badge?: string;
  title1?: string;
  title2?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden ">
      <div className="absolute inset-0 blur-3xl " />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-emerald-400/[0.15] dark:from-emerald-600/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-teal-400/[0.15] dark:from-teal-600/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-amber-400/[0.15] dark:from-amber-600/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-sky-400/[0.15] dark:from-sky-600/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-lime-400/[0.15] dark:from-lime-600/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/50 border border-emerald-200/50 dark:bg-emerald-950/50 dark:border-emerald-800/50 mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-emerald-500/80" />
            <span className="text-sm text-emerald-600 dark:text-emerald-400 tracking-wide">
              {badge}
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">

              <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
                {title1}
              </span>
              <br />

              <span
                className={cn(
                  'bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-foreground/90 to-rose-300 dark:from-indigo-400 dark:via-foreground/90 dark:to-rose-400',
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Kết nối nhà bán lẻ với nông trại thông minh. Đặt hàng theo giống cây.
              Theo dõi toàn bộ quá trình sản xuất với công nghệ Blockchain và IoT.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { HeroGeometric };
