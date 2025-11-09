import React from 'react';

interface PennyCharacterProps {
  size?: number;
  className?: string;
}

const PennyCharacter: React.FC<PennyCharacterProps> = ({ size = 40, className = '' }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Penny body (copper circle) */}
        <circle cx="50" cy="50" r="35" fill="#B87333" stroke="#8B5A2B" strokeWidth="2" />
        
        {/* Lincoln Memorial detail (simplified) */}
        <rect x="35" y="40" width="30" height="20" fill="#8B5A2B" rx="2" />
        <rect x="38" y="43" width="24" height="14" fill="#A67C52" />
        
        {/* Face - eyes */}
        <circle cx="42" cy="35" r="3" fill="#000" />
        <circle cx="58" cy="35" r="3" fill="#000" />
        
        {/* Face - smile */}
        <path
          d="M 42 42 Q 50 48 58 42"
          stroke="#000"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Arms */}
        <line x1="15" y1="50" x2="30" y2="45" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        <line x1="85" y1="50" x2="70" y2="45" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        
        {/* Hands */}
        <circle cx="15" cy="50" r="5" fill="#D3D3D3" />
        <circle cx="85" cy="50" r="5" fill="#D3D3D3" />
        
        {/* Legs */}
        <line x1="50" y1="85" x2="45" y2="95" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="85" x2="55" y2="95" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        
        {/* Shoes */}
        <ellipse cx="45" cy="95" rx="6" ry="4" fill="#D3D3D3" />
        <ellipse cx="55" cy="95" rx="6" ry="4" fill="#D3D3D3" />
        
        {/* Shoe details */}
        <line x1="42" y1="95" x2="48" y2="95" stroke="#fff" strokeWidth="1" />
        <line x1="52" y1="95" x2="58" y2="95" stroke="#fff" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default PennyCharacter;

