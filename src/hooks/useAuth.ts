import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { useAuthStore } from '../stores/authStore';
import { getUserProfile } from '../lib/firebase/users';

export function useAuth() {
  const { user, profile, loading, error, setUser, setProfile, setLoading, setError, reset } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          setUser(user);
          const { profile, error } = await getUserProfile(user.uid);
          if (error) throw new Error(error);
          setProfile(profile);
        } else {
          reset();
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, profile, loading, error };
}