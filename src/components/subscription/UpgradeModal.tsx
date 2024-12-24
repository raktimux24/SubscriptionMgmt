import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    navigate('/settings');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#2A2A2A] sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-[#00A6B2]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-lg font-semibold leading-6 text-[#EAEAEA]">
                Upgrade to Pro
              </h3>
              <div className="mt-2">
                <p className="text-sm text-[#C0C0C0]">
                  You've reached the limit of 5 active subscriptions on the free plan. 
                  Upgrade to Pro for unlimited subscriptions and additional features!
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleUpgrade}
              className="inline-flex w-full justify-center rounded-md bg-[#00A6B2] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#008A94] sm:ml-3 sm:w-auto"
            >
              Upgrade Now
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-[#2A2A2A] px-3 py-2 text-sm font-semibold text-[#EAEAEA] shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-[#3A3A3A] sm:mt-0 sm:w-auto"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
