import React, { useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <AnimatePresence>
      {state.notifications.map((notification) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Toast
            variant={notification.type}
            title={notification.title}
            description={notification.message}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};