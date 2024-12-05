import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  calculateTotalMonthlySpend,
  calculateUpcomingPayments,
} from '../utils/subscriptionCalculations';
import { subscribeToSubscriptions } from '../lib/firebase/subscriptions';

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
        activeSubscriptions: action.payload.filter(sub => sub.status === 'active').length,
        isLoading: false
      };
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      };
    }

    case 'ADD_SUBSCRIPTION': {
      const newSubscriptions = [...state.subscriptions, action.payload];
      return {
        ...state,
        subscriptions: newSubscriptions,
        totalMonthlySpend: calculateTotalMonthlySpend(newSubscriptions),
        upcomingPayments: calculateUpcomingPayments(newSubscriptions),
        activeSubscriptions: newSubscriptions.filter(sub => sub.status === 'active').length
      };
    }
    
    case 'UPDATE_SUBSCRIPTION': {
      const updatedSubscriptions = state.subscriptions.map(sub =>
        sub.id === action.payload.id ? action.payload : sub
      );
      return {
        ...state,
        subscriptions: updatedSubscriptions,
        totalMonthlySpend: calculateTotalMonthlySpend(updatedSubscriptions),
        upcomingPayments: calculateUpcomingPayments(updatedSubscriptions),
        activeSubscriptions: updatedSubscriptions.filter(sub => sub.status === 'active').length
      };
    }

    case 'DELETE_SUBSCRIPTION': {
      const remainingSubscriptions = state.subscriptions.filter(
        sub => sub.id !== action.payload
      );
      return {
        ...state,
        subscriptions: remainingSubscriptions,
        totalMonthlySpend: calculateTotalMonthlySpend(remainingSubscriptions),
        upcomingPayments: calculateUpcomingPayments(remainingSubscriptions),
        activeSubscriptions: remainingSubscriptions.filter(sub => sub.status === 'active').length
      };
    }

    case 'SET_STATUS': {
      const updatedSubscriptions = state.subscriptions.map(sub =>
        sub.id === action.payload.id
          ? { ...sub, status: action.payload.status }
          : sub
      );
      return {
        ...state,
        subscriptions: updatedSubscriptions,
        totalMonthlySpend: calculateTotalMonthlySpend(updatedSubscriptions),
        upcomingPayments: calculateUpcomingPayments(updatedSubscriptions),
        activeSubscriptions: updatedSubscriptions.filter(sub => sub.status === 'active').length
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

  useEffect(() => {
    const unsubscribe = subscribeToSubscriptions((subscriptions) => {
      dispatch({ type: 'SET_SUBSCRIPTIONS', payload: subscriptions });
    });

    return () => unsubscribe();
  }, []);

  return (
    <SubscriptionContext.Provider value={{ state, dispatch }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}