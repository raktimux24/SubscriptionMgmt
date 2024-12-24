import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile } from '../../hooks/useProfile';
import { ProfilePicture } from './ProfilePicture';
import { UserProfile } from '../../lib/firebase/users';
import { CreditCard } from 'lucide-react';

type SettingsFormData = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'photoURL'>;

export function SettingsForm() {
  const { profile, loading, updateProfile } = useProfile();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<SettingsFormData>({
    defaultValues: {
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
      state: profile?.state || '',
      zipCode: profile?.zipCode || '',
      country: profile?.country || '',
      bio: profile?.bio || '',
      subscriptionType: profile?.subscriptionType || 'free'
    }
  });

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpgrade = () => {
    // TODO: Implement upgrade to pro plan logic
    console.log('Upgrade to pro plan');
  };

  const handleDowngrade = () => {
    // TODO: Implement downgrade to free plan logic
    console.log('Downgrade to free plan');
  };

  const onSubmit = async (data: SettingsFormData) => {
    await updateProfile(data, selectedImage);
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ProfilePicture onImageSelect={handleImageSelect} previewUrl={previewUrl} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Full Name
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Address
            </label>
            <input
              type="text"
              {...register('address')}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              City
            </label>
            <input
              type="text"
              {...register('city')}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              State
            </label>
            <input
              type="text"
              {...register('state')}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              {...register('zipCode')}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Country
            </label>
            <input
              type="text"
              {...register('country')}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#121212] p-4 rounded-lg border border-[#2A2A2A]">
          <div>
            <h3 className="text-sm font-medium text-[#EAEAEA]">Subscription Plan</h3>
            <p className="text-sm text-[#C0C0C0] mt-1">
              {profile?.subscriptionType === 'free' ? (
                'Free Plan (Limited to 5 subscriptions)'
              ) : (
                'Pro Plan (Unlimited subscriptions)'
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={profile?.subscriptionType === 'free' ? handleUpgrade : handleDowngrade}
            disabled
            className="flex items-center px-4 py-2 bg-[#00A6B2] text-white rounded-lg hover:bg-[#008A94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {profile?.subscriptionType === 'free' ? 'Upgrade to Pro' : 'Downgrade to Free Plan'}
          </button>
          <input
            type="hidden"
            {...register('subscriptionType')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
            Bio
          </label>
          <textarea
            {...register('bio')}
            rows={4}
            className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty || loading}
            className="px-6 py-2 bg-[#00A6B2] text-white rounded-lg hover:bg-[#008A94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}