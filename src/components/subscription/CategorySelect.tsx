import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { useCategories } from '../../hooks/useCategories';
import { Loader } from 'lucide-react';

interface CategorySelectProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

export function CategorySelect({ register, error }: CategorySelectProps) {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div>
        <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
          Category
        </label>
        <div className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] flex items-center justify-center">
          <Loader className="h-4 w-4 text-[#00A6B2] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
        Category
      </label>
      <select
        {...register('category', { required: 'Please select a category' })}
        className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error.message || 'Please select a category'}
        </p>
      )}
      {categories.length === 0 && (
        <p className="mt-1 text-sm text-[#C0C0C0]">
          No categories available. Please add a category first.
        </p>
      )}
    </div>
  );
}