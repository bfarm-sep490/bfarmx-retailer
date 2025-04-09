'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

type ProjectStatusCardProps = {
  id: number;
  title: string;
  progress: number;
  dueDate: string;
  contributors: Array<{ name: string; image?: string }>;
  tasks: Array<{ title: string; completed: boolean }>;
  status: 'Draft' | 'Pending' | 'Ongoing' | 'Completed' | 'Cancelled';
  statusIcon: React.ReactNode;
  metadata: Array<{ icon: React.ReactNode; label: string }>;
  plant_name: string;
  yield_name: string;
  expert_name: string;
  start_date: string;
  end_date: string;
  qr_code: string;
  contract_address: string;
};

export function ProjectStatusCard({
  id,
  title,
  progress,
  dueDate,
  contributors,
  tasks,
  status,
  statusIcon,
  metadata,
  plant_name,
  yield_name,
  expert_name,
  start_date,
  end_date,
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

  const getStatusColor = (status: ProjectStatusCardProps['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-600';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-600';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'Cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
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
        className="w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg"
        onClick={toggleExpand}
      >
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-2">
              <Badge variant="secondary" className={getStatusColor(status)}>
                <div className="flex items-center gap-1">
                  {statusIcon}
                  {status}
                </div>
              </Badge>
              <h3 className="text-2xl font-semibold">{title}</h3>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleViewQR}>
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

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>
                  {progress}
                  %
                </span>
              </div>
              <ProgressBar value={progress} className="h-2" />
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
                        {metadata.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Plan Details</h4>
                        {tasks.map((task, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-600">{task.title}</span>
                            {task.completed && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Expert</h4>
                        <div className="flex items-center gap-2">
                          {contributors.map((contributor, index) => (
                            <TooltipProvider key={index}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Avatar className="border-2 border-white">
                                    <AvatarImage
                                      src={
                                        contributor.image
                                        || `/placeholder.svg?height=32&width=32&text=${contributor.name[0]}`
                                      }
                                      alt={contributor.name}
                                    />
                                    <AvatarFallback>
                                      {contributor.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{contributor.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button className="w-full" onClick={handleViewDetail}>
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

        <CardFooter>
          <div className="flex items-center justify-between w-full text-sm text-gray-600">
            <span>
              Due Date:
              {dueDate}
            </span>
            <span>
              Status:
              {status}
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
          plant_name,
          yield_name,
          expert_name,
          start_date,
          end_date,
          qr_code,
          contract_address,
        }}
      />
    </>
  );
}
