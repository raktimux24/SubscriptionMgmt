import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSubscriptionDetail } from '../hooks/useSubscriptionDetail';
import { SubscriptionForm } from '../components/subscription/SubscriptionForm';
import { SubscriptionLayout } from '../components/subscription/SubscriptionLayout';
import { Loader } from 'lucide-react';

export function EditSubscription() {
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-[#C0C0C0] hover:text-[#00A6B2] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[#EAEAEA] mt-4">Edit Subscription</h1>
          <p className="text-[#C0C0C0] mt-2">Update the details of your subscription.</p>
        </div>

        <div className="space-y-8">
          <SubscriptionForm subscription={subscription} mode="edit" />
        </div>
      </div>
    </SubscriptionLayout>
  );
}