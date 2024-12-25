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
  const [sortConfig, setSortConfig] = useState<{ field: string; order: string }>({
    field: 'cost',
    order: 'asc',
  });
  
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

  const handleSort = (field: string, order: string) => {
    setSortConfig({ field, order });
  };

  const sortedAndFilteredSubscriptions = [...subscriptions]
    .filter(subscription => {
      const searchLower = searchTerm.toLowerCase();
      return (
        subscription.name.toLowerCase().includes(searchLower) ||
        subscription.category.toLowerCase().includes(searchLower) ||
        subscription.status.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const order = sortConfig.order === 'asc' ? 1 : -1;
      
      switch (sortConfig.field) {
        case 'cost':
          return (a.cost - b.cost) * order;
        case 'startDate':
          return (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * order;
        case 'nextPayment':
          return (new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()) * order;
        default:
          return 0;
      }
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
            onSortClick={handleSort}
          />

          <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] overflow-hidden">
            <SubscriptionTable
              subscriptions={sortedAndFilteredSubscriptions}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={handleUpgradeModalClose}
      />
    </SubscriptionLayout>
  );
}