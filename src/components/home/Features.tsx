import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ListTodo,
  Wallet,
  FolderKanban,
  PlusCircle,
  ArrowRight,
  LineChart,
  Calendar,
  Activity,
  MousePointerClick,
  ListChecks,
  Clock,
  Tag,
  AlertCircle,
  PieChart,
  Palette,
  BellRing,
  ClipboardList
} from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  details: {
    title: string;
    items: string[];
  }[];
}

const features: Feature[] = [
  {
    icon: <LayoutDashboard className="h-6 w-6 text-[#00A6B2]" />,
    title: "Dashboard Overview",
    description: "Get a clear snapshot of your subscription landscape with real-time insights.",
    details: [
      {
        title: "Key Features",
        items: [
          "Monthly Subscription Total: See your total monthly spending at a glance",
          "Upcoming Due Dates: Stay ahead with alerts for payments due in the next seven days",
          "Active Subscriptions: Keep track of all your ongoing services effortlessly",
          "Spending Trend Graph: Visualize your subscription costs over time",
          "Quick Actions: Easily manage subscriptions and schedule reviews"
        ]
      }
    ]
  },
  {
    icon: <ListTodo className="h-6 w-6 text-[#C5A900]" />,
    title: "Subscription Management",
    description: "Organize your subscriptions with ease.",
    details: [
      {
        title: "Management Tools",
        items: [
          "Categorized List: View all subscriptions sorted by category",
          "Detailed Information: Access subscription details and billing cycles",
          "Status Indicators: Quick view of active and attention-needed subscriptions"
        ]
      }
    ]
  },
  {
    icon: <Wallet className="h-6 w-6 text-[#6A4C93]" />,
    title: "Budget Management",
    description: "Stay within your financial limits.",
    details: [
      {
        title: "Budget Features",
        items: [
          "Monthly Budget Overview: Track total budget and spending",
          "Category Budgets: Allocate budgets to specific categories",
          "Progress Bars: Visual indicators of budget usage",
          "Budget Alerts: Notifications for approaching limits"
        ]
      }
    ]
  },
  {
    icon: <FolderKanban className="h-6 w-6 text-[#00A6B2]" />,
    title: "Category Management",
    description: "Customize your subscription categories.",
    details: [
      {
        title: "Category Tools",
        items: [
          "Create, Edit, Delete: Tailor categories to your needs",
          "Set Monthly Budgets: Assign budgets with custom colors",
          "Flexible Organization: Group subscriptions your way"
        ]
      }
    ]
  },
  {
    icon: <PlusCircle className="h-6 w-6 text-[#C5A900]" />,
    title: "Adding Subscriptions",
    description: "Easily add and manage your subscriptions.",
    details: [
      {
        title: "Input Features",
        items: [
          "Comprehensive Input Fields: Enter all subscription details",
          "Reminder System: Set alerts for upcoming payments",
          "Quick Setup: Intuitive process for adding new subscriptions"
        ]
      }
    ]
  }
];

export function Features() {
  const [activeFeature, setActiveFeature] = useState<number>(0);

  return (
    <section id="features" className="bg-[#121212] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-[#EAEAEA] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Powerful Features to Streamline Your Subscriptions
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Feature Navigation */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-[#1A1A1A] shadow-lg'
                    : 'bg-[#212121]'
                }`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ 
                  scale: 1.02,
                  x: activeFeature === index ? -8 : 0,
                  transition: { duration: 0.2 }
                }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ 
                  opacity: 1,
                  x: activeFeature === index ? -8 : 0,
                  transition: { 
                    duration: 0.5,
                    delay: index * 0.1 
                  }
                }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-4">
                  <motion.div 
                    className="bg-[#2A2A2A] rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#EAEAEA] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[#C0C0C0]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Details */}
          <motion.div 
            className="bg-[#1A1A1A] p-8 rounded-xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              {features[activeFeature].details.map((section, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="text-lg font-semibold text-[#EAEAEA] mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <motion.li 
                        key={itemIndex} 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (itemIndex * 0.05) }}
                      >
                        <ArrowRight className="h-5 w-5 text-[#00A6B2] mt-1 flex-shrink-0" />
                        <span className="text-[#C0C0C0]">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Feature Preview */}
            <motion.div 
              className="mt-8 p-4 bg-[#212121] rounded-lg text-center"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-[#C0C0C0] text-sm">
                Interactive preview coming soon
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}