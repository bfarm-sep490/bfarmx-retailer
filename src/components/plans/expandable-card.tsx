'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useExpandable } from '@/hooks/use-expandable';
import { IconQrcode } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { QRCodeModal } from './qr-code-modal';

type PlanMetadata = {
  plant: {
    name: string;
    icon: React.ReactNode;
  };
  yield: {
    name: string;
    icon: React.ReactNode;
  };
  expert: {
    name: string;
    icon: React.ReactNode;
  };
  timeline: {
    start: string;
    end: string;
    icon: React.ReactNode;
  };
};

type PlanStatus = 'Draft' | 'Pending' | 'Ongoing' | 'Completed' | 'Cancelled';

type ProjectStatusCardProps = {
  id: number;
  title: string;
  progress: number;
  status: PlanStatus;
  statusIcon: React.ReactNode;
  metadata: PlanMetadata;
  tasks: Array<{ title: string; completed: boolean }>;
  qr_code: string;
  contract_address: string;
};

export function ProjectStatusCard({
  id,
  title,
  progress,
  status,
  statusIcon,
  metadata,
  tasks,
  qr_code,
  contract_address,
}: ProjectStatusCardProps) {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable();
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, animatedHeight]);

  const getStatusColor = (status: PlanStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'Ongoing':
        return 'bg-sky-100 text-sky-600 border-sky-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-600 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleViewDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/plans/${id}`);
  };

  const handleViewQR = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsQRModalOpen(true);
  };

  return (
    <>
      <Card
        className="w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl overflow-hidden"
        onClick={toggleExpand}
      >
        <CardHeader className="space-y-1 p-6">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-2">
              <Badge variant="secondary" className={`${getStatusColor(status)} border`}>
                <div className="flex items-center gap-1">
                  {statusIcon}
                  {status}
                </div>
              </Badge>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {title}
              </h3>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full border-gray-200 hover:bg-gray-100"
                    onClick={handleViewQR}
                  >
                    <IconQrcode className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View QR Code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>
                  {progress}
                  %
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <ProgressBar
                  value={progress}
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                />
              </div>
            </div>

            <motion.div
              style={{ height: animatedHeight }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <div ref={contentRef}>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {metadata.plant.icon && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            {metadata.plant.icon}
                            <span>{metadata.plant.name}</span>
                          </div>
                        )}
                        {metadata.yield.icon && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            {metadata.yield.icon}
                            <span>{metadata.yield.name}</span>
                          </div>
                        )}
                        {metadata.expert.icon && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            {metadata.expert.icon}
                            <span>{metadata.expert.name}</span>
                          </div>
                        )}
                        {metadata.timeline.icon && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            {metadata.timeline.icon}
                            <span>
                              {metadata.timeline.start}
                              {' '}
                              -
                              {' '}
                              {metadata.timeline.end}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-900">Plan Details</h4>
                        <div className="space-y-2">
                          {tasks.map((task, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg"
                            >
                              <span className="text-gray-600">{task.title}</span>
                              {task.completed && (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                          onClick={handleViewDetail}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          View Discussion
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="flex items-center justify-between w-full text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="text-gray-400">Contract:</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {contract_address.slice(0, 6)}
                ...
                {contract_address.slice(-4)}
              </span>
            </span>
          </div>
        </CardFooter>
      </Card>

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        planData={{
          id,
          plan_name: title,
          plant_name: metadata.plant.name,
          yield_name: metadata.yield.name,
          expert_name: metadata.expert.name,
          start_date: metadata.timeline.start,
          end_date: metadata.timeline.end,
          qr_code,
          contract_address,
        }}
      />
    </>
  );
}
