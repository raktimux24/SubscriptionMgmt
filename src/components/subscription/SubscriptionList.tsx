import React, { useState } from 'react';
import { SubscriptionListHeader } from './SubscriptionListHeader';
import { Subscription } from '../../types/subscription';
import { useNavigate } from 'react-router-dom';

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

export function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: string; order: string }>({
    field: 'cost',
    order: 'asc',
  });
  const navigate = useNavigate();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSort = (field: string, order: string) => {
    setSortConfig({ field, order });
  };

  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
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

  const filteredSubscriptions = sortedSubscriptions.filter((subscription) =>
    subscription.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <SubscriptionListHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSortClick={handleSort}
      />
      {/* Render subscription items */}
      <div className="space-y-4">
        {filteredSubscriptions.map(subscription => (
          <div key={subscription.id} className="flex justify-between items-center border-b border-gray-300 py-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{subscription.name}</h2>
              <p className="text-sm text-gray-600">Cost: ${subscription.cost}</p>
              <p className="text-sm text-gray-600">Next Payment: {subscription.nextPaymentDate}</p>
            </div>
            <button
              onClick={() => navigate(`/edit-subscription/${subscription.id}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
