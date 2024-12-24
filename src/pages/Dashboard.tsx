import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardFooter } from '../components/dashboard/DashboardFooter';
import { SummaryWidgets } from '../components/dashboard/SummaryWidgets';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { SubscriptionList } from '../components/dashboard/SubscriptionList';
import { QuickActions } from '../components/dashboard/QuickActions';
import { Plus } from 'lucide-react';
import { useSubscriptionLimits } from '../hooks/useSubscriptionLimits';
import toast from 'react-hot-toast';

export function Dashboard() {
  const navigate = useNavigate();
  const { isAtLimit, canAddMore, activeCount, maxSubscriptions } = useSubscriptionLimits();

  const handleAddSubscription = () => {
    if (!canAddMore) {
      toast.error(`Free users can only add up to ${maxSubscriptions} subscriptions. Please upgrade to Pro for unlimited subscriptions.`);
      return;
    }
    navigate('/add-subscription');
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00A6B2]/5 via-transparent to-[#6A4C93]/5 pointer-events-none" />
      
      <div className="relative flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-[#EAEAEA]">Dashboard Overview</h1>
            <div className="w-full sm:w-auto flex flex-col items-end gap-2">
              <button 
                onClick={handleAddSubscription}
                disabled={isAtLimit}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#00A6B2] text-white rounded-lg hover:bg-[#008A94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                Add Subscription
              </button>
              {isAtLimit && (
                <p className="text-sm text-[#C0C0C0]">
                  {`You have reached the limit (${activeCount}/${maxSubscriptions}). Upgrade to Pro for unlimited subscriptions.`}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <SummaryWidgets />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="lg:col-span-2 w-full overflow-x-auto">
                <SpendingChart />
              </div>
              <div className="w-full">
                <QuickActions />
              </div>
            </div>

            <SubscriptionList />
          </div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
}