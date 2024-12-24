import { collection, query, where, getDocs, and } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { UserProfile } from '../lib/firebase/users';

const FREE_USER_LIMIT = 5;

export async function canAddSubscription(userId: string, userProfile: UserProfile): Promise<{ allowed: boolean; error?: string }> {
  if (userProfile.subscriptionType === 'paid') {
    return { allowed: true };
  }

  // For free users, check the current active subscription count
  const subscriptionsRef = collection(db, 'subscriptions');
  const q = query(
    subscriptionsRef, 
    and(
      where('userId', '==', userId),
      where('status', '==', 'active')
    )
  );
  
  const querySnapshot = await getDocs(q);
  const activeCount = querySnapshot.size;

  if (activeCount >= FREE_USER_LIMIT) {
    return {
      allowed: false,
      error: `Free users can only add up to ${FREE_USER_LIMIT} active subscriptions. Please upgrade to a paid plan for unlimited subscriptions.`
    };
  }

  return { allowed: true };
}
