import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  photoURL?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  bio?: string;
  subscriptionType: 'free' | 'paid';
  activeSubscriptionCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createUserProfile(userId: string, userData: Partial<UserProfile>) {
  try {
    const userRef = doc(db, 'users', userId);
    const userProfile = {
      ...userData,
      subscriptionType: 'free', // Set default subscription type
      activeSubscriptionCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(userRef, userProfile);
    return { profile: userProfile, error: null };
  } catch (error) {
    return { profile: null, error: error.message };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { profile: { id: userSnap.id, ...userSnap.data() } as UserProfile, error: null };
    }
    return { profile: null, error: 'User not found' };
  } catch (error) {
    return { profile: null, error: error.message };
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function incrementSubscriptionCount(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { error: 'User not found' };
    }

    const currentCount = userSnap.data().activeSubscriptionCount || 0;
    await updateDoc(userRef, {
      activeSubscriptionCount: currentCount + 1,
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function decrementSubscriptionCount(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { error: 'User not found' };
    }

    const currentCount = userSnap.data().activeSubscriptionCount || 0;
    await updateDoc(userRef, {
      activeSubscriptionCount: Math.max(0, currentCount - 1),
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}