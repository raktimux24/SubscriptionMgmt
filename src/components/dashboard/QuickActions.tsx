import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListFilter, AlertCircle, Calendar } from 'lucide-react';
import { useQuickActions } from '../../hooks/useQuickActions';
import { QuickActionButton } from './quick-actions/QuickActionButton';
import { RenewalsList } from './quick-actions/RenewalsList';
import { ReviewScheduleModal } from './quick-actions/ReviewScheduleModal';

export function QuickActions() {
  const navigate = useNavigate();
  const {
    isRenewalsOpen,
    isReviewScheduleOpen,
    openRenewals,
    closeRenewals,
    openReviewSchedule,
    closeReviewSchedule
  } = useQuickActions();

  const actions = [
    {
      icon: ListFilter,
      label: 'View All Subscriptions',
      description: 'See and manage all your active subscriptions',
      onClick: () => navigate('/subscriptions')
    },
    {
      icon: AlertCircle,
      label: 'Upcoming Renewals',
      description: 'Review subscriptions renewing in next 30 days',
      onClick: openRenewals
    },
    {
      icon: Calendar,
      label: 'Schedule Review',
      description: 'Set up monthly subscription review',
      onClick: openReviewSchedule
    }
  ];

  return (
    <>
      <div className="bg-[#1A1A1A] rounded-lg p-4 sm:p-6 border border-[#2A2A2A]">
        <h3 className="text-lg font-semibold text-[#EAEAEA] mb-4 sm:mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          {actions.map((action, index) => (
            <QuickActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              description={action.description}
              onClick={action.onClick}
            />
          ))}
        </div>
      </div>

      <RenewalsList
        isOpen={isRenewalsOpen}
        onClose={closeRenewals}
      />

      <ReviewScheduleModal
        isOpen={isReviewScheduleOpen}
        onClose={closeReviewSchedule}
      />
    </>
  );
}