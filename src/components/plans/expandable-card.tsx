'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Leaf,
  MessageSquare,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { QRCodeModal } from './qr-code-modal';
import 'dayjs/locale/vi';

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
  progress: _progress,
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
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, animatedHeight]);

  useEffect(() => {
    // Calculate progress based on current date between start and end dates
    const startDate = dayjs(metadata.timeline.start);
    const endDate = dayjs(metadata.timeline.end);
    const now = dayjs();

    if (now.isBefore(startDate)) {
      setCurrentProgress(0);
    } else if (now.isAfter(endDate)) {
      setCurrentProgress(100);
    } else {
      const totalDuration = endDate.diff(startDate, 'day');
      const elapsedDuration = now.diff(startDate, 'day');
      const calculatedProgress = (elapsedDuration / totalDuration) * 100;
      setCurrentProgress(Math.min(Math.max(calculatedProgress, 0), 100));
    }
  }, [metadata.timeline.start, metadata.timeline.end]);

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

  const formatDate = (date: string) => {
    return dayjs(date).locale('vi').format('DD/MM/YYYY');
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
        className="w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl overflow-hidden group"
        onClick={toggleExpand}
      >
        <CardHeader className="space-y-3 p-6">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={`${getStatusColor(status)} border`}>
                  <div className="flex items-center gap-1">
                    {statusIcon}
                    {status}
                  </div>
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <div className="flex items-center gap-1">
                    <Leaf className="h-3 w-3" />
                    {metadata.plant.name}
                  </div>
                </Badge>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent line-clamp-1 transition-all duration-200">
                      {title}
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[300px]">
                    <p className="text-sm">{title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {contract_address && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-full border-gray-200 hover:bg-gray-100 shrink-0"
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
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatDate(metadata.timeline.start)}</span>
                <span>{formatDate(metadata.timeline.end)}</span>
              </div>
              <div className="relative h-4 rounded-full bg-gray-100 overflow-hidden">
                <ProgressBar
                  value={currentProgress}
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                    {Math.round(currentProgress)}
                    %
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Bắt đầu</span>
                <span>Kết thúc</span>
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
                      <div className="grid grid-cols-1 gap-3">
                        {metadata.yield.icon && (
                          <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              {metadata.yield.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Sản lượng</span>
                              <span className="font-medium truncate">{metadata.yield.name}</span>
                            </div>
                          </div>
                        )}
                        {metadata.expert.icon && (
                          <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              {metadata.expert.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Chuyên gia</span>
                              <span className="font-medium truncate">{metadata.expert.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-900">Chi tiết kế hoạch</h4>
                        <div className="space-y-2">
                          {tasks.map((task, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {task.completed
                                  ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                    )
                                  : (
                                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                    )}
                                <span className="text-gray-600 truncate">{task.title}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white transition-all duration-200"
                          onClick={handleViewDetail}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Xem thảo luận
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {contract_address && (
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
      )}
    </>
  );
}
