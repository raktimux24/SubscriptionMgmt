import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscriptionLimits } from '../../hooks/useSubscriptionLimits';

interface SubscriptionLimitGuardProps {
  children: React.ReactNode;
}

export function SubscriptionLimitGuard({ children }: SubscriptionLimitGuardProps) {
  const { isAtLimit } = useSubscriptionLimits();

  if (isAtLimit) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
