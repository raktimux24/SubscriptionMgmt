import React from 'react';
import { CheckCircle2, Loader } from 'lucide-react';
import type { Subscription } from '../../../lib/firebase/subscriptions';
import { usePaymentHistory } from '../../../hooks/usePaymentHistory';

interface PaymentHistoryProps {
  subscription: Subscription;
}

export function PaymentHistory({ subscription }: PaymentHistoryProps) {
  const { payments, loading } = usePaymentHistory(subscription.id);

  const getStatusColor = (status: string) => {
    if (!status) return 'text-[#C0C0C0]';
    
    switch (status) {
      case 'paid':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-[#C0C0C0]';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    if (!date) return 'N/A';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2A2A2A]">
        <h2 className="text-lg font-semibold text-[#EAEAEA] mb-6">Payment History</h2>
        <div className="flex items-center justify-center py-8">
          <Loader className="h-8 w-8 text-[#00A6B2] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2A2A2A]">
      <h2 className="text-lg font-semibold text-[#EAEAEA] mb-6">Payment History</h2>
      
      <div className="space-y-4">
        {payments.map((payment) => (
          <div 
            key={`${payment.id}-${payment.date.getTime()}`}
            className="flex items-center justify-between py-3 border-b border-[#2A2A2A] last:border-0"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle2 className={`h-5 w-5 ${getStatusColor(payment.status)}`} />
              <div>
                <p className="text-[#EAEAEA]">
                  {payment.date ? formatDate(payment.date) : 'N/A'}
                </p>
                <p className={`text-sm capitalize ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </p>
              </div>
            </div>
            <p className="text-[#EAEAEA] font-medium">
              {payment.amount ? formatCurrency(payment.amount) : 'N/A'}
            </p>
          </div>
        ))}
        
        {payments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[#C0C0C0]">No payment history available</p>
          </div>
        )}
      </div>
    </div>
  );
}