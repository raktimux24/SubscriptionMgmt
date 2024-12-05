import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
}

export function QuickActionButton({
  icon: Icon,
  label,
  description,
  onClick
}: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-lg transition-colors group border border-transparent hover:border-[#2A2A2A]"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 p-2 rounded-lg bg-[#2A2A2A] group-hover:bg-[#363636] transition-colors">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#00A6B2]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[#EAEAEA] font-medium truncate">{label}</div>
          <div className="text-sm text-[#C0C0C0] line-clamp-2">{description}</div>
        </div>
      </div>
    </button>
  );
}