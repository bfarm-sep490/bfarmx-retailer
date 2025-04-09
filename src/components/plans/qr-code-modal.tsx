'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download } from 'lucide-react';
import QRCode from 'react-qr-code';

type QRCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  planData: {
    id: number;
    plan_name: string;
    plant_name: string;
    yield_name: string;
    expert_name: string;
    start_date: string;
    end_date: string;
    qr_code: string;
    contract_address: string;
  };
};

export function QRCodeModal({ isOpen, onClose, planData }: QRCodeModalProps) {
  // Add expiration time to QR data
  const qrData = JSON.stringify({
    url: `${window.location.origin}/qr/${planData.contract_address}`,
    expiresAt: planData.end_date,
  });

  const handleDownload = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) {
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `plan-${planData.id}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            QR Code -
            {' '}
            {planData.plan_name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          {/* QR Code */}
          <div className="rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <QRCode
              id="qr-code"
              value={qrData}
              size={200}
              level="H"
              className="h-[200px] w-[200px]"
            />
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            className="w-full bg-primary hover:bg-accent"
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
