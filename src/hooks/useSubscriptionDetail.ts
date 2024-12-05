import { useState, useEffect } from 'react';
import { Subscription } from '../lib/firebase/subscriptions';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

export function useSubscriptionDetail(subscriptionId: string) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    
    const unsubscribe = onSnapshot(
      subscriptionRef,
      (doc) => {
        if (doc.exists()) {
          setSubscription({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          } as Subscription);
        } else {
          setError('Subscription not found');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching subscription:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [subscriptionId]);

  return { subscription, loading, error };
}