import React from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Loader } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useBudgets } from '../../hooks/useBudgets';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import { calculateTotalBudget } from '../../utils/budgetCalculations';

export function BudgetOverview() {
  const { categories, loading: categoriesLoading } = useCategories();
  const { budgets, loading: budgetsLoading } = useBudgets();
  const { subscriptions, loading: subscriptionsLoading } = useSubscriptions();
  const monthlyBudget = calculateTotalBudget(categories, budgets);

  if (categoriesLoading || budgetsLoading || subscriptionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 text-[#00A6B2] animate-spin" />
      </div>
    );
  }

  // Calculate total monthly spend from active subscriptions
  const calculateMonthlySpend = () => {
    return subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((total, sub) => {
        const amount = Number(sub.amount) || 0;
        return total + (
          sub.billingCycle === 'yearly' ? amount / 12 :
          sub.billingCycle === 'quarterly' ? amount / 3 :
          amount
        );
      }, 0);
  };

  const currentSpend = calculateMonthlySpend();
  const percentageUsed = monthlyBudget > 0 ? (currentSpend / monthlyBudget) * 100 : 0;
  const remaining = Math.max(monthlyBudget - currentSpend, 0);
  
  if (categoriesLoading || budgetsLoading || subscriptionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 text-[#00A6B2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2A2A2A]">
      <h2 className="text-lg font-semibold text-[#EAEAEA] mb-6">Monthly Budget Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-[#2A2A2A]">
            <DollarSign className="h-6 w-6 text-[#00A6B2]" />
          </div>
          <div>
            <p className="text-[#C0C0C0]">Total Budget</p>
            <p className="text-2xl font-semibold text-[#EAEAEA]">${monthlyBudget.toFixed(2)}</p>
            <p className="text-sm text-[#C0C0C0]">Monthly limit</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-[#2A2A2A]">
            <TrendingUp className="h-6 w-6 text-[#C5A900]" />
          </div>
          <div>
            <p className="text-[#C0C0C0]">Current Spend</p>
            <p className="text-2xl font-semibold text-[#EAEAEA]">${currentSpend.toFixed(2)}</p>
            <p className="text-sm text-[#C0C0C0]">This month</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-[#2A2A2A]">
            <AlertTriangle className="h-6 w-6 text-[#6A4C93]" />
          </div>
          <div>
            <p className="text-[#C0C0C0]">Budget Used</p>
            <p className="text-2xl font-semibold text-[#EAEAEA]">{percentageUsed.toFixed(1)}%</p>
            <p className="text-sm text-[#C0C0C0]">${remaining.toFixed(2)} remaining</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-sm text-[#C0C0C0] mb-2">
          <span>Progress</span>
          <span>${currentSpend.toFixed(2)} of ${monthlyBudget.toFixed(2)}</span>
        </div>
        <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              percentageUsed > 90 ? 'bg-red-500' :
              percentageUsed > 75 ? 'bg-[#C5A900]' :
              'bg-[#00A6B2]'
            }`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          />
        </div>
      </div>

      {percentageUsed >= 90 && (
        <div className="mt-4 p-3 bg-red-400/10 rounded-lg">
          <p className="text-red-400 text-sm">
            Warning: You're {percentageUsed >= 100 ? 'over' : 'close to'} your monthly budget limit
          </p>
        </div>
      )}
    </div>
  );
}