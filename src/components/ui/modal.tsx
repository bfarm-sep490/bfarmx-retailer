import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';
import * as React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'Đóng',
  onButtonClick,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <p className="text-center text-sm text-muted-foreground">{message}</p>
          <Button
            onClick={onButtonClick || onClose}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700"
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
