import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { updateUserProfile } from '../lib/firebase/users';
import { uploadProfilePicture } from '../lib/firebase/storage';
import { UserProfile } from '../lib/firebase/users';
import toast from 'react-hot-toast';

export function useProfile() {
  const { user, profile, setProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const updateProfile = async (updates: Partial<UserProfile>, profilePicture?: File | null) => {
    if (!user) return;
    
    setLoading(true);
    try {
      let photoURL = profile?.photoURL;
      
      if (profilePicture) {
        const { url, error: uploadError } = await uploadProfilePicture(profilePicture);
        if (uploadError) throw new Error(uploadError);
        photoURL = url;
      }

      const updatedProfile = {
        ...updates,
        ...(photoURL && { photoURL })
      };

      const { error: updateError } = await updateUserProfile(user.uid, updatedProfile);
      if (updateError) throw new Error(updateError);
      
      setProfile({ ...profile, ...updatedProfile });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    updateProfile
  };
}