import React from 'react';
import { Calendar, CreditCard, Clock, Tag } from 'lucide-react';
import type { Subscription } from '../../../lib/firebase/subscriptions';

interface SubscriptionInfoProps {
  subscription: Subscription;
}

export function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2A2A2A] mb-8">
      <h2 className="text-lg font-semibold text-[#EAEAEA] mb-6">Subscription Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-[#2A2A2A]">
            <CreditCard className="h-5 w-5 text-[#00A6B2]" />
          </div>
          <div>
            <p className="text-[#C0C0C0] text-sm">Billing Amount</p>
            <p className="text-[#EAEAEA] font-medium mt-1">
              {formatCurrency(subscription.amount)} / {subscription.billingCycle}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-[#2A2A2A]">
            <Calendar className="h-5 w-5 text-[#00A6B2]" />
          </div>
          <div>
            <p className="text-[#C0C0C0] text-sm">Start Date</p>
            <p className="text-[#EAEAEA] font-medium mt-1">
              {formatDate(subscription.startDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-[#2A2A2A]">
            <Calendar className="h-5 w-5 text-[#00A6B2]" />
          </div>
          <div>
            <p className="text-[#C0C0C0] text-sm">Next Payment</p>
            <p className="text-[#EAEAEA] font-medium mt-1">
              {formatDate(subscription.nextPayment)}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-[#2A2A2A]">
            <Clock className="h-5 w-5 text-[#00A6B2]" />
          </div>
          <div>
            <p className="text-[#C0C0C0] text-sm">Reminder</p>
            <p className="text-[#EAEAEA] font-medium mt-1">
              {subscription.reminderDays} days before payment
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-[#2A2A2A]">
            <Tag className="h-5 w-5 text-[#00A6B2]" />
          </div>
          <div>
            <p className="text-[#C0C0C0] text-sm">Category</p>
            <p className="text-[#EAEAEA] font-medium mt-1">
              {subscription.category}
            </p>
          </div>
        </div>
      </div>

      {subscription.description && (
        <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
          <h3 className="text-sm font-medium text-[#C0C0C0] mb-2">Description</h3>
          <p className="text-[#EAEAEA]">{subscription.description}</p>
        </div>
      )}
    </div>
  );
}