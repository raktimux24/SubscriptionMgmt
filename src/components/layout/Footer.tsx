import React from 'react';
import { CreditCard, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/subscriptease', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/subscriptease', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://facebook.com/subscriptease', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/subscriptease', label: 'Instagram' }
  ];

  return (
    <footer className="relative bg-[#0A0A0A] text-[#C0C0C0] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-tl from-[#00A6B2]/15 via-transparent to-[#6A4C93]/15 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <CreditCard className="h-8 w-8 text-[#00A6B2]" />
              <span className="ml-2 text-xl font-bold text-[#EAEAEA]">SubscriptEase</span>
            </div>
            <p className="text-sm">
            Manage, track, and optimize all your recurring payments effortlessly. 
            </p>
          </div>

          <div>
            <h3 className="text-[#EAEAEA] font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-[#00A6B2] transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-[#00A6B2] transition-colors">Pricing</a></li>
              <li><a href="#testimonials" className="hover:text-[#00A6B2] transition-colors">Testimonials</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#EAEAEA] font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#00A6B2] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#00A6B2] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#00A6B2] transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#EAEAEA] font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#00A6B2] transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-[#00A6B2] transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-[#00A6B2] transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            &copy; 2024 SubscriptEase. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00A6B2] transition-colors group"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}