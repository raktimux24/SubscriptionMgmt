import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import {
  addSubscription,
  updateSubscription as updateSubscriptionInDb,
  deleteSubscription as deleteSubscriptionInDb,
  subscribeToUserSubscriptions,
  Subscription
} from '../lib/firebase/subscriptions';
import { incrementSubscriptionCount, decrementSubscriptionCount } from '../lib/firebase/users';
import { toast } from 'react-hot-toast';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToUserSubscriptions(user.uid, {
      next: (subs) => {
        setSubscriptions(subs);
        setLoading(false);
      },
      error: (error) => {
        console.error('Error fetching subscriptions:', error);
        toast.error('Failed to fetch subscriptions');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const addNewSubscription = useCallback(async (data: Omit<Subscription, 'id' | 'userId'>) => {
    if (!user?.uid) return { error: 'User not authenticated' };

    try {
      const result = await addSubscription(user.uid, data);
      if (result.error) {
        toast.error(result.error);
        return result;
      }
      
      toast.success('Subscription added successfully');
      return { error: null };
    } catch (error) {
      toast.error('Failed to add subscription');
      return { error: error.message };
    }
  }, [user?.uid]);

  const updateSubscription = useCallback(async (id: string, updates: Partial<Subscription>) => {
    if (!user?.uid) return { error: 'User not authenticated' };

    try {
      const result = await updateSubscriptionInDb(id, updates);
      if (result.error) {
        toast.error(result.error);
        return result;
      }

      toast.success('Subscription updated successfully');
      return { error: null };
    } catch (error) {
      toast.error('Failed to update subscription');
      return { error: error.message };
    }
  }, [user?.uid]);

  const deleteSubscription = useCallback(async (id: string) => {
    if (!user?.uid) return { error: 'User not authenticated' };

    try {
      const result = await deleteSubscriptionInDb(id);
      if (result.error) {
        toast.error(result.error);
        return result;
      }

      toast.success('Subscription deleted successfully');
      return { error: null };
    } catch (error) {
      toast.error('Failed to delete subscription');
      return { error: error.message };
    }
  }, [user?.uid]);

  return {
    subscriptions,
    loading,
    addSubscription: addNewSubscription,
    updateSubscription,
    deleteSubscription
  };
}