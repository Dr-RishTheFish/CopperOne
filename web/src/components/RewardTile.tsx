import React, { useState } from 'react';
import { Star, Badge, Zap, Heart, Gift, Crown, LucideIcon } from 'lucide-react';

interface RewardTileProps {
  title: string;
  description: string;
  cost: number;
  unlocked: boolean;
  points: number;
  icon?: string;
  onRedeem: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  star: Star,
  badge: Badge,
  lightning: Zap,
  heart: Heart,
  gift: Gift,
  crown: Crown,
};

const RewardTile: React.FC<RewardTileProps> = ({
  title,
  description,
  cost,
  unlocked,
  points,
  icon = 'star',
  onRedeem,
}) => {
  const [showModal, setShowModal] = useState(false);
  const IconComponent = iconMap[icon] || Star;
  const canRedeem = points >= cost && !unlocked;

  const handleRedeem = () => {
    if (canRedeem) {
      setShowModal(true);
      onRedeem();
      setTimeout(() => setShowModal(false), 2000);
    }
  };

  return (
    <>
      <div
        className={`rounded-xl p-4 shadow-md ${
          unlocked
            ? 'bg-green-50 border-2 border-green-200'
            : canRedeem
            ? 'bg-white border border-gray-200 hover:shadow-lg transition-shadow'
            : 'bg-white border border-gray-200 opacity-60'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
              unlocked ? 'bg-green-100' : canRedeem ? 'bg-gray-100' : 'bg-gray-100'
            }`}
          >
            <IconComponent
              className={`w-6 h-6 ${
                unlocked 
                  ? 'text-green-600' 
                  : canRedeem 
                  ? 'text-purple-500' 
                  : 'text-gray-400'
              }`}
              strokeWidth={unlocked || canRedeem ? 2 : 1.5}
            />
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
          <p className="text-xs text-gray-600 mb-2">{description}</p>
          {unlocked ? (
            <p className="text-xs font-semibold text-green-600 mt-1">Unlocked!</p>
          ) : cost > 0 ? (
            <>
              <p className="text-xs font-semibold text-gray-700 mb-2">{cost} coins</p>
              {canRedeem && (
                <button
                  onClick={handleRedeem}
                  className="px-3 py-1 bg-yellow-500 text-yellow-900 text-xs font-bold rounded-full hover:bg-yellow-600 transition-colors"
                >
                  Redeem
                </button>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-xs mx-4 text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              You redeemed {title}!
            </h3>
            <p className="text-gray-600">Enjoy your reward!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default RewardTile;

