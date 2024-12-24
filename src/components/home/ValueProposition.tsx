import React from 'react';
import { LayoutDashboard, PiggyBank, Bell, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: LayoutDashboard,
    title: 'Simplify Management',
    description: 'Keep all your subscriptions in one place with an intuitive dashboard.'
  },
  {
    icon: PiggyBank,
    title: 'Save Money',
    description: 'Identify and eliminate unnecessary costs with detailed spending analytics.'
  },
  {
    icon: Bell,
    title: 'Stay Informed',
    description: 'Receive smart reminders for upcoming payments to never miss a renewal.'
  },
  {
    icon: Shield,
    title: 'Secure and Reliable',
    description: 'Bank-level security ensures your data is always protected.'
  }
];

export function ValueProposition() {
  return (
    <section id="valueproposition" className="py-20 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#EAEAEA] mb-6">
            Why SubscriptEase?
          </h2>
          <p className="text-lg text-[#C0C0C0] max-w-[850px] mx-auto">
            SubscriptEase is your ultimate solution for managing recurring payments. Whether you're an individual juggling multiple personal subscriptions or a small business keeping track of essential tools, SubscriptEase provides the tools you need to stay organized and within budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              className="bg-[#212121] p-6 rounded-xl"
              whileHover={{ 
                y: -5,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.5,
                  delay: index * 0.1 
                }
              }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  className="w-16 h-16 bg-[#2A2A2A] rounded-full flex items-center justify-center mb-4"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <benefit.icon className="w-8 h-8 text-[#00A6B2]" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-[#C0C0C0]">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
