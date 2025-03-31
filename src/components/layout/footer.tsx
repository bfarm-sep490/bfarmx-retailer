import { Hexagon, Phone } from 'lucide-react';
import { CircularFooter } from '../ui/circular-footer';

export const Footer = () => {
  return (
    <div className="w-full">
      <CircularFooter
        logo={<Hexagon className="h-10 w-10" />}
        brandName="BFarmX"
        socialLinks={[
          {
            icon: <Phone className="h-5 w-5" />,
            href: '#',
            label: 'Phone',
          },
        ]}
        mainLinks={[
          { href: '/', label: 'Home' },
          { href: '/plant', label: 'Plant Shop' },
          { href: '/about', label: 'About' },
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
