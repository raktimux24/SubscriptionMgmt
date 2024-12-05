import React, { useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, CreditCard, Menu as MenuIcon, X } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { NotificationsPanel } from '../notifications/NotificationsPanel';
import { useHeaderProfile } from '../../hooks/useHeaderProfile';

export function DashboardHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = React.useState(false);
  const { state: notificationState } = useNotification();
  const { profile, handleLogout } = useHeaderProfile();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('dashboard-mobile-menu');
      const button = document.getElementById('dashboard-menu-button');
      if (menu && !menu.contains(event.target as Node) && 
          button && !button.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClassName = (path: string, isMobile: boolean = false) => {
    const baseClasses = isActive(path) 
      ? 'text-[#00A6B2]' 
      : 'text-[#C0C0C0] hover:text-[#00A6B2]';
    return isMobile
      ? `block py-2 ${baseClasses} transition-colors`
      : `${baseClasses} transition-colors`;
  };

  const getMenuItemClassName = (active: boolean) => {
    return `${active ? 'bg-[#2A2A2A]' : ''} flex items-center w-full px-4 py-2 text-[#C0C0C0] hover:text-[#00A6B2] transition-colors`;
  };

  return (
    <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] py-4 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center">
              <CreditCard className="h-8 w-8 text-[#00A6B2]" />
              <span className="ml-2 text-xl font-bold text-[#EAEAEA] whitespace-nowrap">SubscriptionMaster</span>
            </Link>
            <nav className="hidden lg:flex space-x-6">
              <Link to="/dashboard" className={getLinkClassName('/dashboard')}>
                Overview
              </Link>
              <Link to="/subscriptions" className={getLinkClassName('/subscriptions')}>
                Subscriptions
              </Link>
              <Link to="/budget" className={getLinkClassName('/budget')}>
                Budget
              </Link>
              <Link to="/categories" className={getLinkClassName('/categories')}>
                Categories
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button 
              onClick={() => setIsNotificationsPanelOpen(true)}
              className="relative text-[#C0C0C0] hover:text-[#00A6B2] transition-colors"
            >
              <Bell className="h-5 w-5" />
              {notificationState.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center bg-[#00A6B2] text-white rounded-full">
                  {notificationState.unreadCount}
                </span>
              )}
            </button>
            
            {/* Avatar Menu - Desktop */}
            <Menu as="div" className="relative hidden lg:block">
              <Menu.Button className="flex items-center space-x-2">
                <img
                  src={profile?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80"}
                  alt={profile?.name || "Profile"}
                  className="h-8 w-8 rounded-full object-cover border-2 border-transparent hover:border-[#00A6B2] transition-colors"
                />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-lg py-1 z-10">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={`flex items-center px-4 py-2 text-sm ${
                        active ? 'bg-[#2A2A2A] text-[#00A6B2]' : 'text-[#C0C0C0]'
                      } transition-colors`}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? 'bg-[#2A2A2A] text-[#00A6B2]' : 'text-[#C0C0C0]'
                      } transition-colors`}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
            
            {/* Mobile menu button */}
            <button
              id="dashboard-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-[#C0C0C0] hover:text-[#00A6B2] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="dashboard-mobile-menu"
        className={`fixed inset-0 bg-[#121212] z-50 lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        }`}
        style={{ top: '73px' }}
      >
        <div className="h-full flex flex-col">
          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-6">
            {[
              { to: '/dashboard', label: 'Overview' },
              { to: '/subscriptions', label: 'Subscriptions' },
              { to: '/budget', label: 'Budget' },
              { to: '/categories', label: 'Categories' }
            ].map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={`block text-lg font-medium ${getLinkClassName(link.to, true)}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="px-4 py-4 border-t border-[#2A2A2A] bg-[#1A1A1A]">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={profile?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=32&h=32&q=80"}
                alt={profile?.name || "Profile"}
                className="h-10 w-10 rounded-full object-cover border-2 border-[#2A2A2A]"
              />
              <div>
                <div className="text-[#EAEAEA] font-medium">
                  {profile?.name || "User"}
                </div>
                <div className="text-sm text-[#C0C0C0]">
                  {profile?.email || "user@example.com"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/settings');
                }}
                className="flex items-center w-full px-3 py-2 text-[#C0C0C0] hover:text-[#00A6B2] hover:bg-[#2A2A2A] rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center w-full px-3 py-2 text-[#C0C0C0] hover:text-[#00A6B2] hover:bg-[#2A2A2A] rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <NotificationsPanel
        isOpen={isNotificationsPanelOpen}
        onClose={() => setIsNotificationsPanelOpen(false)}
      />
    </header>
  );
}