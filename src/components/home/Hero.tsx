import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative bg-[#121212] h-[90vh] flex items-center overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-tl from-[#00A6B2]/15 via-transparent to-[#6A4C93]/15 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-[#EAEAEA] mb-6 max-w-[850px] mx-auto">
            Take Control of Your Subscriptions with Ease
            <span className="inline-block ml-2">
              <Sparkles className="h-8 w-8 text-[#C5A900]" />
            </span>
          </h1>
          
          <p className="text-xl text-[#C0C0C0] max-w-[850px] mx-auto mb-8">
            Manage, track, and optimize all your recurring payments effortlessly. Join SubscriptEase today and simplify your financial life.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link 
              to="/signup"
              className="bg-[#00A6B2] text-white px-8 py-3 rounded-lg hover:bg-[#008A94] transition-colors flex items-center justify-center"
            >
              Get Early Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button 
              className="border border-[#2A2A2A] text-[#EAEAEA] px-8 py-3 rounded-lg hover:bg-[#2A2A2A] transition-colors"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </button>
          </div>

          
        </div>
      </div>
    </div>
  );
}