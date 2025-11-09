import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Lock, Eye, Bell, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppHeader from '../components/AppHeader';
import ParentCard from '../components/ParentCard';
import SectionCard from '../components/SectionCard';
import BottomNavigation from '../components/BottomNavigation';

const Parent: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCardClick = (action: string) => {
    setShowModal(action);
    // TODO: Implement actual modal functionality for each action
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <AppHeader
          title="Parent Controls"
          subtitle="Manage your child's account"
          color="purple"
          icon={Shield}
          rightAction={
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-purple-700 px-3 py-2 rounded-lg text-white hover:bg-purple-800 transition-colors text-sm"
            >
              <span className="text-sm font-medium">Log out</span>
              <LogOut className="w-4 h-4" />
            </button>
          }
        />

        {/* Account Settings */}
        <div className="mb-4">
          <SectionCard>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-[#C8102E]" />
              <h3 className="font-bold text-gray-800">Account Settings</h3>
            </div>
            <div className="space-y-3">
              <div className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                <ParentCard
                  title="Spending Limits"
                  description="Set daily/weekly limits"
                  actionLabel="Manage"
                  onClick={() => handleCardClick('spending')}
                  icon={<Lock className="w-5 h-5 text-[#C8102E]" />}
                />
              </div>
              <div className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                <ParentCard
                  title="Activity Monitoring"
                  description="View transactions and activity"
                  actionLabel="View"
                  onClick={() => handleCardClick('activity')}
                  icon={<Eye className="w-5 h-5 text-[#C8102E]" />}
                />
              </div>
              <div>
                <ParentCard
                  title="Notifications"
                  description="Manage email alerts"
                  actionLabel="Settings"
                  onClick={() => handleCardClick('notifications')}
                  icon={<Bell className="w-5 h-5 text-[#C8102E]" />}
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Administration */}
        <div className="mb-4">
          <SectionCard>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">Administration</h3>
              <p className="text-xs text-gray-500">Control app settings</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Manage which goals are available and how many coins they cost.
            </p>
            <button
              onClick={() => navigate('/goals')}
              className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Manage Goals
            </button>
          </SectionCard>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              i
            </div>
            <p className="text-sm text-blue-800">
              Complete your account setup to access parent controls and manage your child's financial activity.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Placeholder */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 capitalize">
                {showModal} Settings
              </h3>
              <button
                onClick={() => setShowModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              {/* TODO: Connect to Firestore for {showModal} settings */}
              This feature will be available soon. Connect to Firestore to manage{' '}
              {showModal} settings.
            </p>
            <button
              onClick={() => setShowModal(null)}
              className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Parent;
