'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Clock, Download, Link, RefreshCw } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds countdown

  const generateEncryptedData = async () => {
    try {
      setLoading(true);
      setError(null);
      setTimeLeft(30);

      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_QR_API_KEY || '',
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

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!loading && encryptedData && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loading, encryptedData, timeLeft]);

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
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            QR Code -
            {' '}
            {planData.plan_name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <AnimatePresence mode="wait">
            {loading
              ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Đang tạo QR code...</p>
                  </motion.div>
                )
              : error
                ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
                      </div>
                      <p className="text-sm text-red-500 mb-2">{error}</p>
                      <Button
                        variant="outline"
                        onClick={generateEncryptedData}
                        className="w-full"
                      >
                        Thử lại
                      </Button>
                    </motion.div>
                  )
                : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="w-full space-y-4"
                    >
                      {/* QR Code Container */}
                      <div className="relative flex justify-center">
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] h-4 bg-green-100/50 dark:bg-green-900/20 rounded-b-xl"></div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] h-4 bg-green-100/30 dark:bg-green-900/10 rounded-b-xl"></div>
                        <div className="relative rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                          <QRCode
                            id="qr-code"
                            value={qrData}
                            size={200}
                            level="H"
                            className="h-[200px] w-[200px]"
                          />
                        </div>
                      </div>

                      {/* Timer */}
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Còn lại
                          {' '}
                          {timeLeft}
                          {' '}
                          giây
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={handleDownload}
                          className="w-full bg-primary hover:bg-accent"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Tải xuống
                        </Button>
                        <Button
                          variant="outline"
                          onClick={generateEncryptedData}
                          className="w-full"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Tạo mới
                        </Button>
                      </div>

                      {/* URL Section */}
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowUrl(!showUrl)}
                        >
                          <Link className="mr-2 h-4 w-4" />
                          {showUrl ? 'Ẩn URL' : 'Hiển thị URL'}
                        </Button>
                        <AnimatePresence>
                          {showUrl && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
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
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
