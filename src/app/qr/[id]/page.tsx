'use client';

import Particles from '@/components/particles';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useOne } from '@refinedev/core';
import { Connex } from '@vechain/connex';
import { motion } from 'framer-motion';
import { Calendar, Leaf, Package, User } from 'lucide-react';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';

const style = document.createElement('style');
style.textContent = `
  @keyframes progress {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

type PlanData = {
  planId: string;
  plantId: string;
  yieldId: string;
  expertId: string;
  planName: string;
  startDate: string;
  endDate: string;
  estimatedProduct: string;
  estimatedUnit: string;
  status: string;
};

type TaskMilestone = {
  taskId: string;
  taskType: string;
  timestamp: string;
  status: string;
  data: {
    Description: string;
    Farmer: { Id: number; Name: string };
    Fertilizers: Array<{ Id: number; Name: string; Quantity: number; Unit: string }>;
    Pesticides: Array<{ Id: number; Name: string; Quantity: number; Unit: string }>;
    Items: Array<{ Id: number; Name: string; Quantity: number; Unit: string }>;
    Timestamp: number;
  };
};

type InspectionMilestone = {
  inspectionId: string;
  timestamp: string;
  inspectionType: string;
  data: {
    Inspector: {
      Id: number;
      Name: string;
    };
    Arsen: number;
    Plumbum: number;
    Cadmi: number;
    Hydrargyrum: number;
    Salmonella: number;
    Coliforms: number;
    Ecoli: number;
    Glyphosate_Glufosinate: number;
    SulfurDioxide: number;
    MethylBromide: number;
    HydrogenPhosphide: number;
    Dithiocarbamate: number;
    Nitrat: number;
    NaNO3_KNO3: number;
    Chlorate: number;
    Perchlorate: number;
    ResultContent: string;
    Timestamp: string;
  };
};

export default function QRPlanDetailPage({ params }: { params: Promise<{ id: string } | null> }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<{
    planData: PlanData | null;
    taskList: TaskMilestone[] | null;
    inspectionList: InspectionMilestone[] | null;
  }>({
    planData: null,
    taskList: null,
    inspectionList: null,
  });
  const resolvedParams = use(params);
  const PLAN_MANAGEMENT_ADDRESS = resolvedParams?.id || '';

  const { data: plantData, isLoading: isPlantLoading } = useOne({
    resource: 'plants',
    id: plans.planData?.plantId,
    queryOptions: {
      enabled: !!plans.planData?.plantId,
    },
  });

  const { data: yieldData, isLoading: isYieldLoading } = useOne({
    resource: 'yields',
    id: plans.planData?.yieldId,
    queryOptions: {
      enabled: !!plans.planData?.yieldId,
    },
  });

  const { data: expertData, isLoading: isExpertLoading } = useOne({
    resource: 'experts',
    id: plans.planData?.expertId,
    queryOptions: {
      enabled: !!plans.planData?.expertId,
    },
  });

  const loadBlockchainData = async () => {
    try {
      // Validate address
      if (!PLAN_MANAGEMENT_ADDRESS || !/^0x[a-fA-F0-9]{40}$/.test(PLAN_MANAGEMENT_ADDRESS)) {
        setError('Địa chỉ không hợp lệ');
        setLoading(false);
        return;
      }

      // Only initialize Connex on the client side
      if (typeof window === 'undefined') {
        setError('Không thể kết nối đến blockchain');
        setLoading(false);
        return;
      }

      const connex = new Connex({
        node: 'https://testnet.vechain.org',
        network: 'test',
      });

      const method = connex.thor.account(PLAN_MANAGEMENT_ADDRESS).method({
        inputs: [],
        name: 'getPlanInfo',
        outputs: [
          {
            components: [
              { name: 'planId', type: 'uint256' },
              { name: 'plantId', type: 'uint256' },
              { name: 'yieldId', type: 'uint256' },
              { name: 'expertId', type: 'uint256' },
              { name: 'planName', type: 'string' },
              { name: 'startDate', type: 'uint256' },
              { name: 'endDate', type: 'uint256' },
              { name: 'estimatedProduct', type: 'uint256' },
              { name: 'estimatedUnit', type: 'string' },
              { name: 'status', type: 'string' },
            ],
            name: 'planData',
            type: 'tuple',
          },
          {
            components: [
              { name: 'taskId', type: 'uint256' },
              { name: 'taskType', type: 'string' },
              { name: 'timestamp', type: 'uint256' },
              { name: 'status', type: 'string' },
              { name: 'data', type: 'string' },
            ],
            name: 'taskList',
            type: 'tuple[]',
          },
          {
            components: [
              { name: 'inspectionId', type: 'uint256' },
              { name: 'timestamp', type: 'uint256' },
              { name: 'inspectionType', type: 'string' },
              { name: 'data', type: 'string' },
            ],
            name: 'inspectionList',
            type: 'tuple[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      });

      const result = await method.call();

      if (!result?.decoded) {
        setError('Không thể đọc dữ liệu từ blockchain');
        setLoading(false);
        return;
      }

      const parsedPlans = {
        planData: {
          planId: result.decoded.planData?.[0]?.toString() || '',
          plantId: result.decoded.planData?.[1]?.toString() || '',
          yieldId: result.decoded.planData?.[2]?.toString() || '',
          expertId: result.decoded.planData?.[3]?.toString() || '',
          planName: result.decoded.planData?.[4] || '',
          startDate: result.decoded.planData?.[5]
            ? new Date(Number(result.decoded.planData[5]) * 1000).toLocaleDateString()
            : '',
          endDate: result.decoded.planData?.[6]
            ? new Date(Number(result.decoded.planData[6]) * 1000).toLocaleDateString()
            : '',
          estimatedProduct: result.decoded.planData?.[7]?.toString() || '',
          estimatedUnit: result.decoded.planData?.[8] || '',
          status: result.decoded.planData?.[9] || '',
        },
        taskList: result.decoded.taskList?.map((task: any) => ({
          taskId: task?.[0]?.toString() || '',
          taskType: task?.[1] || '',
          timestamp: task?.[2]
            ? new Date(Number(task[2]) * 1000).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
            : '',
          status: task?.[3] || '',
          data: task?.[4] ? JSON.parse(task[4]) : {},
        })) || [],
        inspectionList: result.decoded.inspectionList?.map((inspection: any) => ({
          inspectionId: inspection?.[0]?.toString() || '',
          timestamp: inspection?.[1]
            ? new Date(Number(inspection[1]) * 1000).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
            : '',
          inspectionType: inspection?.[2] || '',
          data: inspection?.[3] ? JSON.parse(inspection[3]) : {},
        })) || [],
      };

      setPlans(parsedPlans);
      setLoading(false);
    } catch (error) {
      console.error('Error loading blockchain data:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (PLAN_MANAGEMENT_ADDRESS) {
      loadBlockchainData();
    }
  }, [PLAN_MANAGEMENT_ADDRESS]);

  if (!resolvedParams?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="relative">
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-red-100/50 dark:bg-red-900/20 rounded-b-xl"></div>
            <div className="absolute -bottom-4 left-8 right-8 h-4 bg-red-100/30 dark:bg-red-900/10 rounded-b-xl"></div>
            <Card className="relative border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Mã QR không hợp lệ</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Vui lòng quét lại mã QR hoặc kiểm tra lại đường dẫn.</p>
                <Button variant="outline" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'Đang thực hiện':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      case 'Chờ xử lý':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
      case 'Đã hủy':
        return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="relative">
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-green-100/50 dark:bg-green-900/20 rounded-b-xl"></div>
            <div className="absolute -bottom-4 left-8 right-8 h-4 bg-green-100/30 dark:bg-green-900/10 rounded-b-xl"></div>
            <Card className="relative border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div>
                  <DotLottieReact
                    src="/anim/loading.json"
                    loop
                    autoplay
                  />
                </div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Đang tải dữ liệu</h3>
                <p className="text-gray-600 dark:text-gray-300">Vui lòng đợi trong giây lát...</p>
                <div className="mt-4">
                  <div className="h-2 bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-green-500 dark:bg-green-400 rounded-full animate-progress"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="relative">
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-red-100/50 dark:bg-red-900/20 rounded-b-xl"></div>
            <div className="absolute -bottom-4 left-8 right-8 h-4 bg-red-100/30 dark:bg-red-900/10 rounded-b-xl"></div>
            <Card className="relative border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Không thể kết nối</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                <div className="space-y-3">
                  <Button variant="outline" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Thử lại
                  </Button>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!plans.planData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="relative">
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-b-xl"></div>
            <div className="absolute -bottom-4 left-8 right-8 h-4 bg-yellow-100/30 dark:bg-yellow-900/10 rounded-b-xl"></div>
            <Card className="relative border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-300 mb-2">Không tìm thấy dữ liệu</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Không thể tìm thấy thông tin kế hoạch từ blockchain.</p>
                <div className="space-y-3">
                  <Button variant="outline" className="border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Thử lại
                  </Button>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Card with Stacked Effect */}
            <div className="relative">
              {/* Background Stacked Cards */}
              <div className="absolute -bottom-2 left-4 right-4 h-4 bg-green-100/50 dark:bg-green-900/20 rounded-b-xl"></div>
              <div className="absolute -bottom-4 left-8 right-8 h-4 bg-green-100/30 dark:bg-green-900/10 rounded-b-xl"></div>

              <Card className="relative border-0 shadow-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
                <CardHeader className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 w-full">
                      <div className="flex justify-between items-center gap-3">
                        <Image
                          src="https://ik.imagekit.io/van/logo.png?updatedAt=1744261533617"
                          alt="BFarmX Logo"
                          width={40}
                          height={40}
                          priority
                          className="drop-shadow-lg"
                        />
                        <Badge variant="secondary" className={`${getStatusColor(plans.planData.status)} rounded-full px-4 py-1`}>
                          {plans.planData.status}
                        </Badge>

                      </div>
                      <CardTitle className="mt-2 text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        {plans.planData.planName}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Progress Section with Stacked Effect */}
                  <div className="relative">
                    <div className="absolute -bottom-2 left-4 right-4 h-4 bg-green-100/50 dark:bg-green-900/20 rounded-b-xl"></div>
                    <div className="absolute -bottom-4 left-8 right-8 h-4 bg-green-100/30 dark:bg-green-900/10 rounded-b-xl"></div>
                    <div className="relative space-y-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 md:p-6 rounded-xl border border-green-100 dark:border-green-800">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-base md:text-lg font-semibold text-green-800 dark:text-green-300 whitespace-nowrap">Tiến độ thời gian</span>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-auto">
                          <span className="text-xs md:text-sm text-green-600 dark:text-green-400 whitespace-nowrap">Đã trôi qua</span>
                          <span className="text-base md:text-lg font-bold text-green-800 dark:text-green-300 whitespace-nowrap">
                            {Math.min(
                              Math.round(
                                ((new Date().getTime() - new Date(plans.planData.startDate).getTime())
                                  / (new Date(plans.planData.endDate).getTime() - new Date(plans.planData.startDate).getTime()))
                                * 100,
                              ),
                              100,
                            )}
                            %
                          </span>
                        </div>
                      </div>

                      <Progress
                        value={Math.min(
                          ((new Date().getTime() - new Date(plans.planData.startDate).getTime())
                            / (new Date(plans.planData.endDate).getTime() - new Date(plans.planData.startDate).getTime()))
                          * 100,
                          100,
                        )}
                        className="h-2 md:h-3 bg-green-100 dark:bg-green-900/20 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500 dark:[&>div]:from-green-400 dark:[&>div]:to-emerald-400"
                      />

                      <div className="flex justify-between text-xs md:text-sm text-green-600 dark:text-green-400 gap-1 md:gap-0">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                          <span className="text-gray-500 dark:text-gray-400">Bắt đầu:</span>
                          <span className="font-medium">{plans.planData.startDate}</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                          <span className="text-gray-500 dark:text-gray-400">Kết thúc:</span>
                          <span className="font-medium">{plans.planData.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Production with Stacked Effect */}
                  <div className="relative">
                    <div className="absolute -bottom-2 left-4 right-4 h-4 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-b-xl"></div>
                    <div className="absolute -bottom-4 left-8 right-8 h-4 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-b-xl"></div>
                    <div className="relative bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                          <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">Sản lượng ước tính</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">Tổng sản lượng</p>
                          <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                            {plans.planData.estimatedProduct}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">Đơn vị tính</p>
                          <p className="text-lg font-medium text-emerald-800 dark:text-emerald-300">kg</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Farm Details Grid with Stacked Effect */}
                  <div className="relative">
                    <div className="absolute -bottom-2 left-4 right-4 h-4 bg-teal-100/50 dark:bg-teal-900/20 rounded-b-xl"></div>
                    <div className="absolute -bottom-4 left-8 right-8 h-4 bg-teal-100/30 dark:bg-teal-900/10 rounded-b-xl"></div>
                    <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                      {/* Plant ID Card */}
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 md:p-6 shadow-sm border border-green-100 dark:border-green-800">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-100/50 dark:bg-green-900/20"></div>
                        <div className="relative z-10 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex-shrink-0">
                              <Leaf className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-green-600 dark:text-green-400 truncate">Mã cây trồng</span>
                          </div>
                          {isPlantLoading
                            ? (
                                <div className="h-8 w-32 bg-green-100 dark:bg-green-900/20 rounded animate-pulse" />
                              )
                            : (
                                <p className="text-lg md:text-2xl font-bold text-green-800 dark:text-green-300 truncate" title={plantData?.data?.plant_name || plans.planData.plantId}>
                                  {plantData?.data?.plant_name || plans.planData.plantId}
                                </p>
                              )}
                        </div>
                      </div>

                      {/* Product ID Card */}
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 md:p-6 shadow-sm border border-emerald-100 dark:border-emerald-800">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-100/50 dark:bg-emerald-900/20"></div>
                        <div className="relative z-10 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex-shrink-0">
                              <Package className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-emerald-600 dark:text-emerald-400 truncate">Mã đất trồng</span>
                          </div>
                          {isYieldLoading
                            ? (
                                <div className="h-8 w-32 bg-emerald-100 dark:bg-emerald-900/20 rounded animate-pulse" />
                              )
                            : (
                                <p className="text-lg md:text-2xl font-bold text-emerald-800 dark:text-emerald-300 truncate" title={yieldData?.data?.yield_name || plans.planData.yieldId}>
                                  {yieldData?.data?.yield_name || plans.planData.yieldId}
                                </p>
                              )}
                        </div>
                      </div>

                      {/* Expert ID Card */}
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-4 md:p-6 shadow-sm border border-teal-100 dark:border-teal-800">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-teal-100/50 dark:bg-teal-900/20"></div>
                        <div className="relative z-10 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex-shrink-0">
                              <User className="h-4 w-4 md:h-5 md:w-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-teal-600 dark:text-teal-400 truncate">Chuyên gia</span>
                          </div>
                          {isExpertLoading
                            ? (
                                <div className="h-8 w-32 bg-teal-100 dark:bg-teal-900/20 rounded animate-pulse" />
                              )
                            : (
                                <p className="text-lg md:text-2xl font-bold text-teal-800 dark:text-teal-300 truncate" title={expertData?.data?.name || plans.planData.expertId}>
                                  {expertData?.data?.name || plans.planData.expertId}
                                </p>
                              )}
                        </div>
                      </div>

                      {/* Time Card */}
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-4 md:p-6 shadow-sm border border-cyan-100 dark:border-cyan-800">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-cyan-100/50 dark:bg-cyan-900/20"></div>
                        <div className="relative z-10 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex-shrink-0">
                              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-cyan-600 dark:text-cyan-400 truncate">Thời gian</span>
                          </div>
                          <div className="space-y-1 gap-2 flex flex-row md:flex-col justify-between">
                            <div className="flex flex-col">
                              <span className="text-[10px] md:text-xs text-cyan-700 dark:text-cyan-300">Bắt đầu</span>
                              <span className="text-sm md:text-base font-bold text-cyan-800 dark:text-cyan-300 truncate" title={plans.planData.startDate}>
                                {plans.planData.startDate}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] md:text-xs text-cyan-700 dark:text-cyan-300">Kết thúc</span>
                              <span className="text-sm md:text-base font-bold text-cyan-800 dark:text-cyan-300 truncate" title={plans.planData.endDate}>
                                {plans.planData.endDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tasks Section with Stacked Effect */}
                  {plans.taskList && plans.taskList.length > 0 && (
                    <div className="relative">
                      <div className="absolute -bottom-2 left-4 right-4 h-4 bg-cyan-100/50 dark:bg-cyan-900/20 rounded-b-xl"></div>
                      <div className="absolute -bottom-4 left-8 right-8 h-4 bg-cyan-100/30 dark:bg-cyan-900/10 rounded-b-xl"></div>
                      <div className="relative space-y-6">
                        <h4 className="text-xl font-bold text-green-800 dark:text-green-300">Quy trình canh tác</h4>
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-200 dark:bg-green-800"></div>

                          <Accordion type="single" collapsible className="space-y-4">
                            {plans.taskList.map((task, _index) => (
                              <div key={`${task.taskId}-${task.timestamp}`} className="relative pl-12">
                                {/* Timeline dot with icon */}
                                <div className="absolute left-1 top-7 w-6 h-6 rounded-full bg-green-50 dark:bg-green-900/20 border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-green-900/30">
                                  <div className="relative">
                                    <Leaf className="w-4 h-4 text-green-600 dark:text-green-400 animate-pulse" />
                                    <div className="absolute inset-0 rounded-full bg-green-500 dark:bg-green-400 opacity-20 animate-ping"></div>
                                  </div>
                                </div>

                                <div className="relative">
                                  <div className="absolute -bottom-2 left-4 right-4 h-4 bg-white/50 dark:bg-gray-800/50 rounded-b-xl"></div>
                                  <div className="absolute -bottom-4 left-8 right-8 h-4 bg-white/30 dark:bg-gray-800/30 rounded-b-xl"></div>

                                  <AccordionItem value={`${task.taskId}-${task.timestamp}`} className="border-0">
                                    <Card className="relative border-0 shadow-sm py-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                                  gap-0 hover:shadow-md transition-shadow duration-300"
                                    >
                                      <CardHeader>
                                        <AccordionTrigger className=" hover:no-underline w-full">
                                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-2">
                                            <div className="flex items-start gap-2 w-full md:w-auto">

                                              <div className="min-w-0 flex-1">
                                                <CardTitle className="text-sm md:text-lg font-semibold text-green-800 dark:text-green-300 truncate">
                                                  {task.taskType}
                                                </CardTitle>
                                                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                                                  {task.timestamp}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                              <Badge
                                                variant="secondary"
                                                className={`${getStatusColor(task.status)} rounded-full text-xs md:text-sm px-2 md:px-3 py-0.5 md:py-1 whitespace-nowrap`}
                                              >
                                                {task.status}
                                              </Badge>
                                            </div>
                                          </div>
                                        </AccordionTrigger>
                                      </CardHeader>

                                      <AccordionContent>
                                        <motion.div
                                          className="overflow-hidden"
                                        >
                                          <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Người thực hiện</p>
                                                <p className="font-medium text-green-800 dark:text-green-300">{task.data?.Farmer?.Name || ''}</p>
                                              </div>
                                              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Mô tả</p>
                                                <p className="font-medium text-green-800 dark:text-green-300">{task.data?.Description || ''}</p>
                                              </div>
                                            </div>

                                            {task.data?.Fertilizers?.length > 0 && (
                                              <div className="mt-4">
                                                <h5 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3">Phân bón sử dụng</h5>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                  {task.data.Fertilizers.map(ft => (
                                                    <motion.div
                                                      key={ft.Id}
                                                      initial={{ opacity: 0, scale: 0.9 }}
                                                      animate={{ opacity: 1, scale: 1 }}
                                                      transition={{ duration: 0.2 }}
                                                      className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-100 dark:border-green-800 hover:shadow-md transition-shadow duration-300"
                                                    >
                                                      <p className="font-medium text-green-800 dark:text-green-300">{ft.Name}</p>
                                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {ft.Quantity}
                                                        {' '}
                                                        {ft.Unit}
                                                      </p>
                                                    </motion.div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                            {task.data?.Items?.length > 0 && (
                                              <div className="mt-4">
                                                <h5 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3">Các mặt hàng khác</h5>
                                              </div>
                                            )}
                                          </CardContent>
                                        </motion.div>
                                      </AccordionContent>
                                    </Card>
                                  </AccordionItem>
                                </div>
                              </div>
                            ))}
                          </Accordion>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inspections Section with Stacked Effect */}
                  {plans.inspectionList && plans.inspectionList.length > 0 && (
                    <div className="relative">
                      <div className="absolute -bottom-2 left-4 right-4 h-4 bg-blue-100/50 dark:bg-blue-900/20 rounded-b-xl"></div>
                      <div className="absolute -bottom-4 left-8 right-8 h-4 bg-blue-100/30 dark:bg-blue-900/10 rounded-b-xl"></div>
                      <div className="relative space-y-6">
                        <h4 className="text-xl font-bold text-green-800 dark:text-green-300">Kiểm định chất lượng</h4>
                        <div className="space-y-4">
                          {plans.inspectionList.map((inspection, _index) => (
                            <div key={inspection.inspectionId} className="relative">
                              <div className="absolute -bottom-2 left-4 right-4 h-4 bg-white/50 dark:bg-gray-800/50 rounded-b-xl"></div>
                              <div className="absolute -bottom-4 left-8 right-8 h-4 bg-white/30 dark:bg-gray-800/30 rounded-b-xl"></div>
                              <Card className="relative gap-2 border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
                                <CardHeader className="p-4">
                                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <CardTitle className="text-base md:text-lg font-semibold text-green-800 dark:text-green-300 truncate">
                                            {inspection.inspectionType}
                                          </CardTitle>
                                          <Badge
                                            variant="secondary"
                                            className={`${
                                              inspection.inspectionType === 'Loại 1'
                                                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                                : inspection.inspectionType === 'Loại 2'
                                                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                                                  : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                            } rounded-full px-2 py-0.5 text-xs`}
                                          >
                                            {inspection.inspectionType}
                                          </Badge>
                                        </div>
                                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                                          {inspection.timestamp}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Người kiểm tra:</span>
                                      <span className="text-sm md:text-base font-medium text-green-800 dark:text-green-300 truncate">
                                        {inspection.data?.Inspector?.Name || ''}
                                      </span>
                                    </div>
                                  </div>
                                </CardHeader>

                                <CardContent className="p-4 pt-0">
                                  <div className="space-y-4">
                                    {/* Kết quả kiểm tra */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                      <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 mb-1">Mô tả chi tiết</p>
                                      <p className="text-sm md:text-base font-medium text-blue-800 dark:text-blue-300">
                                        {inspection.data?.ResultContent || 'Chưa có mô tả chi tiết'}
                                      </p>
                                    </div>

                                    {/* Chỉ số kiểm tra */}
                                    <div className="space-y-3">
                                      <h5 className="text-sm font-semibold text-green-800 dark:text-green-300">Chỉ số kiểm tra</h5>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                                        {/* Kim loại nặng */}
                                        <div className="space-y-2">
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-green-100 dark:border-green-800">
                                            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Asen (mg/kg)</p>
                                            <p className="text-sm md:text-base font-medium text-green-800 dark:text-green-300">
                                              {inspection.data?.Arsen || 0}
                                            </p>
                                          </div>
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-green-100 dark:border-green-800">
                                            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Chì (mg/kg)</p>
                                            <p className="text-sm md:text-base font-medium text-green-800 dark:text-green-300">
                                              {inspection.data?.Plumbum || 0}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Vi sinh vật */}
                                        <div className="space-y-2">
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-green-100 dark:border-green-800">
                                            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Salmonella (CFU/g)</p>
                                            <p className="text-sm md:text-base font-medium text-green-800 dark:text-green-300">
                                              {inspection.data?.Salmonella || 0}
                                            </p>
                                          </div>
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-green-100 dark:border-green-800">
                                            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Coliforms (CFU/g)</p>
                                            <p className="text-sm md:text-base font-medium text-green-800 dark:text-green-300">
                                              {inspection.data?.Coliforms || 0}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Dư lượng thuốc */}
                                        <div className="space-y-2">
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-green-100 dark:border-green-800">
                                            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Glyphosate (mg/kg)</p>
                                            <p className="text-sm md:text-base font-medium text-green-800 dark:text-green-300">
                                              {inspection.data?.Glyphosate_Glufosinate || 0}
                                            </p>
                                          </div>
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-green-100 dark:border-green-800">
                                            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Dithiocarbamate (mg/kg)</p>
                                            <p className="text-sm md:text-base font-medium text-green-800 dark:text-green-300">
                                              {inspection.data?.Dithiocarbamate || 0}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Chất khác */}
                                        <div className="space-y-2">
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-green-100 dark:border-green-800">
                                            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Nitrat (mg/kg)</p>
                                            <p className="text-sm md:text-base font-medium text-green-800 dark:text-green-300">
                                              {inspection.data?.Nitrat || 0}
                                            </p>
                                          </div>
                                          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-green-100 dark:border-green-800">
                                            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Chlorate (mg/kg)</p>
                                            <p className="text-sm md:text-base font-medium text-green-800 dark:text-green-300">
                                              {inspection.data?.Chlorate || 0}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Particles className="-z-10 fixed inset-0" />
    </>
  );
}
