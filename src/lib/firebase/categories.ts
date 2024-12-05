import { 
  collection, 
  onSnapshot,
  doc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  Unsubscribe,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db, auth } from './config';

export interface Category {
  id: string;
  name: string;
  budget: number;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function subscribeToCategories(callback: (categories: Category[]) => void): Unsubscribe {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('userId', '==', auth.currentUser.uid));
    
    return onSnapshot(q, {
      next: (snapshot) => {
        const categories = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            budget: data.budget || 0,
            color: data.color || '#00A6B2',
            userId: data.userId || '',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as Category;
        });
        
        callback(categories);
      },
      error: (error) => {
        console.error('Error in categories subscription:', error);
        callback([]);
      }
    });
}

export async function addCategory(categoryData: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    const categoriesRef = collection(db, 'categories');
    const newCategory = {
      ...categoryData,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(categoriesRef, newCategory);
    return { 
      category: { 
        id: docRef.id, 
        ...categoryData,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error adding category:', error);
    return { category: null, error: error.message };
  }
}

export async function updateCategory(categoryId: string, updates: Partial<Category>) {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');
    const categoryRef = doc(db, 'categories', categoryId);
    
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(categoryRef, updatedData);
    
    return { 
      category: {
        id: categoryId,
        ...updates,
        updatedAt: new Date()
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error updating category:', error);
    return { category: null, error: error.message };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
}