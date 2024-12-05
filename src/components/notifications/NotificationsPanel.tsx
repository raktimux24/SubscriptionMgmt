import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Bell, Check, Trash2 } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { state, dispatch } = useNotification();
  const navigate = useNavigate();

  const handleMarkAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  const handleNotificationClick = (notification: any) => {
    dispatch({ type: 'MARK_AS_READ', payload: notification.id });
    
    if (notification.relatedId) {
      switch (notification.type) {
        case 'payment':
        case 'renewal':
          navigate(`/subscription/${notification.relatedId}`);
          break;
        case 'budget':
          navigate('/budget');
          break;
        case 'cancellation':
          navigate('/subscriptions');
          break;
      }
      onClose();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return diffInHours === 0 
        ? 'Just now'
        : `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed top-16 right-4 sm:right-6 w-full sm:max-w-md">
          <div className="bg-[#1A1A1A] rounded-lg shadow-xl max-h-[calc(100vh-5rem)] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-[#00A6B2]" />
                <Dialog.Title className="text-lg font-semibold text-[#EAEAEA]">
                  Notifications
                </Dialog.Title>
                {state.unreadCount > 0 && (
                  <span className="px-2 py-1 text-xs font-medium bg-[#00A6B2] text-white rounded-full">
                    {state.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {state.notifications.length > 0 && (
                  <>
                    <button
                      onClick={handleMarkAllAsRead}
                      className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                    >
                      <Check className="h-4 w-4 text-[#C0C0C0]" />
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-[#C0C0C0]" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-[#C0C0C0]" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto">
              {state.notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-[#2A2A2A] mx-auto mb-4" />
                  <p className="text-[#C0C0C0]">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[#2A2A2A]">
                  {state.notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left p-6 hover:bg-[#2A2A2A] transition-colors ${
                        !notification.isRead ? 'bg-[#121212]' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-medium ${
                          notification.isRead ? 'text-[#EAEAEA]' : 'text-[#00A6B2]'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-[#C0C0C0] ml-4">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-[#C0C0C0]">{notification.message}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}