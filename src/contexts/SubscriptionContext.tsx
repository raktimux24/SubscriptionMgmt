import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  calculateTotalMonthlySpend,
  calculateUpcomingPayments,
} from '../utils/subscriptionCalculations';
import { subscribeToUserSubscriptions } from '../lib/firebase/subscriptions';
import { useAuthStore } from '../stores/authStore';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'quarterly';
  category: string;
  startDate: string;
  description?: string;
  reminderDays: number;
  status: 'active' | 'inactive';
  nextPayment: string;
}

interface SubscriptionState {
  subscriptions: Subscription[];
  totalMonthlySpend: number;
  upcomingPayments: number;
  activeSubscriptions: number;
  isLoading: boolean;
}

type SubscriptionAction =
  | { type: 'SET_SUBSCRIPTIONS'; payload: Subscription[] }
  | { type: 'ADD_SUBSCRIPTION'; payload: Subscription }
  | { type: 'UPDATE_SUBSCRIPTION'; payload: Subscription }
  | { type: 'DELETE_SUBSCRIPTION'; payload: string }
  | { type: 'SET_STATUS'; payload: { id: string; status: 'active' | 'inactive' } }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: SubscriptionState = {
  subscriptions: [],
  totalMonthlySpend: 0,
  upcomingPayments: 0,
  activeSubscriptions: 0,
  isLoading: true
};

function subscriptionReducer(state: SubscriptionState, action: SubscriptionAction): SubscriptionState {
  switch (action.type) {
    case 'SET_SUBSCRIPTIONS': {
      return {
        ...state,
        subscriptions: action.payload,
        totalMonthlySpend: calculateTotalMonthlySpend(action.payload),
        upcomingPayments: calculateUpcomingPayments(action.payload),
        activeSubscriptions: action.payload.filter(s => s.status === 'active').length,
        isLoading: false
      };
    }
    case 'ADD_SUBSCRIPTION': {
      const newSubscriptions = [...state.subscriptions, action.payload];
      return {
        ...state,
        subscriptions: newSubscriptions,
        totalMonthlySpend: calculateTotalMonthlySpend(newSubscriptions),
        upcomingPayments: calculateUpcomingPayments(newSubscriptions),
        activeSubscriptions: newSubscriptions.filter(s => s.status === 'active').length
      };
    }
    case 'UPDATE_SUBSCRIPTION': {
      const newSubscriptions = state.subscriptions.map(subscription =>
        subscription.id === action.payload.id ? action.payload : subscription
      );
      return {
        ...state,
        subscriptions: newSubscriptions,
        totalMonthlySpend: calculateTotalMonthlySpend(newSubscriptions),
        upcomingPayments: calculateUpcomingPayments(newSubscriptions),
        activeSubscriptions: newSubscriptions.filter(s => s.status === 'active').length
      };
    }
    case 'DELETE_SUBSCRIPTION': {
      const newSubscriptions = state.subscriptions.filter(
        subscription => subscription.id !== action.payload
      );
      return {
        ...state,
        subscriptions: newSubscriptions,
        totalMonthlySpend: calculateTotalMonthlySpend(newSubscriptions),
        upcomingPayments: calculateUpcomingPayments(newSubscriptions),
        activeSubscriptions: newSubscriptions.filter(s => s.status === 'active').length
      };
    }
    case 'SET_STATUS': {
      const newSubscriptions = state.subscriptions.map(subscription =>
        subscription.id === action.payload.id
          ? { ...subscription, status: action.payload.status }
          : subscription
      );
      return {
        ...state,
        subscriptions: newSubscriptions,
        totalMonthlySpend: calculateTotalMonthlySpend(newSubscriptions),
        upcomingPayments: calculateUpcomingPayments(newSubscriptions),
        activeSubscriptions: newSubscriptions.filter(s => s.status === 'active').length
      };
    }
    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      };
    }
    default:
      return state;
  }
}

const SubscriptionContext = createContext<{
  state: SubscriptionState;
  dispatch: React.Dispatch<SubscriptionAction>;
} | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.uid) {
      dispatch({ type: 'SET_SUBSCRIPTIONS', payload: [] });
      return;
    }

    const unsubscribe = subscribeToUserSubscriptions(user.uid, {
      next: (subscriptions) => {
        dispatch({ type: 'SET_SUBSCRIPTIONS', payload: subscriptions });
      },
      error: (error) => {
        console.error('Error in subscription context:', error);
        dispatch({ type: 'SET_SUBSCRIPTIONS', payload: [] });
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <SubscriptionContext.Provider value={{ state, dispatch }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}