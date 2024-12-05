import { useState, useEffect } from 'react';
import { Payment, subscribeToPaymentHistory, addPayment as addPaymentToDb } from '../lib/firebase/payments';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export function usePaymentHistory(subscriptionId: string) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || !subscriptionId) return;
    
    setLoading(true);
    let unsubscribe: (() => void) | undefined;
    
    try {
      unsubscribe = subscribeToPaymentHistory(subscriptionId, (newPayments) => {
        // Sort payments by date in descending order
        const sortedPayments = [...newPayments].sort((a, b) => 
          b.date.getTime() - a.date.getTime()
        );
        setPayments(sortedPayments);
        setLoading(false);
        setError(null);
      });
    } catch (err) {
      console.error('Error subscribing to payment history:', err);
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, subscriptionId]);

  const addPayment = async (data: Omit<Payment, 'id' | 'userId' | 'createdAt'>) => {
    setLoading(true);
    try {
      const { payment, error } = await addPaymentToDb(data);
      if (error) throw new Error(error);
      return { payment, error: null };
    } catch (error) {
      toast.error(error.message);
      return { payment: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    error,
    addPayment
  };
}