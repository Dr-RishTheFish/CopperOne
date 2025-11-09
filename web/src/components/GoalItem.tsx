import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Check } from 'lucide-react';
import { Goal } from '../contexts/AppStateContext';

interface GoalItemProps {
  goal: Goal;
  balance: number;
  onAddMoney: (amount: number) => void;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  balance,
  onAddMoney,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  const handleAddMoney = () => {
    const amount = parseFloat(addAmount);
    if (amount > 0 && amount <= balance && amount <= remaining) {
      onAddMoney(amount);
      setAddAmount('');
      setShowAddModal(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800">{goal.title}</h3>
              {goal.completed && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Completed ✓
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{goal.subtitle}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-700">
                <span className="font-bold text-green-600">
                  ${goal.currentAmount.toFixed(2)}
                </span>{' '}
                / ${goal.targetAmount.toFixed(2)}
              </span>
              <span className="text-gray-500">
                {goal.pointsReward} pts reward
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit goal"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete goal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.round(progress)}% complete</span>
            <span>${remaining.toFixed(2)} remaining</span>
          </div>
        </div>

        {/* Actions */}
        {!goal.completed && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Money</span>
            </button>
            {goal.currentAmount >= goal.targetAmount && (
              <button
                onClick={onComplete}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Complete</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Money Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Add Money to "{goal.title}"
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Add
              </label>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                max={Math.min(balance, remaining)}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p>Available balance: ${balance.toFixed(2)}</p>
                <p>Remaining needed: ${remaining.toFixed(2)}</p>
                <p>Max you can add: ${Math.min(balance, remaining).toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddAmount('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoney}
                disabled={
                  !addAmount ||
                  parseFloat(addAmount) <= 0 ||
                  parseFloat(addAmount) > balance ||
                  parseFloat(addAmount) > remaining
                }
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Money
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoalItem;
