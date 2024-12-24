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
  Unsubscribe,
  and
} from 'firebase/firestore';
import { db } from './config';
import { calculateNextPaymentDate } from '../../utils/subscriptionCalculations';
import { UserProfile, incrementSubscriptionCount, decrementSubscriptionCount } from './users';
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

export function subscribeToUserSubscriptions(
  userId: string,
  observer: { next: (subscriptions: Subscription[]) => void; error: (error: Error) => void }
): Unsubscribe {
  const subscriptionsRef = collection(db, 'subscriptions');
  const q = query(subscriptionsRef, where('userId', '==', userId));
  
  return onSnapshot(q, {
    next: (snapshot) => {
      const subscriptions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Subscription[];
      observer.next(subscriptions);
    },
    error: (error) => {
      console.error('Error in subscriptions subscription:', error);
      observer.error(error);
    }
  });
}

export async function addSubscription(
  userId: string,
  data: Omit<Subscription, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<{ subscription?: Subscription; error: string | null }> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return { error: 'User profile not found' };
    }

    const userProfile = { id: userSnap.id, ...userSnap.data() } as UserProfile;
    const { allowed, error } = await canAddSubscription(userId, userProfile);
    
    if (!allowed) {
      return { error };
    }

    const subscriptionsRef = collection(db, 'subscriptions');
    const newSubscription = {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(subscriptionsRef, newSubscription);
    const newDoc = await getDoc(docRef);

    if (!newDoc.exists()) {
      return { error: 'Failed to create subscription' };
    }

    // If the subscription is active, increment the user's active subscription count
    if (data.status === 'active') {
      const { error: countError } = await incrementSubscriptionCount(userId);
      if (countError) {
        return { error: countError };
      }
    }

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
    return { error: error.message };
  }
}

export async function updateSubscription(
  subscriptionId: string,
  updates: Partial<Subscription>
): Promise<{ subscription?: Subscription; error: string | null }> {
  try {
    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    const subscriptionSnap = await getDoc(subscriptionRef);

    if (!subscriptionSnap.exists()) {
      return { error: 'Subscription not found' };
    }

    const currentSubscription = { id: subscriptionSnap.id, ...subscriptionSnap.data() } as Subscription;
    const userId = currentSubscription.userId;

    // If status is being updated, handle subscription count
    if (updates.status && updates.status !== currentSubscription.status) {
      if (updates.status === 'active') {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          return { error: 'User profile not found' };
        }

        const userProfile = { id: userSnap.id, ...userSnap.data() } as UserProfile;
        const { allowed, error } = await canAddSubscription(userId, userProfile);
        
        if (!allowed) {
          return { error };
        }

        const { error: countError } = await incrementSubscriptionCount(userId);
        if (countError) {
          return { error: countError };
        }
      } else if (currentSubscription.status === 'active') {
        const { error: countError } = await decrementSubscriptionCount(userId);
        if (countError) {
          return { error: countError };
        }
      }
    }

    await updateDoc(subscriptionRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(subscriptionRef);
    return {
      subscription: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data()?.createdAt?.toDate(),
        updatedAt: updatedDoc.data()?.updatedAt?.toDate()
      } as Subscription,
      error: null
    };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteSubscription(
  subscriptionId: string
): Promise<{ error: string | null }> {
  try {
    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    const subscriptionSnap = await getDoc(subscriptionRef);

    if (!subscriptionSnap.exists()) {
      return { error: 'Subscription not found' };
    }

    const subscription = { id: subscriptionSnap.id, ...subscriptionSnap.data() } as Subscription;
    
    // If the subscription was active, decrement the count
    if (subscription.status === 'active') {
      const { error: countError } = await decrementSubscriptionCount(subscription.userId);
      if (countError) {
        return { error: countError };
      }
    }

    await deleteDoc(subscriptionRef);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

// Alias for backward compatibility
export const createSubscription = addSubscription;