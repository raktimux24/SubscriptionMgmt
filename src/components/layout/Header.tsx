import React, { useEffect } from 'react';
import { Menu, X, CreditCard, Heart, Club } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user } = useAuthStore();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      const button = document.getElementById('menu-button');
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

  return (
    <header className="fixed w-full bg-[#121212]/95 backdrop-blur-sm z-50 border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <Club className="h-8 w-8 text-[#00A6B2]" />
            <span className="ml-2 text-xl font-bold text-[#EAEAEA] whitespace-nowrap">SubscriptEase</span>
          </Link>
          
          <nav className="hidden lg:flex space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-[#C0C0C0] hover:text-[#00A6B2] transition-colors">Dashboard</Link>
                <Link to="/subscriptions" className="text-[#C0C0C0] hover:text-[#00A6B2] transition-colors">Subscriptions</Link>
                <Link to="/budget" className="text-[#C0C0C0] hover:text-[#00A6B2] transition-colors">Budget</Link>
              </>
            ) : (
              <>
                <a href="#features" className="text-[#C0C0C0] hover:text-[#00A6B2] transition-colors">Features</a>
                
                <a href="#testimonials" className="text-[#C0C0C0] hover:text-[#00A6B2] transition-colors">Testimonials</a>
              </>
            )}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <Link 
                to="/profile" 
                className="bg-[#00A6B2] text-white px-4 py-2 rounded-lg hover:bg-[#008A94] transition-colors"
              >
                Profile
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-[#EAEAEA] hover:text-[#00A6B2] transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-[#00A6B2] text-white px-4 py-2 rounded-lg hover:bg-[#008A94] transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button 
            id="menu-button"
            className="lg:hidden text-[#EAEAEA] p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        id="mobile-menu"
        className={`absolute top-full left-0 right-0 z-50 lg:hidden bg-[#0A0A0A] border-t border-[#2A2A2A] ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <nav className="py-4 px-6">
          {user ? (
            <div className="space-y-3">
              <Link 
                to="/dashboard" 
                className="block px-4 py-2 text-[#C0C0C0] hover:text-[#00A6B2] hover:bg-[#1A1A1A] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/subscriptions" 
                className="block px-4 py-2 text-[#C0C0C0] hover:text-[#00A6B2] hover:bg-[#1A1A1A] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Subscriptions
              </Link>
              <Link 
                to="/budget" 
                className="block px-4 py-2 text-[#C0C0C0] hover:text-[#00A6B2] hover:bg-[#1A1A1A] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Budget
              </Link>
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-[#EAEAEA] bg-[#00A6B2] hover:bg-[#008A94] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <a 
                href="#features" 
                className="block px-4 py-2 text-[#C0C0C0] hover:text-[#00A6B2] hover:bg-[#1A1A1A] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#testimonials" 
                className="block px-4 py-2 text-[#C0C0C0] hover:text-[#00A6B2] hover:bg-[#1A1A1A] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <Link 
                to="/login" 
                className="block px-4 py-2 text-[#EAEAEA] hover:text-[#00A6B2] hover:bg-[#1A1A1A] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="block px-4 py-2 text-[#EAEAEA] bg-[#00A6B2] hover:bg-[#008A94] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}