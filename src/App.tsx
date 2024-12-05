import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthGuard } from './components/auth/AuthGuard';
import { Header } from './components/layout/Header';
import { Hero } from './components/home/Hero';
import { Features } from './components/home/Features';
import { Testimonials } from './components/home/Testimonials';
import { Footer } from './components/layout/Footer';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { AddSubscription } from './pages/AddSubscription';
import { EditSubscription } from './pages/EditSubscription';
import { SubscriptionDetail } from './pages/SubscriptionDetail';
import { Settings } from './pages/Settings';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { BudgetProvider } from './contexts/BudgetContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ReviewScheduleProvider } from './contexts/ReviewScheduleContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { SubscriptionList } from './pages/SubscriptionList';
import { Budget } from './pages/Budget';
import { Categories } from './pages/Categories';
import { useNotificationSystem } from './hooks/useNotificationSystem';
import { Toaster } from 'react-hot-toast';

function NotificationWrapper({ children }: { children: React.ReactNode }) {
  useNotificationSystem();
  return <>{children}</>;
}

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

function ProtectedRoutes() {
  return (
    <AuthGuard>
      <SubscriptionProvider>
        <BudgetProvider>
          <NotificationProvider>
            <ReviewScheduleProvider>
              <SettingsProvider>
                <NotificationWrapper>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/subscriptions" element={<SubscriptionList />} />
                    <Route path="/budget" element={<Budget />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/add-subscription" element={<AddSubscription />} />
                    <Route path="/edit-subscription/:id" element={<EditSubscription />} />
                    <Route path="/subscription/:id" element={<SubscriptionDetail />} />
                  </Routes>
                </NotificationWrapper>
              </SettingsProvider>
            </ReviewScheduleProvider>
          </NotificationProvider>
        </BudgetProvider>
      </SubscriptionProvider>
    </AuthGuard>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </Router>
  );
}