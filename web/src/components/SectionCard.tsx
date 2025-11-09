import React from 'react';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-md ${className}`}
    >
      {children}
    </div>
  );
};

export default SectionCard;

