import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useCategories } from '../../hooks/useCategories';
import { useBudgets } from '../../hooks/useBudgets';
import type { Category } from '../../lib/firebase/categories';
import toast from 'react-hot-toast';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

interface CategoryFormData {
  name: string;
  budget: number;
  color: string;
}

const colorOptions = [
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Green', value: '#10B981' },
  { label: 'Yellow', value: '#F59E0B' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Purple', value: '#8B5CF6' },
  { label: 'Pink', value: '#EC4899' },
  { label: 'Indigo', value: '#6366F1' }
];

export function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
  const { updateCategory, loading: categoryLoading } = useCategories();
  const { createOrUpdateBudget, loading: budgetLoading } = useBudgets();
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormData>({
    defaultValues: {
      name: category.name,
      budget: category.budget,
      color: category.color
    }
  });

  const loading = categoryLoading || budgetLoading;

  const onSubmit = async (data: CategoryFormData) => {
    try {
      // Update category first (without budget)
      const { error: categoryError } = await updateCategory(category.id, {
        name: data.name,
        color: data.color
      });
      
      if (categoryError) {
        toast.error(`Failed to update category: ${categoryError}`);
        return;
      }

      // Update budget separately
      const { error: budgetError } = await createOrUpdateBudget(category.id, data.budget);
      if (budgetError) {
        toast.error(`Failed to update budget: ${budgetError}`);
        return;
      }

      toast.success('Category updated successfully');
      onClose();
    } catch (error: any) {
      toast.error(`Error updating category: ${error?.message || 'Unknown error'}`);
    }
  };

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
              Edit Category
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-[#C0C0C0] hover:text-[#EAEAEA] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
                Category Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Category name is required' })}
                className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] placeholder-[#6B7280] focus:outline-none focus:border-[#00A6B2]"
                placeholder="e.g., Entertainment, Software"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
                Monthly Budget
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]">
                  $
                </span>
                <input
                  type="number"
                  {...register('budget', { 
                    required: 'Budget is required',
                    min: { value: 0, message: 'Budget must be positive' }
                  })}
                  className="w-full pl-8 pr-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] placeholder-[#6B7280] focus:outline-none focus:border-[#00A6B2]"
                  placeholder="0.00"
                />
              </div>
              {errors.budget && (
                <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
                Color
              </label>
              <select
                {...register('color', { required: 'Color is required' })}
                className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
              >
                {colorOptions.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
              {errors.color && (
                <p className="mt-1 text-sm text-red-500">{errors.color.message}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#2A2A2A] rounded-lg text-[#C0C0C0] hover:bg-[#2A2A2A] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#00A6B2] text-white rounded-lg hover:bg-[#008A94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}