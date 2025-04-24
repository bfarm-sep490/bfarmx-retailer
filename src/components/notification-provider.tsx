'use client';

import { useNotificationSystem } from '@/hooks/use-notification-system';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  useNotificationSystem();

  return <>{children}</>;
}
