import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconCircleProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const IconCircle: React.FC<IconCircleProps> = ({
  icon: Icon,
  size = 'md',
  color = 'bg-blue-500',
  gradientFrom,
  gradientTo,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const bgClass = gradientFrom && gradientTo
    ? `bg-gradient-to-br ${gradientFrom} ${gradientTo}`
    : color;

  return (
    <div
      className={`${sizeClasses[size]} ${bgClass} rounded-full flex items-center justify-center text-white`}
    >
      <Icon className={iconSizeClasses[size]} />
    </div>
  );
};

export default IconCircle;

