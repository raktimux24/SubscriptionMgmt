import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SubscriptionForm } from '../components/subscription/SubscriptionForm';
import { SubscriptionLayout } from '../components/subscription/SubscriptionLayout';
import { useSubscriptionLimits } from '../hooks/useSubscriptionLimits';
import { UpgradeModal } from '../components/subscription/UpgradeModal';

export function AddSubscription() {
  const navigate = useNavigate();
  const { isAtLimit, maxSubscriptions } = useSubscriptionLimits();
  const { id } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);

  useEffect(() => {
    // Immediately redirect to dashboard if at limit
    if (isAtLimit) {
      navigate('/dashboard');
    }
  }, [isAtLimit, navigate]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (id) {
        setLoading(true);
        const response = await fetch(`/api/subscriptions/${id}`);
        const data = await response.json();
        setSubscription(data);
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [id]);

  // Don't render anything if at limit (will redirect)
  if (isAtLimit) {
    return null;
  }

  if (loading) {
    return (
      <SubscriptionLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div>Loading...</div>
        </div>
      </SubscriptionLayout>
    );
  }

  return (
    <SubscriptionLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-[#C0C0C0] hover:text-[#00A6B2] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[#EAEAEA] mt-4">{id ? 'Edit Subscription' : 'Add New Subscription'}</h1>
          <p className="text-[#C0C0C0] mt-2">Enter the details of your subscription or import from supported providers.</p>
        </div>

        <div className="space-y-8">
          <SubscriptionForm subscription={subscription} />
          {/* <ImportOptions /> */}
        </div>
      </div>
    </SubscriptionLayout>
  );
}