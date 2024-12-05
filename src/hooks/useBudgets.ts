import { useState, useEffect } from 'react';
import { 
  Budget, 
  subscribeToBudgets, 
  updateBudget as updateBudgetInDb,
  createOrUpdateBudget as createOrUpdateBudgetInDb 
} from '../lib/firebase/budgets';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const initializeBudgets = useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const unsubscribe = subscribeToBudgets((newBudgets) => {
      setBudgets(newBudgets);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const updateBudget = async (budgetId: string, updates: Partial<Budget>) => {
    setLoading(true);
    try {
      const { budget, error } = await updateBudgetInDb(budgetId, updates);
      if (error) throw new Error(error);
      
      toast.success('Budget updated successfully');
      return { budget, error: null };
    } catch (error) {
      toast.error(error.message);
      return { budget: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateBudget = async (categoryId: string, amount: number) => {
    setLoading(true);
    try {
      const result = await createOrUpdateBudgetInDb(categoryId, amount);
      if (result.error) throw new Error(result.error);
      
      return { error: null };
    } catch (error) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    budgets,
    loading,
    error,
    updateBudget,
    createOrUpdateBudget
  };
}