import React, { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';

interface TransactionItemProps {
  title: string;
  category: string;
  date: string;
  amount: number;
  type: 'in' | 'out';
  onClick?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  category,
  date,
  amount,
  type,
  onClick,
}) => {
  const [showModal, setShowModal] = useState(false);
  const isIncoming = type === 'in';

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleClick}
      >
        {/* Color indicator */}
        <div
          className={`w-1 h-16 rounded-full ${
            isIncoming ? 'bg-green-500' : 'bg-red-500'
          }`}
        />

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isIncoming ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {isIncoming ? (
            <Plus className={`w-6 h-6 ${isIncoming ? 'text-green-600' : 'text-red-600'}`} />
          ) : (
            <Minus className={`w-6 h-6 ${isIncoming ? 'text-green-600' : 'text-red-600'}`} />
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">
            {category} • {date}
          </p>
        </div>

        {/* Amount */}
        <div
          className={`text-lg font-bold ${
            isIncoming ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isIncoming ? '+' : '-'}${amount.toFixed(2)}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm mx-4 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-semibold text-gray-800">{title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-semibold text-gray-800">{category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-gray-800">{date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p
                  className={`text-2xl font-bold ${
                    isIncoming ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isIncoming ? '+' : '-'}${amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionItem;

