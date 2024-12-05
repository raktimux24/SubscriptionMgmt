import { useState } from 'react';

export function useQuickActions() {
  const [isRenewalsOpen, setIsRenewalsOpen] = useState(false);
  const [isReviewScheduleOpen, setIsReviewScheduleOpen] = useState(false);

  return {
    isRenewalsOpen,
    isReviewScheduleOpen,
    openRenewals: () => setIsRenewalsOpen(true),
    closeRenewals: () => setIsRenewalsOpen(false),
    openReviewSchedule: () => setIsReviewScheduleOpen(true),
    closeReviewSchedule: () => setIsReviewScheduleOpen(false),
  };
}