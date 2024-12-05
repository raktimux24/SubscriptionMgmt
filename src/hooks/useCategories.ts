import { useEffect, useState } from 'react';
import { Category, subscribeToCategories, addCategory as addCategoryToDb, updateCategory as updateCategoryInDb, deleteCategory as deleteCategoryInDb } from '../lib/firebase/categories';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const unsubscribe = subscribeToCategories((newCategories) => {
      setCategories(newCategories);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const addCategory = async (data: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const { category, error } = await addCategoryToDb(data);
      if (error) throw new Error(error);      
      toast.success('Category created successfully');
      return { category, error: null };
    } catch (error) {
      toast.error(error.message);
      return { category: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    setLoading(true);
    try {
      const { category: updatedCategory, error } = await updateCategoryInDb(id, updates);
      if (error) throw new Error(error);
      toast.success('Category updated successfully');
      return { error: null };
    } catch (error) {
      toast.error(error.message);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    try {
      const { success, error } = await deleteCategoryInDb(id);
      if (error) throw new Error(error);
      toast.success('Category deleted successfully');
      return { error: null };
    } catch (error) {
      toast.error(error.message);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory
  };
}