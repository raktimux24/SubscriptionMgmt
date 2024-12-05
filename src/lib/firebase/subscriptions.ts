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
  getDoc,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth } from './config';
import { calculateNextPaymentDate } from '../../utils/subscriptionCalculations';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'quarterly';
  category: string;
  startDate: string;
  description?: string;
  reminderDays: number;
  status: 'active' | 'inactive';
  nextPayment: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function subscribeToSubscriptions(callback: (subscriptions: Subscription[]) => void): Unsubscribe {
  if (!auth.currentUser) throw new Error('No authenticated user');
  
  const subscriptionsRef = collection(db, 'subscriptions');
  const q = query(subscriptionsRef, where('userId', '==', auth.currentUser.uid));
  
  return onSnapshot(q, {
    next: (snapshot) => {
      console.log('Raw subscription docs:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const subscriptions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Subscription[];
      
      console.log('Processed subscriptions:', subscriptions);
      callback(subscriptions);
    },
    error: (error) => {
      console.error('Error in subscriptions subscription:', error);
      callback([]);
    }
  });
}

export async function addSubscription(
  subscriptionData: Omit<Subscription, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) {
  if (!auth.currentUser) throw new Error('No authenticated user');

  const now = new Date();
  const startDate = subscriptionData.startDate || now.toISOString();
  const nextPayment = calculateNextPaymentDate(startDate, subscriptionData.billingCycle).toISOString();

  try {
    const docRef = await addDoc(collection(db, 'subscriptions'), {
      ...subscriptionData,
      userId: auth.currentUser.uid,
      startDate,
      nextPayment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      subscription: {
        id: docRef.id,
        ...subscriptionData,
        userId: auth.currentUser.uid,
        startDate,
        nextPayment,
        createdAt: now,
        updatedAt: now
      },
      error: null
    };
  } catch (error) {
    console.error('Error adding subscription:', error);
    return { subscription: null, error: error.message };
  }
}

export async function updateSubscription(
  subscriptionId: string,
  updates: Partial<Subscription>
) {
  if (!auth.currentUser) throw new Error('No authenticated user');

  try {
    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    // If billing cycle is updated, recalculate next payment date
    if (updates.billingCycle || updates.startDate) {
      const docRef = doc(db, 'subscriptions', subscriptionId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Subscription not found');
      }
      
      const currentData = docSnap.data();
      const startDate = updates.startDate || currentData.startDate;
      const billingCycle = updates.billingCycle || currentData.billingCycle;
      
      const nextDate = calculateNextPaymentDate(startDate, billingCycle);
      updateData.nextPayment = nextDate.toISOString();
    }

    const docRef = doc(db, 'subscriptions', subscriptionId);
    await updateDoc(docRef, updateData);

    return {
      subscription: {
        id: subscriptionId,
        ...updates,
        nextPayment: updateData.nextPayment,
        updatedAt: new Date()
      },
      error: null
    };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { subscription: null, error: error.message };
  }
}

export async function deleteSubscription(subscriptionId: string) {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    await deleteDoc(subscriptionRef);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return { success: false, error: error.message };
  }
}