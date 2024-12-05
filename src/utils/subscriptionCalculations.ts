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
    if (subscription.status !== 'active') return;

    const startDate = new Date(subscription.startDate);
    const amount = typeof subscription.amount === 'string' ? parseFloat(subscription.amount) : subscription.amount;
    const monthlyAmount = calculateMonthlyAmount(amount, subscription.billingCycle);

    result.forEach((monthData, index) => {
      const [month, year] = monthData.month.split(' ');
      const currentDate = new Date(parseInt(year), new Date(Date.parse(month + " 1, 2000")).getMonth(), 1);
      
      if (startDate <= currentDate) {
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

  if (previousMonth === 0) {
    return { percentage: 100, trend: 'up' };
  }

  const percentage = ((currentMonth - previousMonth) / previousMonth) * 100;
  const trend: 'up' | 'down' | 'neutral' = 
    percentage > 0 ? 'up' : 
    percentage < 0 ? 'down' : 
    'neutral';

  return {
    percentage: Math.abs(percentage),
    trend
  };
}

export function calculateProjectedAnnualSpend(subscriptions: Subscription[]): number {
  const monthlyTotal = calculateTotalMonthlySpend(subscriptions);
  return monthlyTotal * 12;
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