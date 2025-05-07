import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication - BFarmX',
  description: 'Bfarmx authentication pages',
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-neutral-900">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-r-[4rem] md:rounded-r-[6rem] lg:rounded-r-[8rem]" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent dark:from-emerald-500/20 dark:to-transparent rounded-r-[4rem] md:rounded-r-[6rem] lg:rounded-r-[8rem]" />
        <div className="relative z-10">
          <div className="mb-12">
            <Image
              src="https://ik.imagekit.io/van/logo.png?updatedAt=1744261533617"
              alt="BFarmX Logo"
              width={180}
              height={48}
              priority
              className="drop-shadow-lg"
            />
          </div>

          <div className="text-emerald-900 dark:text-emerald-100">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Chào mừng đến với BFarmX
            </h1>
            <p className="text-xl text-emerald-700 dark:text-emerald-300 leading-relaxed">
              Nền tảng quản lý nông trại áp dụng công nghệ blockchain
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Hiệu suất cao</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">Quản lý nông trại thông minh</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Bảo mật</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">Dữ liệu được bảo vệ an toàn</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-sm text-emerald-700 dark:text-emerald-300 mb-2">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            BFarmX. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="md:hidden p-6">
          <Image
            src="https://ik.imagekit.io/van/logo.png?updatedAt=1744261533617"
            alt="BFarmX Logo"
            width={140}
            height={38}
            priority
            className="drop-shadow-lg"
          />
        </div>

        <main className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-800 p-8">
              {children}
            </div>
          </div>
        </main>

        {/* Mobile Footer */}
        <div className="md:hidden p-6 flex flex-col items-center gap-4 text-sm text-emerald-700 dark:text-emerald-300">
          <div>
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            BFarmX. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
