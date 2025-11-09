import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  gradientFrom: string;
  gradientTo: string;
  icon: LucideIcon;
  badgeIcon?: LucideIcon;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  gradientFrom,
  gradientTo,
  icon: Icon,
  badgeIcon: BadgeIcon,
  onClick,
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl p-5 shadow-md text-white relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Icon className="w-5 h-5 text-white" />
          </div>
          {BadgeIcon && (
            <div>
              <BadgeIcon className="w-5 h-5 text-white opacity-80" />
            </div>
          )}
        </div>
        <p className="text-sm font-medium mb-1 opacity-90">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;

