import React from 'react';
import { ArrowLeft, Edit2, AlertCircle, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Subscription } from '../../../lib/firebase/subscriptions';
import { useSubscriptions } from '../../../hooks/useSubscriptions';
import { DeleteSubscriptionModal } from '../DeleteSubscriptionModal';

interface SubscriptionDetailHeaderProps {
  subscription: Subscription;
}

export function SubscriptionDetailHeader({ subscription }: SubscriptionDetailHeaderProps) {
  const navigate = useNavigate();
  const { deleteSubscription } = useSubscriptions();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  return (
    <>
    <div>
      <Link 
        to="/dashboard" 
        className="inline-flex items-center text-[#C0C0C0] hover:text-[#00A6B2] transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Dashboard
      </Link>
      
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#EAEAEA]">{subscription.name}</h1>
          <p className="text-[#C0C0C0] mt-1">{subscription.category}</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
          <button
            onClick={() => navigate(`/edit-subscription/${subscription.id}`)}
            className="inline-flex items-center px-4 py-2 bg-[#2A2A2A] rounded-lg text-[#EAEAEA] hover:bg-[#363636] transition-colors"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Subscription
          </button>
          
          {subscription.status === 'active' && (
            <div className="flex items-center text-[#00A6B2]">
              <AlertCircle className="h-5 w-5 mr-2" />
              Next payment in {Math.ceil((new Date(subscription.nextPayment).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
            </div>
          )}
        </div>
      </div>
    </div>
    
    <DeleteSubscriptionModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      subscriptionId={subscription.id}
      subscriptionName={subscription.name}
    />
    </>
  );
}