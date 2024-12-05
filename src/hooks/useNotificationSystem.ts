import { useEffect } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useBudget } from '../contexts/BudgetContext';
import { useNotification } from '../contexts/NotificationContext';
import { useReviewSchedule } from '../contexts/ReviewScheduleContext';

export function useNotificationSystem() {
  const { state: subscriptionState } = useSubscription();
  const { state: budgetState } = useBudget();
  const { state: reviewScheduleState } = useReviewSchedule();
  const { dispatch } = useNotification();

  // Check for upcoming payments
  useEffect(() => {
    subscriptionState.subscriptions.forEach(subscription => {
      if (subscription.status !== 'active') return;

      const nextPayment = new Date(subscription.nextPayment);
      const today = new Date();
      const daysUntilPayment = Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilPayment <= subscription.reminderDays && daysUntilPayment > 0) {
        const notificationId = `payment-${subscription.id}-${daysUntilPayment}`;
        
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: notificationId,
            title: 'Upcoming Payment',
            message: `Payment of $${subscription.amount} for ${subscription.name} is due in ${daysUntilPayment} days`,
            type: 'payment',
            timestamp: Date.now(),
            isRead: false,
            relatedId: subscription.id
          }
        });
      }
    });
  }, [subscriptionState.subscriptions]);

  // Check for renewals
  useEffect(() => {
    subscriptionState.subscriptions.forEach(subscription => {
      if (subscription.status !== 'active') return;

      const nextPayment = new Date(subscription.nextPayment);
      const today = new Date();
      const daysUntilRenewal = Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilRenewal <= 7 && subscription.billingCycle === 'yearly') {
        const notificationId = `renewal-${subscription.id}-${daysUntilRenewal}`;
        
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: notificationId,
            title: 'Annual Renewal',
            message: `${subscription.name} subscription will renew automatically in ${daysUntilRenewal} days`,
            type: 'renewal',
            timestamp: Date.now(),
            isRead: false,
            relatedId: subscription.id
          }
        });
      }
    });
  }, [subscriptionState.subscriptions]);

  // Monitor budget alerts
  useEffect(() => {
    budgetState.categories.forEach(category => {
      const categorySubscriptions = subscriptionState.subscriptions
        .filter(sub => sub.status === 'active' && sub.category === category.name);

      const spent = categorySubscriptions.reduce((total, sub) => {
        const amount = Number(sub.amount) || 0;
        return total + (
          sub.billingCycle === 'yearly' ? amount / 12 :
          sub.billingCycle === 'quarterly' ? amount / 3 :
          amount
        );
      }, 0);

      const budget = Number(category.budget) || 0;
      const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;

      if (percentageUsed >= 90) {
        const notificationId = `budget-${category.name}-${Math.floor(percentageUsed)}`;
        
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: notificationId,
            title: 'Budget Alert',
            message: percentageUsed >= 100
              ? `${category.name} category has exceeded its monthly budget`
              : `${category.name} category is approaching its monthly budget limit`,
            type: 'budget',
            timestamp: Date.now(),
            isRead: false
          }
        });
      }
    });
  }, [subscriptionState.subscriptions, budgetState.categories]);

  // Monitor cancellations
  useEffect(() => {
    subscriptionState.subscriptions.forEach(subscription => {
      if (subscription.status === 'inactive') {
        const notificationId = `cancellation-${subscription.id}-${Date.now()}`;
        
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: notificationId,
            title: 'Subscription Cancelled',
            message: `${subscription.name} subscription has been cancelled`,
            type: 'cancellation',
            timestamp: Date.now(),
            isRead: false,
            relatedId: subscription.id
          }
        });
      }
    });
  }, [subscriptionState.subscriptions]);

  // Monitor schedule reviews
  useEffect(() => {
    if (!reviewScheduleState.schedule.enabled || !reviewScheduleState.schedule.nextReview) return;

    const nextReview = new Date(reviewScheduleState.schedule.nextReview);
    const today = new Date();
    const daysUntilReview = Math.ceil((nextReview.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Notification for 5 days before review
    if (daysUntilReview === 5) {
      const notificationId = `review-upcoming-${nextReview.toISOString()}`;
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: notificationId,
          title: 'Upcoming Schedule Review',
          message: `Your subscription review is scheduled in 5 days on ${nextReview.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          })}`,
          type: 'review',
          timestamp: Date.now(),
          isRead: false
        }
      });
    }

    // Notification for review day
    if (daysUntilReview === 0) {
      const hoursDiff = Math.abs(nextReview.getHours() - today.getHours());
      const minutesDiff = Math.abs(nextReview.getMinutes() - today.getMinutes());
      
      if (hoursDiff === 0 && minutesDiff <= 5) {
        const notificationId = `review-now-${nextReview.toISOString()}`;
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: notificationId,
            title: 'Schedule Review Due',
            message: 'Your subscription review is due now. Take a moment to review your active subscriptions.',
            type: 'review',
            timestamp: Date.now(),
            isRead: false
          }
        });
      }
    }
  }, [reviewScheduleState.schedule, dispatch]);
}