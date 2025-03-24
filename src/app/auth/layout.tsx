import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication - BFarmX',
  description: 'Bfarmx authentication pages',
};

export default function AuthLayout({
  children,
}: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Phần banner bên trái - ẩn trên mobile */}
      <div className="hidden md:flex md:w-1/2 bg-primary-700 p-8 flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logo-light.png"
              alt="BFarmX Logo"
              width={150}
              height={40}
              priority
            />
          </div>

          {/* Banner content */}
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">
              Welcome to BFarmX
            </h1>
            <p className="text-lg text-gray-200">
              Blockchain-based farm management platform
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-300">
          ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          BFarmX. All rights reserved.
        </div>
      </div>

      {/* Phần form bên phải */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Logo cho mobile */}
        <div className="md:hidden p-4">
          <Image
            src="/logo.png"
            alt="BFarmX Logo"
            width={120}
            height={32}
            priority
          />
        </div>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
