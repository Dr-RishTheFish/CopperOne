import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { usePin } from '../contexts/PinContext';
import AppHeader from '../components/AppHeader';
import GoalItem from '../components/GoalItem';
import SectionCard from '../components/SectionCard';
import BottomNavigation from '../components/BottomNavigation';
import PinLock from '../components/PinLock';

const Goals: React.FC = () => {
  const { state, addGoal, updateGoal, deleteGoal, addToGoal, completeGoal } = useAppState();
  const { pinEnabled, verifyPin } = usePin();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: '',
    show: false,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    targetAmount: '',
    pointsReward: '50',
  });

  // No need for useEffect - PIN is only required for actions, not viewing

  const [showPinForAction, setShowPinForAction] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requirePinForAction = (action: () => void) => {
    if (pinEnabled && !isUnlocked) {
      setPendingAction(() => action);
      setShowPinForAction(true);
    } else {
      action();
    }
  };

  const handleAddGoal = () => {
    requirePinForAction(() => {
      if (!formData.title || !formData.targetAmount) {
        setToast({ message: 'Please fill in all required fields', show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
        return;
      }

      addGoal({
        title: formData.title,
        subtitle: formData.subtitle,
        targetAmount: parseFloat(formData.targetAmount),
        pointsReward: parseInt(formData.pointsReward) || 50,
      });

      setFormData({ title: '', subtitle: '', targetAmount: '', pointsReward: '50' });
      setShowAddModal(false);
      setToast({ message: '✅ Goal added!', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
    });
  };

  const handleEditGoal = (goalId: string) => {
    const goal = state.goals.find((g) => g.id === goalId);
    if (goal) {
      setEditingGoal(goalId);
      setFormData({
        title: goal.title,
        subtitle: goal.subtitle,
        targetAmount: goal.targetAmount.toString(),
        pointsReward: goal.pointsReward.toString(),
      });
      setShowAddModal(true);
    }
  };

  const handleUpdateGoal = () => {
    requirePinForAction(() => {
      if (!editingGoal || !formData.title || !formData.targetAmount) return;

      updateGoal(editingGoal, {
        title: formData.title,
        subtitle: formData.subtitle,
        targetAmount: parseFloat(formData.targetAmount),
        pointsReward: parseInt(formData.pointsReward) || 50,
      });

      setFormData({ title: '', subtitle: '', targetAmount: '', pointsReward: '50' });
      setEditingGoal(null);
      setShowAddModal(false);
      setToast({ message: '✅ Goal updated!', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    requirePinForAction(() => {
      if (window.confirm('Are you sure you want to delete this goal?')) {
        deleteGoal(goalId);
        setToast({ message: '🗑️ Goal deleted', show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
      }
    });
  };

  const handleAddToGoal = (goalId: string, amount: number) => {
    if (amount <= 0 || amount > state.balance) {
      setToast({
        message: amount > state.balance ? 'Not enough balance!' : 'Invalid amount',
        show: true,
      });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
      return;
    }

    addToGoal(goalId, amount);
    const goal = state.goals.find((g) => g.id === goalId);
    if (goal && goal.currentAmount + amount >= goal.targetAmount) {
      setToast({
        message: `🎉 Goal "${goal.title}" completed! You earned ${goal.pointsReward} points!`,
        show: true,
      });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } else {
      setToast({ message: `✅ Added $${amount.toFixed(2)} to goal!`, show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
    }
  };

  const handleCompleteGoal = (goalId: string) => {
    if (completeGoal(goalId)) {
      const goal = state.goals.find((g) => g.id === goalId);
      setToast({
        message: `🎉 Goal "${goal?.title}" completed! You earned ${goal?.pointsReward} points!`,
        show: true,
      });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', targetAmount: '', pointsReward: '50' });
    setEditingGoal(null);
    setShowAddModal(false);
  };

  // PIN lock modal for actions (not for viewing)
  const pinLockModal = showPinForAction && (
    <PinLock
      title="PIN Required"
      message="Enter your PIN to create or edit goals"
      onVerify={(pin) => {
        if (verifyPin(pin)) {
          setIsUnlocked(true);
          setShowPinForAction(false);
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
          return true;
        }
        return false;
      }}
      onCancel={() => {
        setShowPinForAction(false);
        setPendingAction(null);
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <AppHeader
          title="Goals"
          subtitle="Save up for things you want"
          color="green"
          icon={Target}
        />

        {/* Balance and Points Card */}
        <SectionCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Your Balance</h3>
              <p className="text-3xl font-bold text-green-600">${state.balance.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-gray-800 mb-1">Your Points</h3>
              <p className="text-3xl font-bold text-purple-600">{state.points}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Complete goals to earn points! 🎯
          </p>
        </SectionCard>

        {/* Add Goal Button */}
        <button
          onClick={() => requirePinForAction(() => setShowAddModal(true))}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-xl mb-4 hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Goal</span>
        </button>

        {/* Goals List */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 mb-3">
            Your Goals ({state.goals.filter((g) => !g.completed).length} active)
          </h3>
          <div className="space-y-3">
            {state.goals.length === 0 ? (
              <SectionCard>
                <p className="text-gray-500 text-center py-4">
                  No goals yet. Create your first goal to start saving! 🎯
                </p>
              </SectionCard>
            ) : (
              state.goals.map((goal) => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  balance={state.balance}
                  onAddMoney={(amount) => handleAddToGoal(goal.id, amount)}
                  onComplete={() => handleCompleteGoal(goal.id)}
                  onEdit={() => handleEditGoal(goal.id)}
                  onDelete={() => handleDeleteGoal(goal.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., New Bike"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., A cool new bike to ride around"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount ($) *
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="e.g., 1000"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Reward
                </label>
                <input
                  type="number"
                  value={formData.pointsReward}
                  onChange={(e) => setFormData({ ...formData, pointsReward: e.target.value })}
                  placeholder="50"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Points you'll earn when you complete this goal
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {editingGoal ? 'Update' : 'Add'} Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {toast.message}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Goals;
