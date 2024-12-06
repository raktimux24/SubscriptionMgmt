import React from 'react';
import { DollarSign, Calendar, Box } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import {
  calculateTotalMonthlySpend,
  calculateUpcomingPayments,
  calculateSpendingTrend
} from '../../utils/subscriptionCalculations';

export function SummaryWidgets() {
  const { state } = useSubscription();
  const totalMonthlySpend = calculateTotalMonthlySpend(state.subscriptions);
  const upcomingPayments = calculateUpcomingPayments(state.subscriptions);
  const activeSubscriptions = state.subscriptions.filter(sub => sub.status === 'active').length;
  const spendingTrend = calculateSpendingTrend(state.subscriptions);

  const widgets = [
    {
      title: 'Monthly Subscription Total',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(totalMonthlySpend),
      change: 'Total monthly spend',
      icon: DollarSign,
      trend: 'neutral'
    },
    {
      title: 'Upcoming Due Dates',
      value: upcomingPayments.toString(),
      change: 'Next 7 days',
      icon: Calendar,
      trend: upcomingPayments > 0 ? 'up' : 'neutral'
    },
    {
      title: 'Active Subscriptions',
      value: activeSubscriptions.toString(),
      change: 'Currently active',
      icon: Box,
      trend: 'neutral'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {widgets.map((widget, index) => (
        <div 
          key={index} 
          className="bg-[#1A1A1A] rounded-lg p-4 sm:p-5 md:p-6 border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2 sm:space-y-3">
              <p className="text-sm text-[#888888]">{widget.title}</p>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#EAEAEA]">
                {widget.value}
              </p>
              <p className="text-xs sm:text-sm text-[#666666]">{widget.change}</p>
            </div>
            <div className={`p-2 sm:p-3 rounded-lg bg-[#2A2A2A] text-[#EAEAEA]`}>
              <widget.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}