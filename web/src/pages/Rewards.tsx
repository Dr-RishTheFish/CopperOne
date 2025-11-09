import React, { useState } from 'react';
import { Trophy, Coins } from 'lucide-react';
import { useAppState, Achievement } from '../contexts/AppStateContext';
import AppHeader from '../components/AppHeader';
import RewardTile from '../components/RewardTile';
import SectionCard from '../components/SectionCard';
import BottomNavigation from '../components/BottomNavigation';

const Rewards: React.FC = () => {
  const { state, redeemReward } = useAppState();
  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: '',
    show: false,
  });

  const handleRedeem = (rewardId: string) => {
    const reward = state.rewards.find((r) => r.id === rewardId);
    if (reward && redeemReward(rewardId)) {
      setToast({ message: `🎉 You redeemed ${reward.title}!`, show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
    }
  };

  const progressPercentage = (state.xp / state.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <AppHeader
          title="Rewards"
          subtitle="Your accomplishments and prizes"
          color="gold"
          icon={Trophy}
          rightAction={
            <div className="flex items-center gap-2 bg-yellow-400 px-3 py-2 rounded-full">
              <Coins className="w-4 h-4 text-yellow-900" />
              <span className="text-yellow-900 font-semibold text-sm">{state.points} coins</span>
            </div>
          }
        />

        {/* Level and Progress */}
        <SectionCard className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-gray-800">Level {state.level}</p>
              <p className="text-lg font-semibold text-gray-600">Money Master</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>
                {state.xp} / {state.xpToNextLevel} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#C8102E] h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </SectionCard>

        {/* Reward Shop */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 mb-3">Reward Shop</h3>
          <div className="grid grid-cols-2 gap-3">
            {state.rewards.map((reward) => (
              <RewardTile
                key={reward.id}
                title={reward.title}
                description={reward.description}
                cost={reward.cost}
                unlocked={reward.unlocked}
                points={state.points}
                icon={reward.icon}
                onRedeem={() => handleRedeem(reward.id)}
              />
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 mb-3">Achievements</h3>
          <div className="space-y-2">
            {state.achievements.map((achievement) => (
              <AchievementItem key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      </div>

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

const AchievementItem: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const iconMap: Record<string, string> = {
    badge: '🛡️',
    lightning: '⚡',
    person: '👤',
    star: '⭐',
    piggy: '🐷',
  };

  return (
    <SectionCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              achievement.unlocked ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            {achievement.unlocked ? (
              <span className="text-2xl">
                {iconMap[achievement.icon || 'badge'] || '🏆'}
              </span>
            ) : (
              <span className="text-xl text-gray-400">⭐</span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{achievement.title}</h4>
            <p className="text-sm text-gray-600">{achievement.description}</p>
          </div>
        </div>
        {achievement.unlocked ? (
          <div className="text-green-600 font-bold">+{achievement.points}</div>
        ) : (
          <div className="text-gray-400 font-bold">+{achievement.points}</div>
        )}
      </div>
    </SectionCard>
  );
};

export default Rewards;

