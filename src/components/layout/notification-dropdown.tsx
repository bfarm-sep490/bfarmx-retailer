'use client';

import type { IIdentity } from '@/types';
import {
  useApiUrl,
  useCustomMutation,
  useGetIdentity,
  useInvalidate,
  useList,
  useUpdate,
} from '@refinedev/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCircle2, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

type Notification = {
  id: number;
  expert_id: number;
  message: string;
  title: string;
  image: string | null;
  is_read: boolean;
  created_date: string;
};

const menuVariants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  closed: {
    scale: 0,
    opacity: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.05,
    },
  },
};

type NotificationDropdownProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type NotificationItemProps = {
  item: Notification;
  onMarkAsRead: (id: number) => void;
};

const NotificationItem = ({ item, onMarkAsRead }: NotificationItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (messageRef.current) {
      setIsOverflowing(
        messageRef.current.scrollHeight > messageRef.current.clientHeight,
      );
    }
  }, [item.message]);

  return (
    <button
      type="button"
      className={`w-full text-left flex items-start gap-3 p-4 rounded-lg transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 ${
        !item.is_read ? 'bg-emerald-50 dark:bg-emerald-950/50 cursor-pointer' : 'cursor-default'
      }`}
      onClick={() => !item.is_read && onMarkAsRead(item.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          !item.is_read && onMarkAsRead(item.id);
        }
      }}
    >
      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
        <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100 truncate">
          {item.title}
        </p>
        <div className="relative">
          <p
            ref={messageRef}
            className={`text-xs text-emerald-600 dark:text-emerald-400 transition-all duration-200 ${
              isExpanded ? '' : 'line-clamp-2'
            }`}
          >
            {item.message}
          </p>
          {isOverflowing && (
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }
              }}
              className="text-xs text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 mt-1 cursor-pointer"
            >
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {item.is_read
            ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              )
            : (
                <Clock className="w-3 h-3 text-yellow-500" />
              )}
          <span className="text-xs text-emerald-600 dark:text-emerald-400">
            {dayjs(item.created_date).fromNow()}
          </span>
        </div>
      </div>
    </button>
  );
};

export const NotificationDropdown = ({ open, setOpen }: NotificationDropdownProps) => {
  const { data: user } = useGetIdentity<IIdentity>();
  const [activeTab, setActiveTab] = useState('unread');
  const [showAll, setShowAll] = useState(false);
  const apiUrl = useApiUrl();
  const invalidate = useInvalidate();

  useEffect(() => {
    if (!open) {
      setShowAll(false);
    }
  }, [open]);

  const { data: notificationsData, isLoading } = useList<Notification>({
    resource: `retailers/${user?.id}/notifications`,
    queryOptions: {
      enabled: !!user?.id,
      refetchInterval: 30000,
    },
  });

  const { mutate: markAsRead } = useUpdate();
  const { mutate: markAllAsRead } = useCustomMutation();

  const notifications = notificationsData?.data || [];
  const unreadNotifications = notifications.filter(n => !n.is_read);
  const displayedNotifications = showAll
    ? (activeTab === 'all' ? notifications : unreadNotifications)
    : (activeTab === 'all' ? notifications.slice(0, 4) : unreadNotifications.slice(0, 4));

  const handleMarkAsRead = (notificationId: number) => {
    markAsRead(
      {
        resource: 'retailers/notification-read',
        id: notificationId,
        values: {},
        successNotification: false,
      },
      {
        onSuccess: () => {
          invalidate({
            resource: `retailers/${user?.id}/notifications`,
            invalidates: ['list'],
          });
        },
      },
    );
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(
      {
        url: `${apiUrl}/retailers/${user?.id}/notifications-read`,
        method: 'put',
        values: {},
        successNotification: false,
      },
      {
        onSuccess: () => {
          invalidate({
            resource: `retailers/${user?.id}/notifications`,
            invalidates: ['list'],
          });
          setActiveTab('read');
        },
      },
    );
  };

  const content = (
    <motion.div
      variants={menuVariants}
      initial="closed"
      animate="open"
      exit="closed"
      style={{ transformOrigin: 'bottom', x: '-50%' }}
      className="p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-lg absolute bottom-[125%] left-[50%] flex flex-col w-[calc(100vw_-_48px)] max-w-md border border-emerald-100 dark:border-emerald-900"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-100 dark:border-emerald-800">
        <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
          Thông báo
        </h4>
        {unreadNotifications.length > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => {
            setActiveTab('all');
            setShowAll(false);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100'
              : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
          }`}
        >
          Tất cả
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('unread');
            setShowAll(false);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'unread'
              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100'
              : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
          }`}
        >
          Chưa đọc
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200 dark:scrollbar-thumb-emerald-800 scrollbar-track-transparent hover:scrollbar-thumb-emerald-300 dark:hover:scrollbar-thumb-emerald-700">
        {isLoading
          ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3 p-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-emerald-100 dark:bg-emerald-900 rounded animate-pulse" />
                      <div className="h-3 w-full bg-emerald-100 dark:bg-emerald-900 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )
          : (
              <div className="space-y-2">
                {displayedNotifications.length > 0
                  ? (
                      <>
                        {displayedNotifications.map(item => (
                          <NotificationItem key={item.id} item={item} onMarkAsRead={handleMarkAsRead} />
                        ))}
                        {!showAll && (activeTab === 'all' ? notifications.length > 4 : unreadNotifications.length > 4) && (
                          <button
                            type="button"
                            onClick={() => setShowAll(true)}
                            className="w-full text-center py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                          >
                            Xem thêm
                            {' '}
                            {activeTab === 'all' ? notifications.length - 4 : unreadNotifications.length - 4}
                            {' '}
                            thông báo
                          </button>
                        )}
                      </>
                    )
                  : (
                      <div className="flex flex-col items-center justify-center py-8 text-emerald-600 dark:text-emerald-400">
                        <Bell className="w-8 h-8 mb-2" />
                        <p className="text-sm">
                          {activeTab === 'all' ? 'Không có thông báo' : 'Không có thông báo chưa đọc'}
                        </p>
                      </div>
                    )}
              </div>
            )}
      </div>
    </motion.div>
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm cursor-pointer w-20 sm:w-24 hover:primary transition-all duration-200 flex flex-col gap-1.5 items-center relative group"
      >
        <div className="relative">
          <Bell className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200 group-hover:scale-110" />
          {unreadNotifications.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-md rounded-full w-6 h-6 flex items-center justify-center">
              {unreadNotifications.length}
            </div>
          )}
        </div>
        <span className="text-xs sm:text-sm font-medium">Noti</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{ transformOrigin: 'bottom' }}
            className="absolute bottom-[70px] sm:bottom-[83px] left-[50%] translate-x-[-153px] sm:translate-x-[-205px]"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
