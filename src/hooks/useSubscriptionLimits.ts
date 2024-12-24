import { useMemo } from 'react';
import { useSubscriptions } from './useSubscriptions';
import { useAuthStore } from '../stores/authStore';

export function useSubscriptionLimits() {
  const { subscriptions } = useSubscriptions();
  const { profile } = useAuthStore();

  const activeSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => sub.status === 'active');
  }, [subscriptions]);

  const isFreeUser = profile?.subscriptionType === 'free';
  const activeCount = profile?.activeSubscriptionCount || 0;
  const isAtLimit = isFreeUser && activeCount >= 5;

  return {
    activeSubscriptions,
    activeCount,
    isFreeUser,
    isAtLimit,
    maxSubscriptions: isFreeUser ? 5 : Infinity
  };
}
