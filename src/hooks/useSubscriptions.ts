import { useState, useEffect } from 'react';
import { 
  Subscription,
  subscribeToSubscriptions,
  addSubscription as addSubscriptionToDb,
  updateSubscription as updateSubscriptionToDb,
  deleteSubscription as deleteSubscriptionFromDb
} from '../lib/firebase/subscriptions';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { generatePaymentHistory, deletePaymentsForSubscription } from '../lib/firebase/payments';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const unsubscribe = subscribeToSubscriptions((newSubscriptions) => {
      setSubscriptions(newSubscriptions);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const addSubscription = async (data: Omit<Subscription, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const { subscription, error } = await addSubscriptionToDb(data);
      if (error) throw new Error(error);
      
      if (subscription) {
        // Generate payment history after subscription is created
        const { error: paymentError } = await generatePaymentHistory(subscription);
        if (paymentError) throw new Error(paymentError);
      }
      
      toast.success('Subscription added successfully');
      return { subscription, error: null };
    } catch (error) {
      toast.error(error.message);
      return { subscription: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    setLoading(true);
    try {
      const { subscription, error } = await updateSubscriptionToDb(id, updates);
      if (error) throw new Error(error);
      
      // If start date or billing cycle changes, regenerate payment history
      if (updates.startDate || updates.billingCycle) {
        if (subscription) {
          const { error: paymentError } = await generatePaymentHistory(subscription);
          if (paymentError) throw new Error(paymentError);
        }
      }
      
      toast.success('Subscription updated successfully');
      return { subscription, error: null };
    } catch (error) {
      toast.error(error.message);
      return { subscription: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscription = async (id: string) => {
    setLoading(true);
    try {
      // First delete all associated payments
      const { error: paymentError } = await deletePaymentsForSubscription(id);
      if (paymentError) throw new Error(paymentError);
      
      // Then delete the subscription
      const { success, error } = await deleteSubscriptionFromDb(id);
      if (error) throw new Error(error);
      
      toast.success('Subscription deleted successfully');
      return { error: null };
    } catch (error) {
      toast.error(error.message);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    subscriptions,
    loading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription
  };
}