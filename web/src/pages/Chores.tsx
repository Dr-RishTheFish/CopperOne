import React, { useState } from 'react';
import { ClipboardList, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { usePin } from '../contexts/PinContext';
import AppHeader from '../components/AppHeader';
import SectionCard from '../components/SectionCard';
import BottomNavigation from '../components/BottomNavigation';
import PinLock from '../components/PinLock';

const Chores: React.FC = () => {
  const { state, addChore, updateChore, deleteChore, completeChore } = useAppState();
  const { pinEnabled, verifyPin } = usePin();
  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: '',
    show: false,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingChore, setEditingChore] = useState<string | null>(null);
  const [showPinForAction, setShowPinForAction] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsReward: '25',
  });

  const requirePinForAction = (action: () => void) => {
    if (pinEnabled) {
      setPendingAction(() => action);
      setShowPinForAction(true);
    } else {
      action();
    }
  };

  const handleAddChore = () => {
    requirePinForAction(() => {
      if (!formData.title) {
        setToast({ message: 'Please fill in the chore title', show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
        return;
      }

      addChore({
        title: formData.title,
        description: formData.description,
        pointsReward: parseInt(formData.pointsReward) || 25,
      });

      setFormData({ title: '', description: '', pointsReward: '25' });
      setShowAddModal(false);
      setToast({ message: '✅ Chore added!', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
    });
  };

  const handleEditChore = (choreId: string) => {
    requirePinForAction(() => {
      const chore = (state.chores || []).find((c) => c.id === choreId);
      if (chore) {
        setEditingChore(choreId);
        setFormData({
          title: chore.title,
          description: chore.description,
          pointsReward: chore.pointsReward.toString(),
        });
        setShowAddModal(true);
      }
    });
  };

  const handleDeleteChore = (choreId: string) => {
    requirePinForAction(() => {
      deleteChore(choreId);
      setToast({ message: '✅ Chore deleted!', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
    });
  };

  const handleCompleteChore = (choreId: string) => {
    // Anyone can mark chores as done - no PIN required
    if (completeChore(choreId)) {
      const chore = (state.chores || []).find((c) => c.id === choreId);
      setToast({
        message: `🎉 Chore "${chore?.title}" completed! You earned ${chore?.pointsReward} points!`,
        show: true,
      });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };

  const handleSaveChore = () => {
    if (editingChore) {
      updateChore(editingChore, {
        title: formData.title,
        description: formData.description,
        pointsReward: parseInt(formData.pointsReward) || 25,
      });
      setToast({ message: '✅ Chore updated!', show: true });
    } else {
      handleAddChore();
      return;
    }
    setFormData({ title: '', description: '', pointsReward: '25' });
    setEditingChore(null);
    setShowAddModal(false);
    setTimeout(() => setToast({ message: '', show: false }), 3000);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', pointsReward: '25' });
    setEditingChore(null);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <AppHeader
          title="Chores"
          subtitle="Complete chores to earn points"
          color="orange"
          icon={ClipboardList}
        />

        {/* Points Card */}
        <SectionCard className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Your Points</h3>
              <p className="text-3xl font-bold text-purple-600">{state.points}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {(state.chores || []).filter((c) => !c.completed).length} active chores
              </p>
              <p className="text-sm text-gray-500">
                {(state.chores || []).filter((c) => c.completed).length} completed
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Add Chore Button */}
        <button
          onClick={() => requirePinForAction(() => setShowAddModal(true))}
          className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-xl mb-4 hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Chore</span>
        </button>

        {/* Chores List */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 mb-3">
            Chores ({(state.chores || []).filter((c) => !c.completed).length} active)
          </h3>
          <div className="space-y-3">
            {!state.chores || state.chores.length === 0 ? (
              <SectionCard>
                <p className="text-gray-500 text-center py-4">
                  No chores yet. Add your first chore to start earning points! 🧹
                </p>
              </SectionCard>
            ) : (
              (state.chores || []).map((chore) => (
                <div key={chore.id} className="bg-white rounded-xl p-4 shadow-md">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800">{chore.title}</h3>
                        {chore.completed && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Done ✓
                          </span>
                        )}
                      </div>
                      {chore.description && (
                        <p className="text-sm text-gray-600 mb-2">{chore.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-purple-600 font-bold">
                          {chore.pointsReward} points
                        </span>
                        {chore.completed && chore.completedAt && (
                          <span className="text-gray-500 text-xs">
                            Completed {new Date(chore.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {!chore.completed && pinEnabled && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditChore(chore.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit chore"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteChore(chore.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete chore"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Complete Button */}
                  {!chore.completed && (
                    <button
                      onClick={() => handleCompleteChore(chore.id)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark as Done</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Chore Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingChore ? 'Edit Chore' : 'Add New Chore'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chore Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Take out trash"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Take out all trash bags to the curb"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Reward *
                </label>
                <input
                  type="number"
                  value={formData.pointsReward}
                  onChange={(e) => setFormData({ ...formData, pointsReward: e.target.value })}
                  placeholder="25"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
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
                onClick={handleSaveChore}
                disabled={!formData.title}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingChore ? 'Update' : 'Add'} Chore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Lock Modal for Actions */}
      {showPinForAction && (
        <PinLock
          title="PIN Required"
          message="Enter your PIN to create or edit chores"
          onVerify={(pin) => {
            if (verifyPin(pin)) {
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
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {toast.message}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Chores;

