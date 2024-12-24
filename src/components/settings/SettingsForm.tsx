import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile } from '../../hooks/useProfile';
import { ProfilePicture } from './ProfilePicture';
import { UserProfile } from '../../lib/firebase/users';
import { CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

type SettingsFormData = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'photoURL'>;

export function SettingsForm() {
  const { profile, loading, updateProfile } = useProfile();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty }, setValue, watch } = useForm<SettingsFormData>({
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

  const currentSubscriptionType = watch('subscriptionType');

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpgrade = async () => {
    setIsUpdating(true);
    try {
      await updateProfile({ subscriptionType: 'paid' });
      setValue('subscriptionType', 'paid');
      toast.success('Successfully upgraded to Pro plan!');
    } catch (error) {
      toast.error('Failed to upgrade plan. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDowngrade = async () => {
    setIsUpdating(true);
    try {
      await updateProfile({ subscriptionType: 'free' });
      setValue('subscriptionType', 'free');
      toast.success('Successfully downgraded to Free plan');
    } catch (error) {
      toast.error('Failed to downgrade plan. Please try again.');
    } finally {
      setIsUpdating(false);
    }
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

        <div className="border-t border-[#2A2A2A] pt-6">
          <h3 className="text-lg font-semibold text-[#EAEAEA] mb-4">Subscription Plan</h3>
          <div className="bg-[#121212] rounded-lg p-4 border border-[#2A2A2A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#2A2A2A]">
                  <CreditCard className="h-5 w-5 text-[#00A6B2]" />
                </div>
                <div>
                  <p className="text-[#EAEAEA] font-medium">
                    {currentSubscriptionType === 'paid' ? 'Pro Plan' : 'Free Plan'}
                  </p>
                  <p className="text-sm text-[#C0C0C0]">
                    {currentSubscriptionType === 'paid' 
                      ? 'Unlimited subscriptions and premium features' 
                      : 'Up to 5 active subscriptions'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={currentSubscriptionType === 'paid' ? handleDowngrade : handleUpgrade}
                disabled={isUpdating || loading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentSubscriptionType === 'paid'
                    ? 'bg-[#2A2A2A] text-[#EAEAEA] hover:bg-[#3A3A3A]'
                    : 'bg-[#00A6B2] text-white hover:bg-[#008A94]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isUpdating ? 'Updating...' : currentSubscriptionType === 'paid' ? 'Downgrade to Free' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>
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
            className="px-4 py-2 bg-[#00A6B2] text-white rounded-lg font-medium hover:bg-[#008A94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}