import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionLimits } from './useSubscriptionLimits';

export function useSubscriptionUpgrade() {
  const navigate = useNavigate();
  const { isAtLimit, activeCount, maxSubscriptions } = useSubscriptionLimits();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleAddSubscriptionClick = () => {
    if (isAtLimit) {
      setShowUpgradeModal(true);
    } else {
      navigate('/add-subscription');
    }
  };

  const handleUpgradeModalClose = () => {
    setShowUpgradeModal(false);
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(false);
    navigate('/settings');
  };

  return {
    showUpgradeModal,
    handleAddSubscriptionClick,
    handleUpgradeModalClose,
    handleUpgradeClick,
    isAtLimit,
    activeCount,
    maxSubscriptions
  };
}
