'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Connex } from '@vechain/connex';
import { Calendar, Leaf, Package, User } from 'lucide-react';
import { use, useEffect, useState } from 'react';

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
    d: string;
    f: { id: string; n: string };
    ft: Array<{ id: string; n: string; q: number; u: string }>;
    p: Array<{ id: string; n: string; q: number; u: string }>;
    i: Array<{ id: string; n: string; q: number; u: string }>;
    t: number;
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
  const [_loading, setLoading] = useState(true);
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
            ? new Date(Number(task[2]) * 1000).toLocaleDateString()
            : '',
          status: task?.[3] || '',
          data: task?.[4] ? JSON.parse(task[4]) : {},
        })) || [],
        inspectionList: result.decoded.inspectionList?.map((inspection: any) => ({
          inspectionId: inspection?.[0]?.toString() || '',
          timestamp: inspection?.[1]
            ? new Date(Number(inspection[1]) * 1000).toLocaleDateString()
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
    return <div className="container mx-auto px-4 py-8">Invalid QR code</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-green-100 text-green-600';
      case 'Đang thực hiện':
        return 'bg-blue-100 text-blue-600';
      case 'Chờ xử lý':
        return 'bg-yellow-100 text-yellow-600';
      case 'Đã hủy':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (_loading) {
    return <div className="container mx-auto px-4 py-8">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  }

  if (!plans.planData) {
    return <div className="container mx-auto px-4 py-8">Không tìm thấy dữ liệu kế hoạch</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="secondary" className={getStatusColor(plans.planData.status)}>
                  {plans.planData.status}
                </Badge>
                <CardTitle className="mt-2 text-2xl">{plans.planData.planName}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tiến độ</span>
                <span>
                  {plans.planData.estimatedProduct}
                  {' '}
                  {plans.planData.estimatedUnit}
                </span>
              </div>
              <Progress value={Number(plans.planData.estimatedProduct) || 0} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Leaf className="h-4 w-4" />
                <span>{plans.planData.plantId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>{plans.planData.yieldId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{plans.planData.expertId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {plans.planData.startDate}
                  {' '}
                  -
                  {' '}
                  {plans.planData.endDate}
                </span>
              </div>
            </div>

            {plans.taskList && plans.taskList.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Danh sách công việc</h4>
                <div className="space-y-4">
                  {plans.taskList.map(task => (
                    <Card key={task.taskId}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{task.taskType}</CardTitle>
                          <Badge variant="secondary" className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">{task.data?.d || ''}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Người thực hiện</p>
                            <p className="font-medium">{task.data?.f?.n || ''}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Thời gian</p>
                            <p className="font-medium">{task.timestamp}</p>
                          </div>
                        </div>
                        {task.data?.ft?.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Phân bón</p>
                            <div className="space-y-2">
                              {task.data.ft.map(ft => (
                                <div key={ft.id} className="flex justify-between text-sm">
                                  <span>{ft.n}</span>
                                  <span>
                                    {ft.q}
                                    {' '}
                                    {ft.u}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {plans.inspectionList && plans.inspectionList.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Danh sách kiểm tra</h4>
                <div className="space-y-4">
                  {plans.inspectionList.map(inspection => (
                    <Card key={inspection.inspectionId}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{inspection.inspectionType}</CardTitle>
                          <span className="text-sm text-gray-600">{inspection.timestamp}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Người kiểm tra</p>
                            <p className="font-medium">{inspection.data?.Inspector?.Name || ''}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Kết quả</p>
                            <p className="font-medium">{inspection.data?.ResultContent || ''}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Chỉ số kiểm tra</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Asen (mg/kg)</p>
                              <p className="font-medium">{inspection.data?.Arsen || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Chì (mg/kg)</p>
                              <p className="font-medium">{inspection.data?.Plumbum || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Cadmi (mg/kg)</p>
                              <p className="font-medium">{inspection.data?.Cadmi || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Thủy ngân (mg/kg)</p>
                              <p className="font-medium">{inspection.data?.Hydrargyrum || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Salmonella (CFU/g)</p>
                              <p className="font-medium">{inspection.data?.Salmonella || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Coliforms (CFU/g)</p>
                              <p className="font-medium">{inspection.data?.Coliforms || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">E.coli (CFU/g)</p>
                              <p className="font-medium">{inspection.data?.Ecoli || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Glyphosate (mg/kg)</p>
                              <p className="font-medium">{inspection.data?.Glyphosate_Glufosinate || 0}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
