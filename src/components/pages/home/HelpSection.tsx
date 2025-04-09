'use client';
import { Card, Carousel } from '@/components/ui/apple-cards-carousel';
import Image from 'next/image';
import React from 'react';

const DummyContent = () => {
  return (
    <>
      {[...Array.from({ length: 3 }).fill(1)].map((_, index) => {
        return (
          <div
            key={`dummy-content${index}`}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Truy xuất nguồn gốc minh bạch từ trang trại đến bàn ăn.
              </span>
              {' '}
              Theo dõi toàn bộ quá trình sản xuất nông sản từ khi gieo hạt đến khi thu hoạch.
              Dữ liệu được lưu trữ an toàn trên blockchain, đảm bảo tính minh bạch và không thể thay đổi.
              Mọi thông tin về nhiệt độ, độ ẩm, pH đều được cập nhật theo thời gian thực.
            </p>
            <Image
              src="https://images.unsplash.com/photo-1551970634-747846a548cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Smart farming with IoT sensors"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain rounded-lg"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: 'Đặt hàng theo Plan',
    title: 'Đặt hàng theo kế hoạch sản xuất.',
    src: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <DummyContent />,
  },
  {
    category: 'Đặt hàng theo Seed',
    title: 'Đặt trước hạt giống và theo dõi quá trình trồng.',
    src: 'https://images.unsplash.com/photo-1517868750774-cee9b34b7a48?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <DummyContent />,
  },
  {
    category: 'Theo dõi sản phẩm',
    title: 'Theo dõi toàn bộ quá trình sản xuất.',
    src: 'https://plus.unsplash.com/premium_photo-1667308529004-920e2c668ff5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <DummyContent />,
  },
  {
    category: 'Truy xuất nguồn gốc',
    title: 'Quét mã QR để xem thông tin chi tiết.',
    src: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <DummyContent />,
  },
  {
    category: 'IoT & Blockchain',
    title: 'Dữ liệu thời gian thực được lưu trữ an toàn.',
    src: 'https://images.unsplash.com/photo-1555037015-1498966bcd7c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <DummyContent />,
  },
  {
    category: 'Quản lý chất lượng',
    title: 'Đảm bảo chất lượng sản phẩm từ trang trại.',
    src: 'https://images.unsplash.com/photo-1555037015-1498966bcd7c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <DummyContent />,
  },
];

export const HelpSection = () => {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Giải pháp nông nghiệp thông minh với Blockchain.
      </h2>
      <Carousel items={cards} />
    </div>
  );
};
