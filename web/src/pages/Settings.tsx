import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Trash2, AlertTriangle, Lock, LockOpen, LogOut } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { usePin } from '../contexts/PinContext';
import { useAuth } from '../context/AuthContext';
import AppHeader from '../components/AppHeader';
import SectionCard from '../components/SectionCard';
import BottomNavigation from '../components/BottomNavigation';
import PinLock from '../components/PinLock';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { resetAllData } = useAppState();
  const { pinEnabled, enablePin, disablePin, verifyPin } = usePin();
  const { logout } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinDisable, setShowPinDisable] = useState(false);
  const [newPin, setNewPin] = useState<string[]>(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', '']);
  const [pinStep, setPinStep] = useState<'new' | 'confirm'>('new');
  const [pinError, setPinError] = useState('');

  const handleClearAllData = () => {
    // Reset app state to zero
    resetAllData();
    
    // Clear learning module progress
    localStorage.removeItem('copperOne_completedModules');
    
    // Show success message
    setShowConfirmModal(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handlePinConfirm = (confirmedPin: string) => {
    if (newPin.join('') === confirmedPin) {
      enablePin(confirmedPin);
      setShowPinSetup(false);
      setPinStep('new');
      setNewPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setPinError('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } else {
      setPinError('PINs do not match. Please try again.');
      setConfirmPin(['', '', '', '']);
      setPinStep('new');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <AppHeader
          title="Settings"
          subtitle="Manage your account"
          color="gray"
          icon={SettingsIcon}
          rightAction={
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          }
        />

        {/* Danger Zone */}
        <SectionCard className="mt-4 border-2 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 mb-4">
                This will reset all your data to zero including goals, 
                transactions, points, and progress. You will stay logged in. 
                This action cannot be undone.
              </p>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>
        </SectionCard>

        {/* PIN Protection */}
        <SectionCard className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {pinEnabled ? (
                <Lock className="w-5 h-5 text-green-600" />
              ) : (
                <LockOpen className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <h3 className="font-bold text-gray-800">PIN Protection</h3>
                <p className="text-sm text-gray-600">
                  {pinEnabled
                    ? 'Goals and Transactions are locked'
                    : 'Lock Goals and Transactions with a PIN'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (pinEnabled) {
                  setShowPinDisable(true);
                } else {
                  setShowPinSetup(true);
                  setPinStep('new');
                  setNewPin(['', '', '', '']);
                  setConfirmPin(['', '', '', '']);
                  setPinError('');
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pinEnabled
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {pinEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </SectionCard>

        {/* Info Section */}
        <SectionCard className="mt-4">
          <h3 className="font-bold text-gray-800 mb-2">About</h3>
          <p className="text-sm text-gray-600 mb-2">
            Copper One is a financial education app for kids, powered by Khan 
            Academy.
          </p>
          <p className="text-xs text-gray-500">
            Version 1.0.0
          </p>
        </SectionCard>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Clear All Data?
                </h3>
                <p className="text-sm text-gray-600">
                  This cannot be undone
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              Are you absolutely sure? This will reset to zero:
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-1 list-disc list-inside">
              <li>All your goals (will be deleted)</li>
              <li>All transactions (will be deleted)</li>
              <li>All points and balance (reset to 0)</li>
              <li>All achievements (reset to locked)</li>
              <li>Learning module progress (will be cleared)</li>
            </ul>
            <p className="text-xs text-gray-500 mb-6">
              Note: You will stay logged in. Your account will remain active.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllData}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Setup Modal */}
      {showPinSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {pinStep === 'new' ? 'Set PIN' : 'Confirm PIN'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {pinStep === 'new'
                ? 'Enter a 4-digit PIN to lock Goals and Transactions'
                : 'Re-enter your PIN to confirm'}
            </p>

            <div className="flex gap-3 justify-center mb-4">
              {(pinStep === 'new' ? newPin : confirmPin).map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value.slice(-1);
                    if (!/^\d*$/.test(value)) return;
                    const current = pinStep === 'new' ? [...newPin] : [...confirmPin];
                    current[index] = value;
                    if (pinStep === 'new') {
                      setNewPin(current);
                    } else {
                      setConfirmPin(current);
                    }
                    setPinError('');

                    // Auto-advance
                    if (value && index < 3) {
                      const nextInput = e.target.parentElement?.children[index + 1] as HTMLInputElement;
                      nextInput?.focus();
                    }

                    // Auto-submit when complete
                    if (current.every((d) => d !== '') && index === 3) {
                      if (pinStep === 'new') {
                        setPinStep('confirm');
                        setTimeout(() => {
                          const firstInput = document.querySelector(
                            '.pin-confirm-input-0'
                          ) as HTMLInputElement;
                          firstInput?.focus();
                        }, 100);
                      } else {
                        handlePinConfirm(current.join(''));
                      }
                    }
                  }}
                  className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    digit ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } ${pinStep === 'confirm' ? 'pin-confirm-input-' + index : ''}`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-center text-red-600 text-sm mb-4">{pinError}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPinSetup(false);
                  setPinStep('new');
                  setNewPin(['', '', '', '']);
                  setConfirmPin(['', '', '', '']);
                  setPinError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Disable Modal */}
      {showPinDisable && (
        <PinLock
          title="Disable PIN Protection"
          message="Enter your PIN to disable protection"
          onVerify={(pin) => {
            if (verifyPin(pin)) {
              disablePin();
              setShowPinDisable(false);
              setShowSuccessToast(true);
              setTimeout(() => setShowSuccessToast(false), 3000);
              return true;
            }
            return false;
          }}
          onCancel={() => setShowPinDisable(false)}
        />
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {pinEnabled ? '✅ PIN protection enabled!' : '✅ PIN protection disabled!'}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Settings;

