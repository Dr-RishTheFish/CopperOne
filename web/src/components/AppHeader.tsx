import React from 'react';
import { PiggyBank, LucideIcon } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  color?: 'red' | 'green' | 'gold' | 'purple' | 'blue' | 'gray' | 'orange';
  icon?: LucideIcon;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  color = 'red',
  icon: Icon,
  showBackButton = false,
  onBack,
  rightAction,
}) => {
  const colorClasses = {
    red: 'bg-gradient-to-b from-[#C8102E] to-[#E63946]',
    green: 'bg-gradient-to-b from-green-600 to-green-700',
    gold: 'bg-gradient-to-b from-yellow-500 to-yellow-600',
    purple: 'bg-gradient-to-b from-purple-600 to-purple-700',
    blue: 'bg-gradient-to-b from-blue-600 to-blue-700',
    gray: 'bg-gradient-to-b from-gray-600 to-gray-700',
    orange: 'bg-gradient-to-b from-orange-600 to-orange-700',
  };

  // For green headers (Transactions, Goals), use solid green and white icon circle
  const isGreenHeader = color === 'green';
  const headerBgClass = isGreenHeader
    ? 'bg-green-600'
    : colorClasses[color];
  
  // Icon styling - white circle for green headers, transparent background for others
  const iconBgClass = isGreenHeader
    ? 'bg-white'
    : 'bg-white/20';
  const iconColorClass = isGreenHeader
    ? 'text-green-600'
    : 'text-white';

  return (
    <div className="mb-6">
      {/* Top Branding Bar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <PiggyBank className="w-6 h-6 text-[#C8102E]" />
          <span className="text-xl font-bold text-gray-800">Copper One</span>
        </div>
        <span className="text-sm text-gray-500">by Capital One</span>
      </div>

      {/* Header Card */}
      <div className={`${headerBgClass} rounded-2xl p-6 shadow-lg`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {Icon && (
              <div className={`w-12 h-12 ${iconBgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${iconColorClass}`} />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {showBackButton && onBack && (
                  <button
                    onClick={onBack}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <h1 className="text-3xl font-bold text-white">{title}</h1>
              </div>
              {subtitle && (
                <p className="text-white text-opacity-90 text-sm">{subtitle}</p>
              )}
            </div>
          </div>
          {rightAction && <div className="ml-4 flex-shrink-0">{rightAction}</div>}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;

