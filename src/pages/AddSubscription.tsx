import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SubscriptionForm } from '../components/subscription/SubscriptionForm';
import { ImportOptions } from '../components/subscription/ImportOptions';
import { SubscriptionLayout } from '../components/subscription/SubscriptionLayout';

export function AddSubscription() {
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
          <h1 className="text-2xl font-bold text-[#EAEAEA] mt-4">Add New Subscription</h1>
          <p className="text-[#C0C0C0] mt-2">Enter the details of your subscription or import from supported providers.</p>
        </div>

        <div className="space-y-8">
          <SubscriptionForm />
          {/* <ImportOptions /> */}
        </div>
      </div>
    </SubscriptionLayout>
  );
}