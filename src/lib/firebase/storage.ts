import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from './config';

export async function uploadProfilePicture(file: File) {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');
    
    const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { url: downloadURL, error: null };
  } catch (error) {
    return { url: null, error: error.message };
  }
}