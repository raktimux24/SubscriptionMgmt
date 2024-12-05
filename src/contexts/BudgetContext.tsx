import React, { createContext, useReducer, useContext, Dispatch, ReactNode } from 'react';

export type AlertType = 'caution' | 'warning' | 'danger';

export interface BudgetAlert {
  id: string;
  category: string;
  message: string;
  type: AlertType;
  timestamp: number;
}

export interface Category {
  id?: string;
  name: string;
  budget: number;
  color?: string;
}

export interface BudgetState {
  categories: Category[];
  alerts: BudgetAlert[];
}

type BudgetAction = 
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_ALERT'; payload: BudgetAlert }
  | { type: 'REMOVE_ALERT'; payload: string }
  | { type: 'CLEAR_ALL_ALERTS' };

const initialState: BudgetState = {
  categories: [],
  alerts: []
};

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  console.log('Budget Reducer - Action:', action.type, action.payload);
  console.log('Budget Reducer - Current State:', state);

  switch (action.type) {
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.payload.id ? action.payload : category
        )
      };
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      };
    
    case 'ADD_ALERT': {
      // Create a new alert with the current timestamp
      const newAlert = {
        ...action.payload,
        timestamp: Date.now()
      };

      // Remove any existing alerts for the same category and type
      const filteredAlerts = state.alerts.filter(
        alert => !(alert.category === action.payload.category && alert.type === action.payload.type)
      );
      
      // Create new state with updated alerts
      const newState = {
        ...state,
        alerts: [...filteredAlerts, newAlert]
      };
      
      console.log('Adding alert:', newAlert);
      console.log('New state:', newState);
      
      return newState;
    }
    
    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload)
      };
    
    case 'CLEAR_ALL_ALERTS':
      return {
        ...state,
        alerts: []
      };
    
    default:
      return state;
  }
}

const BudgetContext = createContext<{
  state: BudgetState;
  dispatch: Dispatch<BudgetAction>;
} | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  // Debug state changes
  React.useEffect(() => {
    console.log('Budget state updated:', state);
  }, [state]);

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}