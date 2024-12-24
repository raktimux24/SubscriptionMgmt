import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase-config.mjs';

async function setDefaultSubscriptionType() {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    console.log(`Found ${querySnapshot.size} users to update`);
    
    const updatePromises = querySnapshot.docs.map(async (userDoc) => {
      const userRef = doc(db, 'users', userDoc.id);
      await updateDoc(userRef, {
        subscriptionType: 'free'
      });
      console.log(`Updated user ${userDoc.id} to free subscription type`);
    });
    
    await Promise.all(updatePromises);
    console.log('Successfully updated all users to free subscription type');
    
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
  process.exit(0);
}

// Execute the function
setDefaultSubscriptionType();
