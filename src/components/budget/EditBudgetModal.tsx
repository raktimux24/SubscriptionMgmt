import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Loader } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useBudgets } from '../../hooks/useBudgets';
import { createOrUpdateBudget } from '../../lib/firebase/budgets';
import toast from 'react-hot-toast';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditBudgetModal({ isOpen, onClose }: EditBudgetModalProps) {
  const { categories, loading: categoriesLoading, updateCategory } = useCategories();
  const { budgets } = useBudgets();
  const [loading, setLoading] = React.useState(false);
  const [categoryBudgets, setCategoryBudgets] = React.useState<Array<{
    id: string;
    name: string;
    budget: number;
  }>>([]);

  React.useEffect(() => {
    if (categories.length > 0) {
      setCategoryBudgets(
        categories.map(cat => {
          const existingBudget = budgets.find(b => b.categoryId === cat.id);
          return {
            id: cat.id,
            name: cat.name,
            budget: existingBudget ? existingBudget.amount : (cat.budget || 0)
          };
        })
      );
    }
  }, [categories, budgets]);

  const handleBudgetChange = (categoryId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCategoryBudgets(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, budget: numValue } : cat
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);
    let hasError = false;
    let successCount = 0;

    for (const budget of categoryBudgets) {
      try {
        console.log(`Updating budget for ${budget.name} to $${budget.budget}`);
        
        // Update both budget and category
        const { error: budgetError } = await createOrUpdateBudget(budget.id, budget.budget);
        if (budgetError) {
          console.error(`Failed to update budget: ${budgetError}`);
          hasError = true;
          toast.error(`Failed to update budget for ${budget.name}`);
          break;
        }

        // Update category budget as well
        const { error: categoryError } = await updateCategory(budget.id, { budget: budget.budget });
        if (categoryError) {
          console.error(`Failed to update category: ${categoryError}`);
          hasError = true;
          toast.error(`Failed to update category for ${budget.name}`);
          break;
        }

        console.log(`Successfully updated budget for ${budget.name}`);
        successCount++;
      } catch (error: any) {
        console.error(`Error updating ${budget.name}:`, error);
        hasError = true;
        toast.error(`Error updating ${budget.name}: ${error?.message || 'Unknown error'}`);
        break;
      }
    }

    setLoading(false);
    
    if (!hasError) {
      toast.success(`Successfully updated ${successCount} budget${successCount !== 1 ? 's' : ''}`);
      onClose();
    }
  };

  if (categoriesLoading) {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <div className="relative bg-[#1A1A1A] rounded-lg w-full max-w-md p-6 flex items-center justify-center">
            <Loader className="h-8 w-8 text-[#00A6B2] animate-spin" />
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <div className="relative bg-[#1A1A1A] rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold text-[#EAEAEA]">
              Edit Category Budgets
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-[#C0C0C0] hover:text-[#EAEAEA] transition-colors"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {categoryBudgets.map((category) => (
              <div key={category.id} className="space-y-2">
                <label className="block text-sm font-medium text-[#EAEAEA]">
                  {category.name}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]">
                    $
                  </span>
                  <input
                    type="number"
                    value={category.budget}
                    onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] placeholder-[#6B7280] focus:outline-none focus:border-[#00A6B2]"
                    min="0"
                    step="1"
                    disabled={loading}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-[#2A2A2A] rounded-lg text-[#C0C0C0] hover:bg-[#2A2A2A] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-[#00A6B2] text-white rounded-lg hover:bg-[#008A94] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}