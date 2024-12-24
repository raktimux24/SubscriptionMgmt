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
  const activeCount = activeSubscriptions.length;
  const isAtLimit = isFreeUser && activeCount >= 5;
  const canAddMore = !isAtLimit;

  return {
    activeSubscriptions,
    activeCount,
    isFreeUser,
    isAtLimit,
    canAddMore,
    maxSubscriptions: isFreeUser ? 5 : Infinity
  };
}
