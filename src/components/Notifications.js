import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Notifications = () => {
  const { state, dispatch } = useGlobalContext();
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = state.notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [state.notifications]);

  useEffect(() => {
    state.notifications.forEach((notification) => {
      if (!notification.shown) {
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type,
        });

        // Mark the notification as shown
        dispatch({
          type: 'UPDATE_NOTIFICATION',
          payload: { ...notification, shown: true }
        });
      }
    });
  }, [state.notifications, dispatch, toast]);

  const handleNotificationClick = (notification) => {
    // Mark the notification as read
    dispatch({
      type: 'UPDATE_NOTIFICATION',
      payload: { ...notification, read: true }
    });

    // Handle any specific actions based on the notification type
    // For example, navigate to a specific page
  };

  const handleClearAll = () => {
    dispatch({
      type: 'CLEAR_ALL_NOTIFICATIONS'
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex justify-between items-center p-2">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={handleClearAll}>Clear All</Button>
        </div>
        <AnimatePresence>
          {state.notifications.length > 0 ? (
            state.notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenuItem
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex flex-col items-start p-2 ${notification.read ? 'opacity-50' : ''}`}
                >
                  <div className="font-semibold">{notification.title}</div>
                  <div className="text-sm">{notification.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </DropdownMenuItem>
              </motion.div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">No notifications</div>
          )}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};