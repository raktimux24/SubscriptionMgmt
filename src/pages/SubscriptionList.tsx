import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionLayout } from '../components/subscription/SubscriptionLayout';
import { SubscriptionListHeader } from '../components/subscription/SubscriptionListHeader';
import { SubscriptionTable } from '../components/subscription/SubscriptionTable';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { Plus, Loader } from 'lucide-react';
import { useSubscriptionUpgrade } from '../hooks/useSubscriptionUpgrade';
import { UpgradeModal } from '../components/subscription/UpgradeModal';

export function SubscriptionList() {
  const navigate = useNavigate();
  const { subscriptions, loading, updateSubscription, deleteSubscription } = useSubscriptions();
  const [searchTerm, setSearchTerm] = useState('');
  const {
    showUpgradeModal,
    handleAddSubscriptionClick,
    handleUpgradeModalClose,
    handleUpgradeClick,
    isAtLimit
  } = useSubscriptionUpgrade();

  const handleStatusChange = async (id: string, status: 'active' | 'inactive') => {
    await updateSubscription(id, { status });
  };

  const handleEdit = (subscription: any) => {
    navigate(`/edit-subscription/${subscription.id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      await deleteSubscription(id);
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const searchLower = searchTerm.toLowerCase();
    return (
      subscription.name.toLowerCase().includes(searchLower) ||
      subscription.category.toLowerCase().includes(searchLower) ||
      subscription.status.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 text-[#00A6B2] animate-spin" />
      </div>
    );
  }

  return (
    <SubscriptionLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#EAEAEA]">All Subscriptions</h1>
          <button 
            onClick={handleAddSubscriptionClick}
            disabled={isAtLimit}
            className="flex items-center gap-2 px-4 py-2 bg-[#00A6B2] text-white rounded-lg hover:bg-[#008A94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            Add Subscription
          </button>
        </div>

        <div className="space-y-6">
          <SubscriptionListHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <SubscriptionTable
            subscriptions={filteredSubscriptions}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={handleUpgradeModalClose}
      />
    </SubscriptionLayout>
  );
}