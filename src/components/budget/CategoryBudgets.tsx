import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useBudgets } from '../../hooks/useBudgets';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import { getBudgetAmount } from '../../utils/budgetCalculations';
import { Loader } from 'lucide-react';
import { EditBudgetModal } from './EditBudgetModal';

export function CategoryBudgets() {
  const { categories, loading: categoriesLoading } = useCategories();
  const { budgets, loading: budgetsLoading } = useBudgets();
  const { subscriptions, loading: subscriptionsLoading } = useSubscriptions();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (categoriesLoading || budgetsLoading || subscriptionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 text-[#00A6B2] animate-spin" />
      </div>
    );
  }

  const getCategorySpend = (category: string): number => {
    const categorySubscriptions = subscriptions
      .filter(sub => sub.status === 'active' && sub.category === category);

    return categorySubscriptions.reduce((sum, sub) => {
      const amount = Number(sub.amount) || 0;
      const monthlyAmount = sub.billingCycle === 'yearly' 
        ? amount / 12 
        : sub.billingCycle === 'quarterly'
        ? amount / 3
        : amount;
      return sum + monthlyAmount;
    }, 0);
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2A2A2A]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-[#EAEAEA]">Category Budgets</h2>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="text-[#00A6B2] hover:text-[#008A94] transition-colors"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const spent = getCategorySpend(category.name);
          const budget = getBudgetAmount(category, budgets);
          const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;

          return (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#EAEAEA] font-medium">{category.name}</p>
                  <p className="text-sm text-[#C0C0C0]">
                    ${spent.toFixed(2)} of ${budget.toFixed(2)}
                  </p>
                </div>
                <span className={`text-sm ${
                  percentageUsed > 90 ? 'text-red-400' :
                  percentageUsed > 75 ? 'text-[#C5A900]' :
                  'text-[#00A6B2]'
                }`}>
                  {percentageUsed.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(percentageUsed, 100)}%`,
                    backgroundColor: category.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <EditBudgetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}