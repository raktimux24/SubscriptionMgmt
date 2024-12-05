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
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00A6B2]/5 via-transparent to-[#6A4C93]/5 pointer-events-none" />
      
      <div className="relative flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#EAEAEA]">Dashboard Overview</h1>
            <button 
              onClick={handleAddSubscription}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00A6B2] text-white rounded-lg hover:bg-[#008A94] transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Subscription</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Summary Widgets */}
            <SummaryWidgets />
            
            {/* Charts and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions - Shown first on mobile */}
              <div className="order-1 lg:order-2">
                <QuickActions />
              </div>
              {/* Spending Chart */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <SpendingChart />
              </div>
            </div>

            {/* Subscription List */}
            <div className="rounded-lg overflow-hidden">
              <SubscriptionList />
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
}