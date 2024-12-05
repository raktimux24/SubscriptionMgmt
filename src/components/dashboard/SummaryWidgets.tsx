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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {widgets.map((widget, index) => (
        <div 
          key={index} 
          className="bg-[#1A1A1A] rounded-lg p-4 sm:p-6 border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[#C0C0C0] text-sm truncate">{widget.title}</p>
              <p className="mt-2 text-xl sm:text-2xl font-semibold text-[#EAEAEA] truncate">{widget.value}</p>
            </div>
            <div className="flex-shrink-0 bg-[#2A2A2A] p-2 sm:p-3 rounded-lg ml-4">
              <widget.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#00A6B2]" />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-sm ${
              widget.trend === 'up' ? 'text-red-400' :
              widget.trend === 'down' ? 'text-green-400' :
              'text-[#C0C0C0]'
            }`}>
              {widget.trend === 'up' ? '↑ ' : widget.trend === 'down' ? '↓ ' : ''}{widget.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}