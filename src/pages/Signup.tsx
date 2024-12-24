import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Chrome } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { InputField } from '../components/auth/InputField';
import { SocialButton } from '../components/auth/SocialButton';
import { BackToHome } from '../components/auth/BackToHome';
import { signUp, signInWithGoogle, onAuthStateChange } from '../lib/firebase/auth';
import toast from 'react-hot-toast';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>();
  const navigate = useNavigate();

  // Handle auth state changes
  useEffect(() => {
    console.log('Setting up auth state observer...');
    const unsubscribe = onAuthStateChange((user) => {
      console.log('Auth state changed:', user);
      if (user) {
        console.log('User is authenticated, navigating to dashboard');
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { user, error } = await signUp(data.email, data.password, data.name);
      if (error) {
        toast.error(error);
        return;
      }
      if (user) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { user, error } = await signInWithGoogle();
      if (error) {
        console.error('Google signup error:', error);
        toast.error(error);
        return;
      }
      if (user) {
        console.log('Google signup successful:', user);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Unexpected error during Google signup:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#EAEAEA] text-center">Create your account</h2>
          <p className="mt-2 text-sm text-[#C0C0C0] text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00A6B2] hover:text-[#008A94]">
              Sign in
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Full name"
            name="name"
            type="text"
            register={register}
            error={errors.name?.message}
            placeholder="John Doe"
          />

          <InputField
            label="Email address"
            name="email"
            type="email"
            register={register}
            error={errors.email?.message}
            placeholder="you@example.com"
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            register={register}
            error={errors.password?.message}
            placeholder="••••••••"
          />

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-[#2A2A2A] bg-[#121212] text-[#00A6B2] focus:ring-[#00A6B2]"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-[#C0C0C0]">
              I agree to the{' '}
              <Link to="/terms" className="text-[#00A6B2] hover:text-[#008A94]">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#00A6B2] hover:text-[#008A94]">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00A6B2] hover:bg-[#008A94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A6B2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A2A]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1A1A1A] text-[#C0C0C0]">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <SocialButton icon={Chrome} onClick={handleGoogleSignup}>
              Sign up with Google
            </SocialButton>
          </div>
        </div>

        <BackToHome />
      </div>
    </AuthLayout>
  );
}