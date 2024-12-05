import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardFooter } from '../components/dashboard/DashboardFooter';
import { SummaryWidgets } from '../components/dashboard/SummaryWidgets';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { SubscriptionList } from '../components/dashboard/SubscriptionList';
import { QuickActions } from '../components/dashboard/QuickActions';
import { Plus } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();

  const handleAddSubscription = () => {
    navigate('/add-subscription');
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00A6B2]/5 via-transparent to-[#6A4C93]/5 pointer-events-none" />
      
      <div className="relative flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-[#EAEAEA]">Dashboard Overview</h1>
            <button 
              onClick={handleAddSubscription}
              className="flex items-center gap-2 px-4 py-2 bg-[#00A6B2] text-white rounded-lg hover:bg-[#008A94] transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Subscription
            </button>
          </div>

          <div className="space-y-8">
            <SummaryWidgets />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <SpendingChart />
              </div>
              <div>
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