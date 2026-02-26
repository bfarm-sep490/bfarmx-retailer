'use client';
import Image from 'next/image';
import React from 'react';
import { Card, Carousel } from '@/components/ui/apple-cards-carousel';

const FeatureContent = ({ feature }: { feature: string }) => {
  const contentMap: Record<string, { title: string; sections: { title: string; description: string; image: string }[] }> = {
    'Đặt hàng theo kế hoạch': {
      title: 'Quản lý đơn hàng thông minh',
      sections: [
        {
          title: 'Đặt hàng linh hoạt',
          description: 'Hệ thống cho phép đặt hàng theo kế hoạch sản xuất, với các tùy chọn thanh toán linh hoạt. Quản lý đơn hàng từ khi đặt đến khi giao hàng.',
          image: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Thanh toán an toàn',
          description: 'Hỗ trợ thanh toán trả trước và thanh toán dư. Mọi giao dịch được bảo mật.',
          image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Theo dõi đơn hàng',
          description: 'Cập nhật trạng thái đơn hàng theo thời gian thực. Nhận thông báo về tiến độ sản xuất và vận chuyển.',
          image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ],
    },
    'Đặt hàng theo hạt giống': {
      title: 'Quản lý cây trồng và năng suất',
      sections: [
        {
          title: 'Quản lý cây trồng',
          description: 'Theo dõi và quản lý các loại cây trồng, tạo kế hoạch mẫu cho từng loại cây.',
          image: 'https://images.unsplash.com/photo-1517868750774-cee9b34b7a48?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Dự đoán năng suất',
          description: 'Hệ thống phân tích và dự đoán năng suất dựa trên điều kiện thời tiết và đất đai.',
          image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Kế hoạch mẫu',
          description: 'Tạo và quản lý các kế hoạch mẫu cho từng loại cây trồng, tối ưu hóa quy trình sản xuất.',
          image: 'https://images.unsplash.com/photo-1517868750774-cee9b34b7a48?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ],
    },
    'Theo dõi sản phẩm': {
      title: 'Quản lý quy trình sản xuất',
      sections: [
        {
          title: 'Theo dõi quy trình',
          description: 'Theo dõi toàn bộ quá trình sản xuất từ khi gieo hạt đến thu hoạch.',
          image: 'https://images.unsplash.com/photo-1681569122649-ac587a39a49d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Báo cáo sản xuất',
          description: 'Quản lý các báo cáo chăm sóc, đóng gói, thu hoạch và kiểm tra chất lượng.',
          image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Kiểm soát chất lượng',
          description: 'Theo dõi và đánh giá chất lượng sản phẩm trong suốt quá trình sản xuất.',
          image: 'https://images.unsplash.com/photo-1563201515-adbe35c669c5?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ],
    },
    'Truy xuất nguồn gốc': {
      title: 'Truy xuất nguồn gốc bằng QR Code',
      sections: [
        {
          title: 'Mã QR sản phẩm',
          description: 'Tạo mã QR duy nhất cho mỗi sản phẩm, lưu trữ toàn bộ thông tin sản xuất.',
          image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Lịch sử sản phẩm',
          description: 'Xem chi tiết quá trình sản xuất, kiểm tra chất lượng và vận chuyển.',
          image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Thông tin minh bạch',
          description: 'Cung cấp thông tin đầy đủ và minh bạch về nguồn gốc sản phẩm cho người tiêu dùng.',
          image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ],
    },
    'Blockchain': {
      title: 'Bảo mật dữ liệu với Blockchain',
      sections: [
        {
          title: 'Lưu trữ an toàn',
          description: 'Dữ liệu được lưu trữ an toàn trên blockchain, đảm bảo tính minh bạch và không thể thay đổi.',
          image: 'https://images.unsplash.com/photo-1555037015-1498966bcd7c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Hợp đồng thông minh',
          description: 'Tự động hóa các giao dịch và báo cáo thông qua hợp đồng thông minh.',
          image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Bảo mật dữ liệu',
          description: 'Đảm bảo tính bảo mật và toàn vẹn của dữ liệu trong suốt quá trình sản xuất.',
          image: 'https://images.unsplash.com/photo-1555037015-1498966bcd7c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ],
    },
    'Quản lý chất lượng': {
      title: 'Kiểm soát chất lượng toàn diện',
      sections: [
        {
          title: 'Kiểm tra chất lượng',
          description: 'Hệ thống tích hợp với các dịch vụ kiểm tra chất lượng uy tín như Eurofins. Phân loại chất lượng thành 3 cấp độ: Loại 1, Loại 2 và Loại 3.',
          image: 'https://images.unsplash.com/photo-1563201515-adbe35c669c5?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Tiêu chuẩn chất lượng',
          description: 'Loại 1: Tất cả tiêu chí kiểm tra đều dưới mức tối đa cho phép. Loại 2: Có vi phạm nhẹ nhưng dưới 3 tiêu chí. Loại 3: Có 1 vi phạm nghiêm trọng hoặc trên 3 vi phạm nhẹ.',
          image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          title: 'Xử lý kết quả kiểm định',
          description: 'Tự động phân loại và xử lý kết quả kiểm định theo 3 cấp độ. Tạo nhiệm vụ chăm sóc và cải thiện chất lượng dựa trên kết quả kiểm định.',
          image: 'https://images.unsplash.com/photo-1563201515-adbe35c669c5?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ],
    },
  };

  const content = contentMap[feature];

  if (!content) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
        {content.title}
      </h3>
      {content.sections.map((section, index) => (
        <div key={index} className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl">
          <h4 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            {section.title}
          </h4>
          <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-xl font-sans max-w-3xl mx-auto mb-6">
            {section.description}
          </p>
          <Image
            src={section.image}
            alt={section.title}
            height="500"
            width="500"
            className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};

const data = [
  {
    category: 'Đặt hàng theo kế hoạch',
    title: 'Quản lý đơn hàng thông minh',
    src: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <FeatureContent feature="Đặt hàng theo kế hoạch" />,
  },
  {
    category: 'Đặt hàng theo hạt giống',
    title: 'Quản lý cây trồng và năng suất',
    src: 'https://images.unsplash.com/photo-1517868750774-cee9b34b7a48?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <FeatureContent feature="Đặt hàng theo hạt giống" />,
  },
  {
    category: 'Theo dõi sản phẩm',
    title: 'Quản lý quy trình sản xuất',
    src: 'https://images.unsplash.com/photo-1681569122649-ac587a39a49d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <FeatureContent feature="Theo dõi sản phẩm" />,
  },
  {
    category: 'Truy xuất nguồn gốc',
    title: 'Truy xuất nguồn gốc bằng QR Code',
    src: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <FeatureContent feature="Truy xuất nguồn gốc" />,
  },
  {
    category: 'Blockchain',
    title: 'Bảo mật dữ liệu với Blockchain',
    src: 'https://images.unsplash.com/photo-1555037015-1498966bcd7c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <FeatureContent feature="Blockchain" />,
  },
  {
    category: 'Quản lý chất lượng',
    title: 'Kiểm soát chất lượng toàn diện',
    src: 'https://images.unsplash.com/photo-1563201515-adbe35c669c5?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <FeatureContent feature="Quản lý chất lượng" />,
  },
];

export const HelpSection = () => {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Giải pháp nông nghiệp thông minh với Blockchain
      </h2>
      <Carousel items={cards} />
    </div>
  );
};
