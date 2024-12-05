import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile } from '../../hooks/useProfile';
import { ProfilePicture } from './ProfilePicture';
import { UserProfile } from '../../lib/firebase/users';

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
      bio: profile?.bio || ''
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
              State/Province
            </label>
            <input
              type="text"
              {...register('state')}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              ZIP/Postal Code
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

        <div>
          <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
            Bio
          </label>
          <textarea
            {...register('bio')}
            rows={4}
            className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
            placeholder="Tell us a little about yourself..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty && !selectedImage || loading}
            className="px-6 py-2 bg-[#00A6B2] text-white rounded-lg hover:bg-[#008A94] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}