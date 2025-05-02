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
  const [shortId, setShortId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => {
    const generateQrToken = async () => {
      try {
        // First generate JWT token
        const tokenResponse = await fetch('/api/qr/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contract_address: planData.contract_address,
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to generate QR token');
        }

        const tokenData = await tokenResponse.json();

        const shortIdResponse = await fetch('/api/qr/shorten', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: tokenData.token,
          }),
        });

        if (!shortIdResponse.ok) {
          throw new Error('Failed to generate short ID');
        }

        const shortIdData = await shortIdResponse.json();
        setShortId(shortIdData.shortId);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      generateQrToken();
    }
  }, [isOpen, planData.contract_address]);

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
    if (!shortId) {
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/qr/${shortId}`;
    navigator.clipboard.writeText(url);
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
            {loading
              ? (
                  <div className="h-[200px] w-[200px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                )
              : shortId
                ? (
                    <QRCode
                      id="qr-code"
                      value={JSON.stringify({
                        url: `${process.env.NEXT_PUBLIC_APP_URL}/qr/${shortId}`,
                      })}
                      size={200}
                      level="H"
                      className="h-[200px] w-[200px]"
                    />
                  )
                : (
                    <div className="h-[200px] w-[200px] flex items-center justify-center text-red-500">
                      Failed to generate QR code
                    </div>
                  )}
          </div>

          <p className="text-sm text-muted-foreground">
            * QR code sẽ hết hạn sau 24 giờ
          </p>

          {shortId && (
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
                    {`${process.env.NEXT_PUBLIC_APP_URL}/qr/${shortId}`}
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
          )}

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            className="w-full bg-primary hover:bg-accent"
            disabled={loading || !shortId}
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
