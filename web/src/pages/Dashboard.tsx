import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Flame, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../contexts/AppStateContext';
import BalanceCard from '../components/BalanceCard';
import StatCard from '../components/StatCard';
import BottomNavigation from '../components/BottomNavigation';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useAppState();

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };


  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header with greeting */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800">Copper One</span>
            </div>
            <span className="text-sm text-gray-500">by Capital One</span>
          </div>

          <div className="bg-gradient-to-b from-[#C8102E] to-[#E63946] rounded-2xl p-6 shadow-lg overflow-visible">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white text-lg mb-1">
                  {getGreeting()}! 👋
                </p>
                <h1 className="text-3xl font-bold text-white">
                  Welcome{user?.childName ? `, ${user.childName}` : ''}
                </h1>
              </div>
              <Sparkles className="w-6 h-6 text-white opacity-80 flex-shrink-0" />
            </div>

            {/* Balance Card centered in greeting card */}
            <div className="flex justify-center -mb-8">
              <BalanceCard
                balance={state.balance}
                transactions={state.transactions}
                onClick={() => navigate('/analytics')}
              />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4 mt-12">
          <StatCard
            title="Learning Streak"
            value={`${state.streak} days`}
            gradientFrom="from-orange-400"
            gradientTo="to-yellow-500"
            icon={BookOpen}
            badgeIcon={Flame}
          />
          <StatCard
            title="Piggy Points"
            value={state.points}
            gradientFrom="from-purple-500"
            gradientTo="to-blue-600"
            icon={Star}
            badgeIcon={Star}
            onClick={() => navigate('/rewards')}
          />
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className="bg-white rounded-xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/goals')}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800 text-sm">Your Goals</h3>
              <div className="text-xl">🎯</div>
            </div>
            <p className="text-xs text-gray-600">
              {state.goals.filter((g) => !g.completed).length} active
            </p>
          </div>
          <div
            className="bg-white rounded-xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/analytics')}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800 text-sm">Analytics</h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">View insights</p>
          </div>
        </div>

      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
