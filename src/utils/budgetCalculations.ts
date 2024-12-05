import type { Category } from '../lib/firebase/categories';
import type { Budget } from '../lib/firebase/budgets';

export function calculateTotalBudget(categories: Category[], budgets: Budget[]): number {
  return categories.reduce((total, category) => {
    const budget = getBudgetAmount(category, budgets);
    return total + Number(budget);
  }, 0);
}

export function getBudgetAmount(category: Category, budgets: Budget[]): number {
  const categoryBudget = budgets.find(b => b.categoryId === category.id);
  return categoryBudget ? Number(categoryBudget.amount || 0) : Number(category.budget || 0);
}