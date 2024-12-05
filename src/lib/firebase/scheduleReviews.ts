import { db } from './config';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ReviewSchedule } from '../../contexts/ReviewScheduleContext';

export async function saveScheduleReview(userId: string, schedule: ReviewSchedule) {
  try {
    const scheduleRef = doc(db, 'scheduleReviews', userId);
    await setDoc(scheduleRef, {
      ...schedule,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving schedule review:', error);
    throw error;
  }
}

export async function getScheduleReview(userId: string): Promise<ReviewSchedule | null> {
  try {
    const scheduleRef = doc(db, 'scheduleReviews', userId);
    const scheduleDoc = await getDoc(scheduleRef);
    
    if (scheduleDoc.exists()) {
      return scheduleDoc.data() as ReviewSchedule;
    }
    return null;
  } catch (error) {
    console.error('Error getting schedule review:', error);
    throw error;
  }
}

export async function updateScheduleReview(userId: string, updates: Partial<ReviewSchedule>) {
  try {
    const scheduleRef = doc(db, 'scheduleReviews', userId);
    await updateDoc(scheduleRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating schedule review:', error);
    throw error;
  }
}
