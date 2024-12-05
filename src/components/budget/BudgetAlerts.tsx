import React, { useEffect, useCallback, useRef, useState } from 'react';
import { AlertTriangle, Bell, X } from 'lucide-react';
import { useBudget } from '../../contexts/BudgetContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useCategories } from '../../hooks/useCategories';
import { db, auth } from '../../lib/firebase/config';
import { calculateMonthlyAmount } from '../../utils/subscriptionCalculations';
import { useNotification } from '../../contexts/NotificationContext';

export function BudgetAlerts() {
  const { state: budgetState, dispatch: budgetDispatch } = useBudget();
  const { state: subscriptionState } = useSubscription();
  const { categories: firebaseCategories, loading: categoriesLoading } = useCategories();
  const { dispatch: notificationDispatch } = useNotification();
  const lastProcessedRef = useRef<Record<string, number>>({});

  const calculateMonthlySpend = async (categoryName: string) => {
    if (!auth.currentUser) return 0;

    console.log('\nCalculating spend for category:', categoryName);
    
    // Map category names
    const categoryMap: { [key: string]: string[] } = {
      'Games': ['Sports 1', 'Sports 2'],  // Map old Sports categories to Games
      'Entertainment': ['Entertainment'],
      'Software': ['Software']
    };

    const validCategories = categoryMap[categoryName] || [categoryName];
    console.log('Valid categories for', categoryName, ':', validCategories);
    
    const activeSubscriptions = subscriptionState.subscriptions
      .filter(sub => {
        const isValidCategory = validCategories.includes(sub.category);
        console.log(`Checking subscription:`, {
          name: sub.name,
          category: sub.category,
          matchesCategory: isValidCategory,
          status: sub.status,
          amount: sub.amount
        });
        return sub.status === 'active' && isValidCategory;
      });

    console.log(`Active subscriptions found for ${categoryName}:`, activeSubscriptions);

    const totalSpend = activeSubscriptions.reduce((total, sub) => {
      const amount = Number(sub.amount) || 0;
      const monthlyAmount = calculateMonthlyAmount(amount, sub.billingCycle);
      console.log(`Converting ${sub.name} amount: ${amount} (${sub.billingCycle}) to monthly: ${monthlyAmount}`);
      return total + monthlyAmount;
    }, 0);

    console.log(`Total monthly spend for ${categoryName}: $${totalSpend.toFixed(2)}`);
    return totalSpend;
  };

  // Helper function to determine alert type based on percentage
  const getAlertType = (percentageUsed: number): 'caution' | 'warning' | 'danger' | null => {
    if (percentageUsed >= 100) return 'danger';
    if (percentageUsed >= 90) return 'warning';
    if (percentageUsed >= 80) return 'caution';
    return null;
  };

  const generateAlert = (categoryName: string, budget: number, totalSpend: number) => {
    const percentageUsed = (totalSpend / budget) * 100;
    console.log(`${categoryName}: $${totalSpend.toFixed(2)} of $${budget.toFixed(2)} budget (${percentageUsed.toFixed(1)}%)`);
    
    const alertType = getAlertType(percentageUsed);
    if (!alertType) {
      console.log(`No alert needed for ${categoryName} - ${percentageUsed.toFixed(1)}% of budget used`);
      return null;
    }

    console.log(`Generating ${alertType} alert for ${categoryName} - ${percentageUsed.toFixed(1)}% of budget used`);
    
    const alert = {
      id: `${categoryName}-${alertType}-${Date.now()}`,
      category: categoryName,
      message: `${categoryName} category has reached ${percentageUsed.toFixed(1)}% of its monthly budget ($${totalSpend.toFixed(2)}/$${budget.toFixed(2)})`,
      type: alertType,
      timestamp: new Date()
    };

    // Trigger a notification
    const notificationId = `budget-${categoryName}-${Math.floor(percentageUsed)}`;
    notificationDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: notificationId,
        title: 'Budget Alert',
        message: alert.message,
        type: 'budget',
        timestamp: Date.now(),
        isRead: false,
        severity: alertType
      }
    });

    return alert;
  };

  const addAlert = useCallback((alert) => {
    console.log('Adding alert:', alert);
    budgetDispatch({ type: 'ADD_ALERT', payload: alert });
  }, [budgetDispatch]);

  useEffect(() => {
    const processAlerts = async () => {
      if (!firebaseCategories || firebaseCategories.length === 0) {
        console.log('Still loading categories...');
        return;
      }

      console.log('Processing categories for alerts:', firebaseCategories);
      
      const newAlerts = [];
      
      for (const category of firebaseCategories) {
        console.log('\nProcessing category:', category.name);
        const budget = Number(category.budget);
        console.log('Category budget:', budget);
        
        const totalSpend = await calculateMonthlySpend(category.name);
        console.log('Total monthly spend:', totalSpend.toFixed(2));
        console.log('Budget:', budget.toFixed(2));
        
        const alert = generateAlert(category.name, budget, totalSpend);
        if (alert) {
          newAlerts.push(alert);
        }
      }
      
      console.log('\nNew alerts generated:', newAlerts);
      // Add each alert individually
      newAlerts.forEach(alert => {
        budgetDispatch({ type: 'ADD_ALERT', payload: alert });
      });
    };

    processAlerts();
  }, [firebaseCategories, subscriptionState.subscriptions, budgetDispatch]);

  if (categoriesLoading) {
    return (
      <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2A2A2A]">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-[#00A6B2]" />
          <h2 className="text-lg font-semibold text-[#EAEAEA]">Loading Budget Alerts...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2A2A2A]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-[#00A6B2]" />
          <h2 className="text-lg font-semibold text-[#EAEAEA]">Budget Alerts</h2>
        </div>
        {budgetState.alerts.length > 0 && (
          <button 
            onClick={() => budgetDispatch({ type: 'CLEAR_ALL_ALERTS' })}
            className="text-[#C0C0C0] hover:text-[#EAEAEA] transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {budgetState.alerts.length > 0 ? (
          budgetState.alerts
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((alert) => (
              <div 
                key={alert.id}
                className={`flex items-start justify-between p-4 rounded-lg ${
                  alert.type === 'danger' ? 'bg-red-400/10' : 
                  alert.type === 'warning' ? 'bg-yellow-400/10' :
                  'bg-yellow-300/10'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.type === 'danger' ? 'text-red-400' : 
                    alert.type === 'warning' ? 'text-yellow-400' :
                    'text-yellow-300'
                  }`} />
                  <div>
                    <p className="text-[#EAEAEA] font-medium">{alert.category}</p>
                    <p className="text-sm text-[#C0C0C0]">{alert.message}</p>
                    <p className="text-xs text-[#808080] mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => budgetDispatch({ type: 'REMOVE_ALERT', payload: alert.id })}
                  className="text-[#C0C0C0] hover:text-[#EAEAEA] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))
        ) : (
          <p className="text-center text-[#C0C0C0] py-4">
            No budget alerts at the moment
          </p>
        )}
      </div>
    </div>
  );
}