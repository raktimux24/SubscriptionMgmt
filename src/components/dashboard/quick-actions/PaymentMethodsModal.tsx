import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, CreditCard, Plus } from 'lucide-react';

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentMethodsModal({ isOpen, onClose }: PaymentMethodsModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <div className="relative bg-[#1A1A1A] rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold text-[#EAEAEA]">
              Payment Methods
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-[#C0C0C0] hover:text-[#EAEAEA] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-2 p-4 border border-dashed border-[#2A2A2A] rounded-lg text-[#00A6B2] hover:bg-[#2A2A2A] transition-colors">
              <Plus className="h-5 w-5" />
              Add Payment Method
            </button>

            <div className="p-4 bg-[#2A2A2A] rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[#00A6B2]" />
                  <div>
                    <p className="text-[#EAEAEA] font-medium">•••• 4242</p>
                    <p className="text-sm text-[#C0C0C0]">Expires 12/24</p>
                  </div>
                </div>
                <button className="text-sm text-[#00A6B2] hover:text-[#008A94] transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}