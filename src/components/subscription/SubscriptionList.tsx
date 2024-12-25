import React, { useState } from 'react';
import { SubscriptionListHeader } from './SubscriptionListHeader';
import { Subscription } from '../../types/subscription';

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

export function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: string; order: string }>({
    field: 'cost',
    order: 'asc',
  });

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
      {/* Subscription items will be rendered here */}
    </div>
  );
}
