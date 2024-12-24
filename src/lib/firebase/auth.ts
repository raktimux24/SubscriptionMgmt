import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  User
} from 'firebase/auth';
import { auth } from './config';
import { createUserProfile } from './users';

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

export async function signIn(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(result.user.uid, { name, email });
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

// Function to handle user profile creation/update
async function handleUserProfile(user: User) {
  if (user) {
    try {
      await createUserProfile(user.uid, {
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || ''
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    console.log('Auth state changed - Current user:', user);
    if (user) {
      try {
        await handleUserProfile(user);
      } catch (error) {
        console.error('Error in auth state change handler:', error);
      }
    }
    callback(user);
  });
}

export async function signInWithGoogle() {
  try {
    console.log('Starting Google sign-in with popup...');
    const provider = new GoogleAuthProvider();
    
    // Add scopes and custom parameters
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account',
      // Add display mode for better popup handling
      display: 'popup',
      // Add additional parameters for better cross-origin handling
      auth_type: 'rerequest',
      include_granted_scopes: 'true'
    });
    
    // Configure auth settings for better popup handling
    await auth.setPersistence(browserLocalPersistence);
    
    // Use popup for sign in with error handling
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Popup sign-in result:', result);

      if (result.user) {
        console.log('User authenticated:', result.user);
        await handleUserProfile(result.user);
        return { user: result.user, error: null };
      }
      
      return { user: null, error: 'No user data received' };
    } catch (popupError: any) {
      // Handle specific popup errors
      if (popupError.code === 'auth/popup-blocked') {
        console.error('Popup was blocked by the browser');
        return { user: null, error: 'Please allow popups for this site to sign in with Google' };
      }
      if (popupError.code === 'auth/popup-closed-by-user') {
        console.error('Popup was closed by the user');
        return { user: null, error: 'Sign in was cancelled' };
      }
      throw popupError;
    }
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    return { user: null, error: error.message };
  }
}