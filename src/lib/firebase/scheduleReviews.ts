import { db } from './config';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ReviewSchedule } from '../../contexts/ReviewScheduleContext';

export async function saveScheduleReview(userId: string, schedule: ReviewSchedule) {
  try {
    console.log('Saving schedule review for user:', userId);
    const scheduleRef = doc(db, 'scheduleReviews', userId);
    await setDoc(scheduleRef, {
      ...schedule,
      userId, // Ensure userId is included in the document
      updatedAt: new Date().toISOString()
    });
    console.log('Successfully saved schedule review');
    return true;
  } catch (error) {
    console.error('Error saving schedule review:', error);
    throw error;
  }
}

export async function getScheduleReview(userId: string): Promise<ReviewSchedule | null> {
  try {
    console.log('Getting schedule review for user:', userId);
    const scheduleRef = doc(db, 'scheduleReviews', userId);
    const scheduleDoc = await getDoc(scheduleRef);
    
    if (scheduleDoc.exists()) {
      console.log('Found existing schedule review');
      return scheduleDoc.data() as ReviewSchedule;
    }
    console.log('No existing schedule review found');
    return null;
  } catch (error) {
    console.error('Error getting schedule review:', error);
    throw error;
  }
}

export async function updateScheduleReview(userId: string, updates: Partial<ReviewSchedule>) {
  try {
    console.log('Updating schedule review for user:', userId);
    const scheduleRef = doc(db, 'scheduleReviews', userId);
    const scheduleDoc = await getDoc(scheduleRef);
    
    if (!scheduleDoc.exists()) {
      console.log('Creating new schedule review document');
      // Create the document if it doesn't exist
      await setDoc(scheduleRef, {
        ...updates,
        userId, // Ensure userId is included in the document
        updatedAt: new Date().toISOString()
      });
    } else {
      console.log('Updating existing schedule review document');
      // Update existing document
      await updateDoc(scheduleRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    }
    console.log('Successfully updated schedule review');
    return true;
  } catch (error) {
    console.error('Error updating schedule review:', error);
    throw error;
  }
}
