import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SubscriptionLayout } from '../components/subscription/SubscriptionLayout';
import { SubscriptionDetailHeader } from '../components/subscription/detail/SubscriptionDetailHeader';
import { SubscriptionInfo } from '../components/subscription/detail/SubscriptionInfo';
import { useSubscriptionDetail } from '../hooks/useSubscriptionDetail';
import { Loader } from 'lucide-react';

export function SubscriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subscription, loading, error } = useSubscriptionDetail(id!);

  useEffect(() => {
    if (error) {
      navigate('/dashboard');
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <SubscriptionLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader className="h-8 w-8 text-[#00A6B2] animate-spin" />
        </div>
      </SubscriptionLayout>
    );
  }

  if (!subscription || error) {
    navigate('/dashboard');
    return null;
  }

  return (
    <SubscriptionLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <SubscriptionDetailHeader subscription={subscription} />
        <div className="mt-8">
            <SubscriptionInfo subscription={subscription} />
        </div>
      </div>
    </SubscriptionLayout>
  );
}