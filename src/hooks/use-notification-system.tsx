import { ablyClient } from '@/lib/ablyClient';
import { useGetIdentity } from '@refinedev/core';
import { Bell } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

type NotificationMessage = {
  id: number;
  expert_id: number;
  data: {
    Title: string;
    Body: string;
  };
  is_read: boolean;
  created_date: string;
};

type IIdentity = {
  id: number;
  name: string;
  avatar?: string;
};

export const useNotificationSystem = () => {
  const { data: user } = useGetIdentity<IIdentity>();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const channel = ablyClient.channels.get(`retailer-${user.id}`);

    const handleNotification = (message: { data: NotificationMessage }) => {
      const notification = message.data;

      toast(
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-emerald-500" />
          <div className="flex-1">
            <p className="text-sm font-medium">
              {notification?.data?.Title || 'Thông báo'}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              {notification?.data?.Body || 'Bạn có thông báo mới'}
            </p>
          </div>
        </div>,
        {
          toastId: `ably-${notification.id}`,
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        },
      );
    };

    channel.subscribe('Notification', handleNotification);

    return () => {
      channel.unsubscribe('Notification', handleNotification);
    };
  }, [user?.id]);
};
