import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter } from 'lucide-react';

export function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
          {/* Copyright and Made with love */}
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-6">
            <div className="flex items-center justify-center lg:justify-start space-x-1 text-sm text-[#C0C0C0]">
              <span> {currentYear} SubscriptionMaster.</span>
              <span className="hidden sm:inline">Made with</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span className="hidden sm:inline">in Bengaluru, India.</span>
            </div>
            
            {/* Links - First Group */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 sm:space-x-6 text-sm">
              <Link to="/terms" className="text-[#C0C0C0] hover:text-[#00A6B2] transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-[#C0C0C0] hover:text-[#00A6B2] transition-colors">
                Privacy
              </Link>
              <Link to="/help" className="text-[#C0C0C0] hover:text-[#00A6B2] transition-colors">
                Help Center
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center lg:justify-end space-x-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#C0C0C0] hover:text-[#00A6B2] transition-colors p-2 hover:bg-[#2A2A2A] rounded-lg"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#C0C0C0] hover:text-[#00A6B2] transition-colors p-2 hover:bg-[#2A2A2A] rounded-lg"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}