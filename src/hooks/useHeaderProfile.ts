import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { signOut } from '../lib/firebase/auth';
import toast from 'react-hot-toast';

export function useHeaderProfile() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error);
      return;
    }
    navigate('/');
  };

  return {
    user,
    profile,
    handleLogout
  };
}