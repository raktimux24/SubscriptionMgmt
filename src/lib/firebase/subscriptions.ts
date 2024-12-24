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
import { UserProfile } from './users';
import { canAddSubscription } from '../../utils/subscriptionLimits';

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
): Promise<{ subscription: Subscription | null; error: string | null }> {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error('User profile not found');

    const userProfile = { id: userSnap.id, ...userSnap.data() } as UserProfile;
    const { allowed, error } = await canAddSubscription(auth.currentUser.uid, userProfile);
    
    if (!allowed) {
      throw new Error(error);
    }

    const subscriptionsRef = collection(db, 'subscriptions');
    const newSubscription = {
      ...subscriptionData,
      userId: auth.currentUser.uid,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(subscriptionsRef, newSubscription);
    const newDoc = await getDoc(docRef);

    if (!newDoc.exists()) throw new Error('Failed to create subscription');

    return {
      subscription: {
        id: newDoc.id,
        ...newDoc.data(),
        createdAt: newDoc.data().createdAt?.toDate(),
        updatedAt: newDoc.data().updatedAt?.toDate()
      } as Subscription,
      error: null
    };
  } catch (error) {
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