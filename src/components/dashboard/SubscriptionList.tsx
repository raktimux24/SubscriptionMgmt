import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import { SubscriptionTable } from '../subscription/SubscriptionTable';
import { Loader } from 'lucide-react';
import type { Subscription } from '../../lib/firebase/subscriptions';

export function SubscriptionList() {
  const { subscriptions, loading, updateSubscription, deleteSubscription } = useSubscriptions();
  const navigate = useNavigate();

  const handleStatusChange = async (id: string, status: 'active' | 'inactive') => {
    await updateSubscription(id, { status });
  };

  const handleEdit = (subscription: Subscription) => {
    navigate(`/edit-subscription/${subscription.id}`);
  };

  const handleDelete = async (id: string) => {
    setDeleteSubscription(subscription);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 text-[#00A6B2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-[#2A2A2A]">
        <h2 className="text-lg font-semibold text-[#EAEAEA] mb-2 sm:mb-0">
          Recent Subscriptions
        </h2>
        {subscriptions.length > 0 && (
          <Link 
            to="/subscriptions" 
            className="text-sm text-[#00A6B2] hover:text-[#008A94] transition-colors"
          >
            View All
          </Link>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <SubscriptionTable
          subscriptions={subscriptions}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      
      {subscriptions.length === 0 && (
        <div className="p-6 sm:p-8 text-center">
          <p className="text-[#C0C0C0]">No subscriptions found.</p>
          <Link 
            to="/add-subscription"
            className="inline-flex items-center mt-4 text-sm text-[#00A6B2] hover:text-[#008A94] transition-colors"
          >
            Add your first subscription
          </Link>
        </div>
      )}
    </div>
  );
}