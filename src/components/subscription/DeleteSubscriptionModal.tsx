import React from 'react';
import { Dialog } from '@headlessui/react';
import { AlertTriangle, X } from 'lucide-react';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface DeleteSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string;
  subscriptionName: string;
}

export function DeleteSubscriptionModal({ 
  isOpen, 
  onClose, 
  subscriptionId,
  subscriptionName 
}: DeleteSubscriptionModalProps) {
  const { deleteSubscription, loading } = useSubscriptions();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const { error } = await deleteSubscription(subscriptionId);
    if (!error) {
      toast.success('Subscription deleted successfully');
      onClose();
      navigate('/dashboard');
    }
  };

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
              Delete Subscription
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-[#C0C0C0] hover:text-[#EAEAEA] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-400/10 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-[#EAEAEA] text-center">
              Are you sure you want to delete <span className="font-semibold text-red-400">{subscriptionName}</span>?
            </p>
            <p className="text-[#C0C0C0] text-sm text-center mt-2">
              This action cannot be undone. All payment history and data associated with this subscription will be permanently deleted.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-[#2A2A2A] rounded-lg text-[#C0C0C0] hover:bg-[#2A2A2A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Deleting...' : 'Delete Subscription'}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}