import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, X } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { usePin } from '../contexts/PinContext';
import AppHeader from '../components/AppHeader';
import TransactionItem from '../components/TransactionItem';
import BottomNavigation from '../components/BottomNavigation';
import SectionCard from '../components/SectionCard';
import PinLock from '../components/PinLock';

const Transactions: React.FC = () => {
  const { state, addTransaction } = useAppState();
  const { pinEnabled, verifyPin } = usePin();
  const [isUnlocked, setIsUnlocked] = useState(!pinEnabled);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Other',
    amount: '',
    type: 'out' as 'in' | 'out',
    date: new Date().toISOString().split('T')[0], // Format for input type="date"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.amount) {
      const dateObj = new Date(formData.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      
      addTransaction({
        title: formData.title,
        category: formData.category,
        amount: parseFloat(formData.amount),
        type: formData.type,
        date: formattedDate,
      });
      setShowAddModal(false);
      setFormData({
        title: '',
        category: 'Other',
        amount: '',
        type: 'out',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  useEffect(() => {
    if (!pinEnabled) {
      setIsUnlocked(true);
    }
  }, [pinEnabled]);

  if (!isUnlocked && pinEnabled) {
    return (
      <PinLock
        title="Transactions Locked"
        message="Enter your PIN to access Transactions"
        onVerify={(pin) => {
          if (verifyPin(pin)) {
            setIsUnlocked(true);
            return true;
          }
          return false;
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <AppHeader
          title="Transactions"
          subtitle="Track your money"
          color="green"
          icon={DollarSign}
          rightAction={
            <button
              onClick={() => setShowAddModal(true)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            >
              <Plus className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
            </button>
          }
        />

        {/* Transactions List */}
        <div className="space-y-3">
          {state.transactions.length === 0 ? (
            <SectionCard>
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Tap the + button to add your first transaction
                </p>
              </div>
            </SectionCard>
          ) : (
            state.transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                title={transaction.title}
                category={transaction.category}
                date={transaction.date}
                amount={transaction.amount}
                type={transaction.type}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add Transaction</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'in' })}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                      formData.type === 'in'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'out' })}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                      formData.type === 'out'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="Allowance">Allowance</option>
                  <option value="Food">Food</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Savings">Savings</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Transactions;
