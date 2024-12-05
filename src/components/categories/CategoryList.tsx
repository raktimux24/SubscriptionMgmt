import React from 'react';
import { Edit2, Trash2, BarChart2, Loader } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { EditCategoryModal } from './EditCategoryModal';
import { DeleteCategoryModal } from './DeleteCategoryModal';
import type { Category } from '../../lib/firebase/categories';

interface CategoryListProps {
  onAddCategory: () => void;
}

export function CategoryList({ onAddCategory }: CategoryListProps) {
  const { categories, loading } = useCategories();
  const [editCategory, setEditCategory] = React.useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log('Categories updated:', categories);
  }, [categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 text-[#00A6B2] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
        <div className="p-6 border-b border-[#2A2A2A]">
          <h2 className="text-lg font-semibold text-[#EAEAEA]">All Categories</h2>
        </div>

        <div className="divide-y divide-[#2A2A2A]">
          {categories.map((category) => (
            <div key={category.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-[#2A2A2A]">
                  <BarChart2 className="h-5 w-5" style={{ color: category.color }} />
                </div>
                <div>
                  <h3 className="text-[#EAEAEA] font-medium">{category.name}</h3>
                  <p className="text-sm text-[#C0C0C0]">
                    Budget: ${category.budget}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setEditCategory(category)}
                  className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                >
                  <Edit2 className="h-4 w-4 text-[#C0C0C0]" />
                </button>
                <button 
                  onClick={() => setDeleteCategory(category.id)}
                  className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-[#C0C0C0]" />
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-[#C0C0C0]">No categories added yet.</p>
              <button
                onClick={onAddCategory}
                className="mt-4 text-[#00A6B2] hover:text-[#008A94] transition-colors"
              >
                Add your first category
              </button>
            </div>
          )}
        </div>
      </div>

      {editCategory && (
        <EditCategoryModal
          isOpen={!!editCategory}
          onClose={() => setEditCategory(null)}
          category={editCategory}
        />
      )}

      {deleteCategory && (
        <DeleteCategoryModal
          isOpen={!!deleteCategory}
          onClose={() => setDeleteCategory(null)}
          categoryId={deleteCategory}
        />
      )}
    </>
  );
}