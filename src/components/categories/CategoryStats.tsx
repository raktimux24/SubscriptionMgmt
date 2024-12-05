import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useCategories } from '../../hooks/useCategories';

export function CategoryStats() {
  const { categories, loading } = useCategories();

  // Add null check and default to empty array
  const validCategories = categories || [];
  const totalBudget = validCategories.reduce((total, category) => total + (category.budget || 0), 0);

  const data = validCategories
    .filter(category => category.budget > 0)
    .map(category => ({
      name: category.name,
      value: category.budget || 0,
      color: category.color || '#8884d8',
      percentage: totalBudget > 0 ? ((category.budget / totalBudget) * 100).toFixed(1) : '0'
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#2A2A2A] p-2 rounded shadow-lg border border-[#3A3A3A]">
          <p className="text-[#EAEAEA]">{`${data.name}`}</p>
          <p className="text-[#EAEAEA]">{`Budget: $${data.value.toFixed(2)}`}</p>
          <p className="text-[#EAEAEA]">{`${data.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-6">
        <h2 className="text-lg font-semibold text-[#EAEAEA] mb-2">Budget Distribution</h2>
        <p className="text-sm text-[#999999]">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-6">
        <h2 className="text-lg font-semibold text-[#EAEAEA] mb-2">Budget Distribution</h2>
        <p className="text-sm text-[#999999]">No categories with budget found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-6">
      <h2 className="text-lg font-semibold text-[#EAEAEA] mb-2">Budget Distribution</h2>
      <p className="text-sm text-[#999999] mb-6">Total Budget: ${typeof totalBudget === 'number' ? totalBudget.toFixed(2) : '0.00'}</p>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              fill="#8884d8"
              label={({ name, percentage }) => 
                `${name} ${percentage}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}