import { Subscription } from '../contexts/SubscriptionContext';

export function calculateMonthlyAmount(amount: number, billingCycle: string): number {
  switch (billingCycle.toLowerCase()) {
    case 'yearly':
      return amount / 12;
    case 'quarterly':
      return amount / 3;
    case 'monthly':
      return amount;
    default:
      return amount;
  }
}

export function calculateTotalMonthlySpend(subscriptions: Subscription[]): number {
  return subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => {
      const amount = typeof sub.amount === 'string' ? parseFloat(sub.amount) : sub.amount;
      const monthlyAmount = calculateMonthlyAmount(amount, sub.billingCycle);
      return total + monthlyAmount;
    }, 0);
}

export function calculateUpcomingPayments(subscriptions: Subscription[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);
  sevenDaysFromNow.setHours(23, 59, 59, 999);

  return subscriptions.filter(sub => {
    if (sub.status !== 'active') return false;
    const paymentDate = new Date(sub.nextPayment);
    paymentDate.setHours(0, 0, 0, 0);
    return paymentDate >= today && paymentDate <= sevenDaysFromNow;
  }).length;
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

export function calculateMonthlySpendingHistory(subscriptions: Subscription[], monthsToShow: number = 12): MonthlySpending[] {
  const today = new Date();
  const result: MonthlySpending[] = [];

  // Initialize the last n months
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    result.push({
      month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      amount: 0
    });
  }

  subscriptions.forEach(subscription => {
    const startDate = new Date(subscription.startDate);
    const amount = typeof subscription.amount === 'string' ? parseFloat(subscription.amount) : subscription.amount;
    const monthlyAmount = calculateMonthlyAmount(amount, subscription.billingCycle);

    result.forEach((monthData, index) => {
      const [month, year] = monthData.month.split(' ');
      const monthIndex = new Date(Date.parse(`${month} 1 ${year}`)).getMonth();
      const currentDate = new Date(parseInt(year), monthIndex, 1);
      const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
      
      // Check if subscription was active during this month
      if (startDate <= currentDate && 
          (!endDate || endDate >= currentDate) && 
          (subscription.status === 'active' || 
           (subscription.status === 'cancelled' && endDate && endDate >= currentDate))) {
        monthData.amount += monthlyAmount;
      }
    });
  });

  return result;
}

export function calculateSpendingTrend(subscriptions: Subscription[]): {
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
} {
  const history = calculateMonthlySpendingHistory(subscriptions, 2);
  
  if (history.length < 2) {
    return { percentage: 0, trend: 'neutral' };
  }

  const currentMonth = history[history.length - 1].amount;
  const previousMonth = history[history.length - 2].amount;

  // Handle cases where both months are 0 or very close to 0
  if (Math.abs(currentMonth) < 0.01 && Math.abs(previousMonth) < 0.01) {
    return { percentage: 0, trend: 'neutral' };
  }

  // If previous month was 0, calculate percentage based on current month
  if (Math.abs(previousMonth) < 0.01) {
    return { 
      percentage: currentMonth > 0 ? 100 : 0,
      trend: currentMonth > 0 ? 'up' : 'neutral'
    };
  }

  const percentage = ((currentMonth - previousMonth) / previousMonth) * 100;
  const trend: 'up' | 'down' | 'neutral' = 
    Math.abs(percentage) < 0.01 ? 'neutral' :
    percentage > 0 ? 'up' : 'down';

  return {
    percentage: Math.abs(percentage),
    trend
  };
}

export function calculateProjectedAnnualSpend(subscriptions: Subscription[]): number {
  const today = new Date();
  let annualTotal = 0;

  subscriptions.forEach(subscription => {
    if (subscription.status !== 'active') return;

    const amount = typeof subscription.amount === 'string' ? parseFloat(subscription.amount) : subscription.amount;
    const monthlyAmount = calculateMonthlyAmount(amount, subscription.billingCycle);
    
    // Calculate months remaining until end date or 12 months
    const endDate = subscription.endDate ? new Date(subscription.endDate) : new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    const monthsRemaining = Math.min(
      12,
      Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30.44)))
    );

    annualTotal += monthlyAmount * monthsRemaining;
  });

  return annualTotal;
}

export function getUpcomingRenewals(subscriptions: Subscription[]): Subscription[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(23, 59, 59, 999);

  return subscriptions
    .filter(sub => {
      if (sub.status !== 'active') return false;
      const paymentDate = new Date(sub.nextPayment);
      paymentDate.setHours(0, 0, 0, 0);
      return paymentDate >= today && paymentDate <= thirtyDaysFromNow;
    })
    .sort((a, b) => new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime());
}

export function calculateNextPaymentDate(
  currentDate: Date | string,
  billingCycle: 'monthly' | 'yearly' | 'quarterly'
): Date {
  const date = new Date(currentDate);
  
  switch (billingCycle) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  
  return date;
}