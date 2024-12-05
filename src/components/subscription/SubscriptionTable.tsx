import React from 'react';
import { MoreVertical, Check, X } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { Subscription } from '../../lib/firebase/subscriptions';
import { DeleteSubscriptionModal } from './DeleteSubscriptionModal';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onStatusChange: (id: string, status: 'active' | 'inactive') => void;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionTable({
  subscriptions,
  onStatusChange,
  onEdit,
  onDelete
}: SubscriptionTableProps) {
  const navigate = useNavigate();
  const [deleteSubscription, setDeleteSubscription] = React.useState<Subscription | null>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#121212]">
            <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Cost</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Start Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Next Payment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#C0C0C0] uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2A2A2A]">
          {subscriptions.map((subscription) => (
            <tr key={subscription.id} className="hover:bg-[#2A2A2A]">
              <td className="px-6 py-4">
                <button 
                  onClick={() => navigate(`/subscription/${subscription.id}`)}
                  className="flex items-center hover:text-[#00A6B2] transition-colors"
                >
                  <div>
                    <div className="text-[#EAEAEA] font-medium text-left">{subscription.name}</div>
                    <div className="text-sm text-[#C0C0C0]">{subscription.billingCycle}</div>
                  </div>
                </button>
              </td>
              <td className="px-6 py-4 text-[#C0C0C0]">{subscription.category}</td>
              <td className="px-6 py-4 text-[#EAEAEA]">{formatCurrency(subscription.amount)}</td>
              <td className="px-6 py-4 text-[#C0C0C0]">{formatDate(subscription.startDate)}</td>
              <td className="px-6 py-4 text-[#C0C0C0]">{formatDate(subscription.nextPayment)}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  subscription.status === 'active' 
                    ? 'bg-green-400/10 text-green-400'
                    : 'bg-red-400/10 text-red-400'
                }`}>
                  {subscription.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="relative">
                  <Menu>
                    <Menu.Button className="p-1 rounded-full hover:bg-[#363636]">
                      <MoreVertical className="h-4 w-4 text-[#C0C0C0]" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md shadow-lg py-1 z-50">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate(`/subscription/${subscription.id}`)}
                            className={`${
                              active ? 'bg-[#2A2A2A]' : ''
                            } flex items-center w-full px-4 py-2 text-[#C0C0C0]`}
                          >
                            View Details
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onEdit(subscription)}
                            className={`${
                              active ? 'bg-[#2A2A2A]' : ''
                            } flex items-center w-full px-4 py-2 text-[#C0C0C0]`}
                          >
                            Edit
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onStatusChange(
                              subscription.id,
                              subscription.status === 'active' ? 'inactive' : 'active'
                            )}
                            className={`${
                              active ? 'bg-[#2A2A2A]' : ''
                            } flex items-center w-full px-4 py-2 text-[#C0C0C0]`}
                          >
                            {subscription.status === 'active' ? (
                              <>
                                <X className="h-4 w-4 mr-2 text-red-400" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2 text-green-400" />
                                Activate
                              </>
                            )}
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setDeleteSubscription(subscription)}
                            className={`${
                              active ? 'bg-[#2A2A2A]' : ''
                            } flex items-center w-full px-4 py-2 text-red-400`}
                          >
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {deleteSubscription && (
      <DeleteSubscriptionModal
        isOpen={!!deleteSubscription}
        onClose={() => setDeleteSubscription(null)}
        subscriptionId={deleteSubscription.id}
        subscriptionName={deleteSubscription.name}
      />
    )}
    </>
  );
}