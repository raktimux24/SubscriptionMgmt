import React from 'react';
import { Camera } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';

interface ProfilePictureProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
}

export function ProfilePicture({ onImageSelect, previewUrl }: ProfilePictureProps) {
  const { profile } = useProfile();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <img
          src={previewUrl || profile?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
          alt="Profile"
          className="h-24 w-24 rounded-full object-cover"
        />
        <label className="absolute bottom-0 right-0 p-1 bg-[#2A2A2A] rounded-full cursor-pointer hover:bg-[#363636] transition-colors">
          <Camera className="h-4 w-4 text-[#C0C0C0]" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
      <div>
        <h3 className="text-lg font-medium text-[#EAEAEA]">Profile Picture</h3>
        <p className="text-sm text-[#C0C0C0]">JPG, GIF or PNG. Max size of 2MB</p>
        {previewUrl && (
          <p className="text-sm text-[#00A6B2] mt-1">New image selected - Save to apply changes</p>
        )}
      </div>
    </div>
  );
}