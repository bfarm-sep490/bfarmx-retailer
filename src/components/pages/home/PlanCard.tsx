import { Calendar, Clock, Package, TreePine } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PlanCardProps = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
  totalOrders: number;
  maxOrders: number;
};

export const PlanCard = ({ id, title, startDate, endDate, daysLeft, totalOrders, maxOrders }: PlanCardProps) => {
  const progressPercentage = (totalOrders / maxOrders) * 100;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TreePine className="w-6 h-6 text-green-600 dark:text-green-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Thời gian:
              {startDate}
              {' '}
              -
              {endDate}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Còn lại:
              {daysLeft}
              {' '}
              ngày
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="w-4 h-4" />
            <span>
              Đã đặt:
              {totalOrders}
              /
              {maxOrders}
            </span>
          </div>
          <div className="pt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
        <Button className="w-full mt-6 group-hover:bg-green-600" asChild>
          <Link href={`/plans/${id}`}>Đặt Hàng Ngay</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
