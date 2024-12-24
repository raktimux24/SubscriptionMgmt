import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { CategorySelect } from './CategorySelect';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import { useNavigate } from 'react-router-dom';
import type { Subscription } from '../../lib/firebase/subscriptions';
import { useSubscriptionLimits } from '../../hooks/useSubscriptionLimits';
import { UpgradeModal } from './UpgradeModal';

interface SubscriptionFormData {
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'quarterly';
  category: string;
  startDate: string;
  description?: string;
  reminderDays: number;
}

interface SubscriptionFormProps {
  subscription?: Subscription;
  mode?: 'add' | 'edit';
}

export function SubscriptionForm({ subscription, mode = 'add' }: SubscriptionFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SubscriptionFormData>({
    defaultValues: mode === 'edit' && subscription ? {
      name: subscription.name,
      amount: subscription.amount,
      billingCycle: subscription.billingCycle,
      category: subscription.category,
      startDate: subscription.startDate,
      description: subscription.description || '',
      reminderDays: subscription.reminderDays
    } : undefined
  });

  const { addSubscription, updateSubscription } = useSubscriptions();
  const navigate = useNavigate();
  const { isAtLimit } = useSubscriptionLimits();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const onSubmit = async (data: SubscriptionFormData) => {
    if (mode === 'edit' && subscription) {
      const { error } = await updateSubscription(subscription.id, {
        ...data,
        nextPayment: calculateNextPayment(data.startDate, data.billingCycle)
      });
      if (!error) {
        navigate('/dashboard');
      }
    } else {
      if (isAtLimit) {
        setShowUpgradeModal(true);
        return;
      }
      
      const { error } = await addSubscription({
        ...data,
        status: 'active',
        nextPayment: calculateNextPayment(data.startDate, data.billingCycle)
      });
      if (!error) {
        navigate('/dashboard');
      }
    }
  };

  const calculateNextPayment = (startDate: string, billingCycle: string): string => {
    const date = new Date(startDate);
    const today = new Date();
    
    while (date < today) {
      switch (billingCycle) {
        case 'monthly':
          date.setMonth(date.getMonth() + 1);
          break;
        case 'yearly':
          date.setFullYear(date.getFullYear() + 1);
          break;
        case 'quarterly':
          date.setMonth(date.getMonth() + 3);
          break;
      }
    }
    
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2A2A2A]">
      <h2 className="text-lg font-semibold text-[#EAEAEA] mb-6">
        {mode === 'edit' ? 'Edit Subscription' : 'Subscription Details'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Subscription Name
            </label>
            <input
              type="text"
              {...register('name', { required: 'Subscription name is required' })}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] placeholder-[#6B7280] focus:outline-none focus:border-[#00A6B2]"
              placeholder="e.g., Netflix, Spotify"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]">
                $
              </span>
              <input
                type="number"
                step="0.01"
                {...register('amount', { 
                  required: 'Amount is required',
                  min: { value: 0, message: 'Amount must be positive' }
                })}
                className="w-full pl-8 pr-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] placeholder-[#6B7280] focus:outline-none focus:border-[#00A6B2]"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Billing Cycle
            </label>
            <select
              {...register('billingCycle', { required: 'Billing cycle is required' })}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
            >
              <option value="">Select billing cycle</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="quarterly">Quarterly</option>
            </select>
            {errors.billingCycle && (
              <p className="mt-1 text-sm text-red-500">{errors.billingCycle.message}</p>
            )}
          </div>

          <CategorySelect register={register} error={errors.category} />

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                className="w-full pl-10 pr-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
              Reminder (Days Before)
            </label>
            <input
              type="number"
              {...register('reminderDays', { 
                required: 'Reminder days is required',
                min: { value: 0, message: 'Must be 0 or more days' }
              })}
              className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] placeholder-[#6B7280] focus:outline-none focus:border-[#00A6B2]"
              placeholder="3"
            />
            {errors.reminderDays && (
              <p className="mt-1 text-sm text-red-500">{errors.reminderDays.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
            Description (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] placeholder-[#6B7280] focus:outline-none focus:border-[#00A6B2]"
            placeholder="Add any notes or details about this subscription..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 border border-[#2A2A2A] rounded-lg text-[#C0C0C0] hover:bg-[#2A2A2A] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#00A6B2] text-white rounded-lg hover:bg-[#008A94] transition-colors"
          >
            {mode === 'edit' ? 'Update Subscription' : 'Add Subscription'}
          </button>
        </div>
      </form>
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
    </div>
  );
}