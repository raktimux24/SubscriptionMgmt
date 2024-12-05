import { 
  collection, 
  onSnapshot,
  deleteDoc,
  getDocs,
  doc,
  writeBatch,
  addDoc, 
  query, 
  where, 
  serverTimestamp,
  Unsubscribe,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from './config';
import type { Subscription } from './subscriptions';

export interface Payment {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  date: Date;
  status: 'paid' | 'pending' | 'failed';
  createdAt: Date;
}

export function subscribeToPaymentHistory(
  subscriptionId: string, 
  callback: (payments: Payment[]) => void
): Unsubscribe {
  if (!auth.currentUser) throw new Error('No authenticated user');
  
  const paymentsRef = collection(db, 'payments');
  const q = query(
    paymentsRef, 
    where('subscriptionId', '==', subscriptionId),
    where('userId', '==', auth.currentUser.uid),
    orderBy('date', 'desc')
  );
  
  return onSnapshot(q, {
    next: (snapshot) => {
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Payment, 'id' | 'date' | 'createdAt'>,
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Payment[];
      
      callback(payments);
    },
    error: (error) => {
      console.error('Error in payments subscription:', error);
      callback([]);
    }
  });
}

export async function addPayment(paymentData: Omit<Payment, 'id' | 'userId' | 'createdAt'>) {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');
        
    const paymentsRef = collection(db, 'payments');
    const newPayment = {
      ...paymentData,
      date: Timestamp.fromDate(paymentData.date instanceof Date ? paymentData.date : new Date(paymentData.date)),
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(paymentsRef, newPayment);
    return { 
      payment: { 
        id: docRef.id, 
        ...paymentData,
        userId: auth.currentUser.uid,
        createdAt: new Date()
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error adding payment:', error);
    return { payment: null, error: error.message };
  }
}

export async function generatePaymentHistory(subscription: Subscription) {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');
    if (!subscription.id) throw new Error('Subscription ID is required');
    
    // Delete existing payments first
    await deletePaymentsForSubscription(subscription.id);
    
    const startDate = new Date(subscription.startDate);
    const today = new Date();
    
    // Validate dates
    if (isNaN(startDate.getTime())) {
      throw new Error('Invalid start date');
    }
    
    const payments = [];
    let currentDate = new Date(startDate);
    const batchSize = 450; // Keep under Firestore's 500 limit for safety
    
    // Generate all payment dates up to today
    while (currentDate <= today) {
      // Skip invalid dates
      if (isNaN(currentDate.getTime())) {
        continue;
      }
      
      payments.push({
        subscriptionId: subscription.id,
        userId: auth.currentUser.uid,
        amount: subscription.amount,
        date: new Date(currentDate),
        status: 'paid',
        createdAt: serverTimestamp()
      });

      const nextDate = new Date(currentDate);
      switch (subscription.billingCycle) {
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
        case 'quarterly':
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
      }
      
      // Ensure we don't get stuck in an infinite loop
      if (nextDate <= currentDate) {
        break;
      }
      currentDate = nextDate;
    }

    // Process in chunks to stay within Firestore limits
    const paymentsRef = collection(db, 'payments');
    const chunks = [];
    
    // If no payments to process, return early
    if (payments.length === 0) {
      return { success: true, error: null };
    }
    
    for (let i = 0; i < payments.length; i += batchSize) {
      chunks.push(payments.slice(i, i + batchSize));
    }

    // Process each chunk with a new batch
    for (const chunk of chunks) {
      const batch = writeBatch(db);
      let count = 0;
      
      chunk.forEach((payment) => {
        const docRef = doc(paymentsRef);
        batch.set(docRef, {
          ...payment,
          date: Timestamp.fromDate(payment.date)
        });
        count++;
      });
      
      // Only commit if we have documents to write
      if (count > 0) {
        await batch.commit();
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error generating payment history:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePaymentsForSubscription(subscriptionId: string) {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    // Validate subscription ID
    if (!subscriptionId) throw new Error('Subscription ID is required');
    
    const paymentsRef = collection(db, 'payments');
    const q = query(
      paymentsRef,
      where('subscriptionId', '==', subscriptionId),
      where('userId', '==', auth.currentUser.uid)
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    let count = 0;
    
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
      count++;
    });
    
    if (count > 0) {
      await batch.commit();
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting payments:', error);
    return { success: false, error: error.message };
  }
}