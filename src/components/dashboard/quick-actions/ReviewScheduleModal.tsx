import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Calendar, Clock, Check } from 'lucide-react';
import { useReviewSchedule } from '../../../contexts/ReviewScheduleContext';

interface ReviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const weekOptions = [
  { value: 1, label: 'First' },
  { value: 2, label: 'Second' },
  { value: 3, label: 'Third' },
  { value: 4, label: 'Fourth' },
  { value: 5, label: 'Last' }
];

const dayOptions = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [
    { value: `${hour}:00`, label: `${hour}:00` },
    { value: `${hour}:30`, label: `${hour}:30` }
  ];
}).flat();

export function ReviewScheduleModal({ isOpen, onClose }: ReviewScheduleModalProps) {
  const { state, dispatch } = useReviewSchedule();
  const { schedule } = state;
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (!schedule.enabled) {
        await dispatch({ type: 'UPDATE_SCHEDULE', payload: {
          dayOfWeek: 1,
          weekOfMonth: 1,
          time: '09:00'
        }});
      }
      onClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    try {
      setIsLoading(true);
      await dispatch({ type: 'DISABLE_SCHEDULE' });
      onClose();
    } catch (error) {
      console.error('Error disabling schedule:', error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const formatNextReview = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <div className="relative bg-[#1A1A1A] rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-semibold text-[#EAEAEA]">
              Schedule Review
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-[#C0C0C0] hover:text-[#EAEAEA] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#00A6B2]" />
                <div>
                  <p className="text-[#EAEAEA] font-medium">Automatic Review</p>
                  <p className="text-sm text-[#C0C0C0]">
                    {schedule.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch({ 
                  type: schedule.enabled ? 'DISABLE_SCHEDULE' : 'UPDATE_SCHEDULE',
                  payload: schedule.enabled ? undefined : {}
                })}
                className={`p-2 rounded-full ${
                  schedule.enabled 
                    ? 'bg-[#00A6B2] text-white' 
                    : 'bg-[#363636] text-[#C0C0C0]'
                }`}
              >
                <Check className="h-4 w-4" />
              </button>
            </div>

            {schedule.enabled && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
                      Week of Month
                    </label>
                    <select
                      value={schedule.weekOfMonth}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_SCHEDULE',
                        payload: { weekOfMonth: Number(e.target.value) }
                      })}
                      className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
                    >
                      {weekOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} week
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
                      Day of Week
                    </label>
                    <select
                      value={schedule.dayOfWeek}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_SCHEDULE',
                        payload: { dayOfWeek: Number(e.target.value) }
                      })}
                      className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
                    >
                      {dayOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#EAEAEA] mb-2">
                      Time
                    </label>
                    <select
                      value={schedule.time}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_SCHEDULE',
                        payload: { time: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#EAEAEA] focus:outline-none focus:border-[#00A6B2]"
                    >
                      {timeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {schedule.nextReview && (
                  <div className="p-4 bg-[#2A2A2A] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#00A6B2]" />
                      <div>
                        <p className="text-[#EAEAEA] font-medium">Next Review</p>
                        <p className="text-sm text-[#C0C0C0]">
                          {formatNextReview(schedule.nextReview)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mt-6 flex justify-end gap-3">
              {schedule.enabled && (
                <button
                  onClick={handleDisable}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-[#FF4D4D] hover:text-[#FF6B6B] disabled:opacity-50"
                >
                  Disable
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium bg-[#00A6B2] text-white rounded-lg hover:bg-[#008C96] disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}