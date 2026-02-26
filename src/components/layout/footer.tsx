import { Phone } from 'lucide-react';
import Image from 'next/image';
import { useConfiguration } from '@/hooks/useConfiguration';
import { CircularFooter } from '../ui/circular-footer';

export const Footer = () => {
  const { address, phone } = useConfiguration();

  return (
    <div className="w-full">
      <CircularFooter
        logo={<Image src="/logo.png" alt="BFarmX" width={50} height={50} />}
        brandName="BFarmX"
        address={address}
        phone={phone}
        socialLinks={[
          {
            icon: <Phone className="h-5 w-5" />,
            href: '#',
            label: 'Phone',
          },
        ]}
        mainLinks={[
          { href: '/', label: 'Trang chủ' },
          { href: '/plants', label: 'Cây giống' },
          { href: '/plan', label: 'Khám phá kế hoạch' },
        ]}
        legalLinks={[
          { href: '/privacy', label: 'Chính sách bảo mật' },
          { href: '/guide', label: 'Tài liệu kiểm định' },
        ]}
        copyright={{
          text: '© 2025 BFarmX',
          license: 'All rights reserved',
        }}
      />
    </div>
  );
};
