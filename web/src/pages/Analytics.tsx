import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, ArrowUp, ArrowDown, PieChart } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import AppHeader from '../components/AppHeader';
import SectionCard from '../components/SectionCard';
import BottomNavigation from '../components/BottomNavigation';

const Analytics: React.FC = () => {
  const { state } = useAppState();

  // Calculate analytics from transactions
  const analytics = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    // Filter transactions by date
    const parseDate = (dateStr: string) => {
      const [month, day, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    const thisMonthTransactions = state.transactions.filter((tx) => {
      const txDate = parseDate(tx.date);
      return txDate.getMonth() === thisMonth && txDate.getFullYear() === thisYear;
    });

    const lastMonthTransactions = state.transactions.filter((tx) => {
      const txDate = parseDate(tx.date);
      return txDate.getMonth() === lastMonth && txDate.getFullYear() === lastMonthYear;
    });

    // Calculate totals
    const thisMonthIncome = thisMonthTransactions
      .filter((tx) => tx.type === 'in')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const thisMonthExpenses = thisMonthTransactions
      .filter((tx) => tx.type === 'out')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const lastMonthIncome = lastMonthTransactions
      .filter((tx) => tx.type === 'in')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter((tx) => tx.type === 'out')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const netThisMonth = thisMonthIncome - thisMonthExpenses;
    const netLastMonth = lastMonthIncome - lastMonthExpenses;
    const incomeChange = lastMonthIncome > 0 
      ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 
      : 0;
    const expenseChange = lastMonthExpenses > 0
      ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
      : 0;

    // Category breakdown
    const categoryBreakdown = state.transactions
      .filter((tx) => tx.type === 'out')
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Spending trends (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const dailySpending = last7Days.map((date) => {
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      return state.transactions
        .filter((tx) => tx.date === dateStr && tx.type === 'out')
        .reduce((sum, tx) => sum + tx.amount, 0);
    });

    return {
      thisMonthIncome,
      thisMonthExpenses,
      netThisMonth,
      incomeChange,
      expenseChange,
      topCategories,
      dailySpending,
      totalTransactions: state.transactions.length,
    };
  }, [state.transactions]);

  const getMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <AppHeader
          title="Analytics"
          subtitle="Your financial insights"
          color="blue"
          icon={TrendingUp}
        />

        {/* Monthly Summary */}
        <SectionCard className="mb-4">
          <h3 className="font-bold text-gray-800 mb-4">
            {getMonthName()} Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Income</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                ${analytics.thisMonthIncome.toFixed(2)}
              </p>
              {analytics.incomeChange !== 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {analytics.incomeChange > 0 ? '+' : ''}
                  {analytics.incomeChange.toFixed(1)}% from last month
                </p>
              )}
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDown className="w-4 h-4 text-red-600" />
                <span className="text-xs text-red-700 font-medium">Expenses</span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                ${analytics.thisMonthExpenses.toFixed(2)}
              </p>
              {analytics.expenseChange !== 0 && (
                <p className="text-xs text-red-600 mt-1">
                  {analytics.expenseChange > 0 ? '+' : ''}
                  {analytics.expenseChange.toFixed(1)}% from last month
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Net</span>
              <span
                className={`text-xl font-bold ${
                  analytics.netThisMonth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ${analytics.netThisMonth >= 0 ? '+' : ''}
                {analytics.netThisMonth.toFixed(2)}
              </span>
            </div>
          </div>
        </SectionCard>

        {/* Top Spending Categories */}
        {analytics.topCategories.length > 0 && (
          <SectionCard className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800">Top Spending Categories</h3>
            </div>
            <div className="space-y-3">
              {analytics.topCategories.map(([category, amount], index) => {
                const total = analytics.topCategories.reduce(
                  (sum, [, amt]) => sum + amt,
                  0
                );
                const percentage = (amount / total) * 100;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {category}
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        ${amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {percentage.toFixed(1)}% of spending
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* 7-Day Spending Trend */}
        {analytics.dailySpending.some((amt) => amt > 0) && (
          <SectionCard className="mb-4">
            <h3 className="font-bold text-gray-800 mb-4">Last 7 Days Spending</h3>
            <div className="flex items-end gap-2 h-32">
              {analytics.dailySpending.map((amount, index) => {
                const maxAmount = Math.max(...analytics.dailySpending, 1);
                const height = (amount / maxAmount) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center justify-end h-24">
                      <div
                        className="w-full bg-blue-600 rounded-t transition-all"
                        style={{ height: `${height}%`, minHeight: amount > 0 ? '4px' : '0' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ${amount.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000)
                        .toLocaleDateString('en-US', { weekday: 'short' })
                        .slice(0, 1)}
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* Stats Summary */}
        <SectionCard>
          <h3 className="font-bold text-gray-800 mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-800">
                {analytics.totalTransactions}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Current Balance</p>
              <p className="text-2xl font-bold text-green-600">
                ${state.balance.toFixed(2)}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Analytics;

