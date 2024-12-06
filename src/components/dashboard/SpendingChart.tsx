import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { calculateMonthlySpendingHistory, calculateProjectedAnnualSpend, calculateSpendingTrend } from '../../utils/subscriptionCalculations';
import { TrendingUp, TrendingDown, Minus, DollarSign, Calendar } from 'lucide-react';

export function SpendingChart() {
  const { state } = useSubscription();
  const data = calculateMonthlySpendingHistory(state.subscriptions, 6);
  const trend = calculateSpendingTrend(state.subscriptions);
  const projectedAnnual = calculateProjectedAnnualSpend(state.subscriptions);

  console.log('Spending data:', data); // Debug log

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3">
          <p className="text-[#EAEAEA] font-medium">{label}</p>
          <p className="text-[#00A6B2]">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4 sm:p-5 md:p-6 border border-[#2A2A2A]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-[#EAEAEA]">Monthly Spending Trend</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#888888]">Projected Annual:</span>
          <span className="text-[#EAEAEA] font-medium">${projectedAnnual.toFixed(2)}</span>
        </div>
      </div>

      <div className="h-[250px] sm:h-[300px] w-full min-w-[300px]">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A6B2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00A6B2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="#2A2A2A"
              />
              <XAxis 
                dataKey="month" 
                stroke="#666666" 
                fontSize={12}
                tickMargin={10}
                axisLine={{ stroke: '#2A2A2A' }}
                tick={{ fill: '#888888' }}
              />
              <YAxis
                stroke="#666666"
                fontSize={12}
                tickMargin={10}
                axisLine={{ stroke: '#2A2A2A' }}
                tick={{ fill: '#888888' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#00A6B2"
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-[#666666]">
            No spending data available
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#121212] p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#2A2A2A]">
              {trend.trend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-red-400" />
              ) : trend.trend === 'down' ? (
                <TrendingDown className="h-5 w-5 text-green-400" />
              ) : (
                <Minus className="h-5 w-5 text-[#C0C0C0]" />
              )}
            </div>
            <div>
              <p className="text-[#C0C0C0] text-sm">Monthly Trend</p>
              <p className="text-[#EAEAEA] font-medium">
                {trend.percentage.toFixed(1)}% {trend.trend === 'up' ? 'Increase' : trend.trend === 'down' ? 'Decrease' : 'No Change'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#121212] p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#2A2A2A]">
              <DollarSign className="h-5 w-5 text-[#00A6B2]" />
            </div>
            <div>
              <p className="text-[#C0C0C0] text-sm">Current Monthly</p>
              <p className="text-[#EAEAEA] font-medium">
                ${data[data.length - 1].amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#121212] p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#2A2A2A]">
              <Calendar className="h-5 w-5 text-[#00A6B2]" />
            </div>
            <div>
              <p className="text-[#C0C0C0] text-sm">Projected Annual</p>
              <p className="text-[#EAEAEA] font-medium">
                ${projectedAnnual.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}