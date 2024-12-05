import { 
  collection, 
  onSnapshot,
  doc,
  addDoc, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp,
  getDocs,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth } from './config';

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  spent: number;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export function subscribeToBudgets(callback: (budgets: Budget[]) => void): Unsubscribe {
  if (!auth.currentUser) throw new Error('No authenticated user');
  
  const budgetsRef = collection(db, 'budgets');
  const currentDate = new Date();
  const q = query(
    budgetsRef,
    where('userId', '==', auth.currentUser.uid),
    where('year', '==', currentDate.getFullYear()),
    where('month', '==', currentDate.getMonth() + 1)
  );
  
  return onSnapshot(q, {
    next: (snapshot) => {
      const budgets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Budget[];
      
      callback(budgets);
    },
    error: (error) => {
      console.error('Error in budgets subscription:', error);
      callback([]);
    }
  });
}

export async function updateBudget(budgetId: string, updates: Partial<Budget>) {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    const budgetRef = doc(db, 'budgets', budgetId);
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(budgetRef, updatedData);
    
    return { 
      budget: {
        id: budgetId,
        ...updates,
        updatedAt: new Date()
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error updating budget:', error);
    return { budget: null, error: error.message };
  }
}

export async function createOrUpdateBudget(categoryId: string, amount: number) {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const budgetsRef = collection(db, 'budgets');
    const budgetQuery = query(
      budgetsRef,
      where('userId', '==', auth.currentUser.uid),
      where('categoryId', '==', categoryId),
      where('year', '==', year),
      where('month', '==', month)
    );

    const snapshot = await getDocs(budgetQuery);

    const budgetData = {
      userId: auth.currentUser.uid,
      categoryId,
      amount: Number(amount),
      spent: 0,
      month,
      year,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    if (snapshot.empty) {
      // Create new budget
      await addDoc(budgetsRef, budgetData);
    } else {
      // Update existing budget
      const existingBudgetRef = snapshot.docs[0].ref;
      await updateDoc(existingBudgetRef, {
        amount: Number(amount),
        updatedAt: serverTimestamp()
      });
    }

    return { error: null };
  } catch (error) {
    console.error('Error creating/updating budget:', error);
    return { error: error.message };
  }
}