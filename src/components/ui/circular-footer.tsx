import { MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

type FooterProps = {
  logo: React.ReactNode;
  brandName: string;
  address?: string;
  phone?: string;
  socialLinks: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  mainLinks: Array<{
    href: string;
    label: string;
  }>;
  legalLinks: Array<{
    href: string;
    label: string;
  }>;
  copyright: {
    text: string;
    license?: string;
  };
};

export const CircularFooter = ({
  logo,
  brandName,
  address,
  phone,
  // socialLinks,
  mainLinks,
  legalLinks,
  copyright,
}: FooterProps) => {
  return (
    <footer className="pb-6 pt-16 lg:pb-8 lg:pt-24">
      <div className="px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left Column - Address */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Địa chỉ</span>
              <span className="text-sm text-muted-foreground">{address}</span>
            </div>
          </div>

          {/* Center Column - Logo */}
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-x-2"
              aria-label={brandName}
            >
              {logo}
              <span className="font-bold text-xl">{brandName}</span>
            </Link>
            <div className="text-sm text-muted-foreground">
              {copyright.text}
              {copyright.license && <span className="ml-2">{copyright.license}</span>}
            </div>
          </div>

          {/* Right Column - Phone */}
          <div className="flex items-center gap-3 justify-end">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Liên hệ</span>
              <span className="text-sm text-muted-foreground">{phone}</span>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <nav>
              <ul className="list-none flex flex-wrap gap-4">
                {mainLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <ul className="list-none flex flex-wrap gap-4">
                {legalLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
