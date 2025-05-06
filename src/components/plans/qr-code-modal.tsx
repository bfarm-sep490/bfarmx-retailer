'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Link } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  const [showUrl, setShowUrl] = useState(false);
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateEncryptedData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract_address: planData.contract_address,
          qrExpiryHours: 1 / 120, // 30 seconds
          accessExpiryHours: 1 / 60, // 1 minute
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate encrypted data');
      }

      const data = await response.json();
      setEncryptedData(data.encrypted_data);
    } catch (err) {
      setError('Failed to generate QR code');
      console.error('Error generating encrypted data:', err);
    } finally {
      setLoading(false);
    }
  };

  const qrData = JSON.stringify({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/qr/${encryptedData}`,
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

  const handleCopyUrl = () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/qr/${encryptedData}`;
    navigator.clipboard.writeText(url);
  };

  // Generate encrypted data when modal opens
  useEffect(() => {
    if (isOpen && !encryptedData) {
      generateEncryptedData();
    }
  }, [isOpen, encryptedData]);

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
        <div className="flex flex-col items-center gap-4 py-4">
          {loading
            ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Đang tạo QR code...</p>
                </div>
              )
            : error
              ? (
                  <div className="text-center">
                    <p className="text-sm text-red-500 mb-2">{error}</p>
                    <Button
                      variant="outline"
                      onClick={generateEncryptedData}
                      className="w-full"
                    >
                      Thử lại
                    </Button>
                  </div>
                )
              : (
                  <>
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
                    <p className="text-sm text-muted-foreground">
                      * QR code sẽ hết hạn sau 30 giây
                    </p>
                    {/* Download Button */}
                    <Button
                      onClick={handleDownload}
                      className="w-full bg-primary hover:bg-accent"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download QR Code
                    </Button>
                    {/* URL Display Section */}
                    <div className="w-full space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowUrl(!showUrl)}
                      >
                        <Link className="mr-2 h-4 w-4" />
                        {showUrl ? 'Ẩn URL' : 'Hiển thị URL'}
                      </Button>
                      {showUrl && (
                        <div className="flex items-center gap-2">
                          <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm break-all">
                            {`${process.env.NEXT_PUBLIC_APP_URL}/qr/${encryptedData}`}
                          </code>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopyUrl}
                            className="shrink-0"
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
