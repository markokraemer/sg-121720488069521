import React, { useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export const Notifications = () => {
  const { state, dispatch } = useGlobalContext();
  const { toast } = useToast();

  useEffect(() => {
    state.notifications.forEach((notification) => {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type,
      });

      // Remove the notification after it's shown
      dispatch({
        type: 'REMOVE_NOTIFICATION',
        payload: notification.id,
      });
    });
  }, [state.notifications, dispatch, toast]);

  return null; // This component doesn't render anything itself
};