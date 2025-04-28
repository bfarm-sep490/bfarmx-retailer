import { Phone } from 'lucide-react';
import Image from 'next/image';
import { CircularFooter } from '../ui/circular-footer';

export const Footer = () => {
  return (
    <div className="w-full">
      <CircularFooter
        logo={<Image src="/logo.png" alt="BFarmX" width={50} height={50} />}
        brandName="BFarmX"
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
          { href: '/privacy', label: 'Privacy' },
          { href: '/terms', label: 'Terms' },
        ]}
        copyright={{
          text: '© 2025 BFarmX',
          license: 'All rights reserved',
        }}
      />
    </div>
  );
};
