import React, { useMemo } from 'react';
import { PiggyBank, TrendingUp } from 'lucide-react';
import { Transaction } from '../contexts/AppStateContext';

interface BalanceCardProps {
  balance: number;
  transactions?: Transaction[];
  onClick?: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, transactions = [], onClick }) => {
  // Calculate real statistics from transactions
  const stats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const parseDate = (dateStr: string) => {
      const [month, day, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    // This week's transactions
    const thisWeek = transactions.filter((tx) => {
      const txDate = parseDate(tx.date);
      return txDate >= oneWeekAgo;
    });

    // Last week's transactions
    const lastWeek = transactions.filter((tx) => {
      const txDate = parseDate(tx.date);
      return txDate >= new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000) &&
             txDate < oneWeekAgo;
    });

    // This month's transactions
    const thisMonth = transactions.filter((tx) => {
      const txDate = parseDate(tx.date);
      return txDate >= oneMonthAgo;
    });

    const thisWeekIncome = thisWeek
      .filter((tx) => tx.type === 'in')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const thisWeekExpenses = thisWeek
      .filter((tx) => tx.type === 'out')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const thisWeekNet = thisWeekIncome - thisWeekExpenses;

    const lastWeekIncome = lastWeek
      .filter((tx) => tx.type === 'in')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const lastWeekExpenses = lastWeek
      .filter((tx) => tx.type === 'out')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const lastWeekNet = lastWeekIncome - lastWeekExpenses;

    const thisMonthIncome = thisMonth
      .filter((tx) => tx.type === 'in')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const thisMonthExpenses = thisMonth
      .filter((tx) => tx.type === 'out')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      weeklyChange: thisWeekNet,
      monthlyIncome: thisMonthIncome,
      monthlyExpenses: thisMonthExpenses,
      weeklyChangePercent: lastWeekNet !== 0 
        ? ((thisWeekNet - lastWeekNet) / Math.abs(lastWeekNet)) * 100 
        : 0,
    };
  }, [transactions]);

  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-lg ${
        onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-700">My Savings</h2>
        <PiggyBank className="w-5 h-5 text-[#C8102E]" />
      </div>
      <p className="text-4xl font-bold text-gray-800 mb-2">
        ${balance.toFixed(2)}
      </p>
      
      {/* Real Statistics */}
      <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
        {stats.weeklyChange !== 0 && (
          <div
            className={`flex items-center gap-1 ${
              stats.weeklyChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <TrendingUp
              className={`w-4 h-4 ${stats.weeklyChange < 0 ? 'transform rotate-180' : ''}`}
            />
            <span className="text-sm font-medium">
              {stats.weeklyChange > 0 ? '+' : ''}${Math.abs(stats.weeklyChange).toFixed(2)} this week
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Income (month):</span>
            <span className="text-green-600 font-semibold ml-1">
              ${stats.monthlyIncome.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Spent (month):</span>
            <span className="text-red-600 font-semibold ml-1">
              ${stats.monthlyExpenses.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;

