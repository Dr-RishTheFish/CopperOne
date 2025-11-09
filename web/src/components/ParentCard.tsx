import React from 'react';
import { Lock } from 'lucide-react';

interface ParentCardProps {
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

const ParentCard: React.FC<ParentCardProps> = ({
  title,
  description,
  actionLabel,
  onClick,
  icon,
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-start gap-3 flex-1">
        <div className="mt-1">{icon || <Lock className="w-5 h-5 text-[#C8102E]" />}</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className="px-4 py-2 text-[#C8102E] font-medium hover:text-[#A01028] transition-colors whitespace-nowrap"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default ParentCard;

