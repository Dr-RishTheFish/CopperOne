import React, { useState, useRef, useEffect } from 'react';
import { Lock, X } from 'lucide-react';

interface PinLockProps {
  onVerify: (pin: string) => boolean;
  onCancel?: () => void;
  title?: string;
  message?: string;
}

const PinLock: React.FC<PinLockProps> = ({ 
  onVerify, 
  onCancel,
  title = 'Enter PIN',
  message = 'Please enter your 4-digit PIN to continue'
}) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newPin = [...pin];
    newPin[index] = value.slice(-1); // Only take last character
    setPin(newPin);
    setError(false);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits are entered
    if (newPin.every((digit) => digit !== '') && index === 3) {
      handleSubmit(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (pinValue: string) => {
    if (pinValue.length === 4) {
      if (onVerify(pinValue)) {
        // Success - component will be unmounted by parent
        return;
      } else {
        setError(true);
        setPin(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d{4}$/.test(pasted)) {
      const newPin = pasted.split('');
      setPin(newPin);
      handleSubmit(pasted);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex gap-3 justify-center mb-4" onPaste={handlePaste}>
          {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error
                    ? 'border-red-500 bg-red-50'
                    : digit
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
                }`}
              />
          ))}
        </div>

        {error && (
          <p className="text-center text-red-600 text-sm mb-4">
            Incorrect PIN. Please try again.
          </p>
        )}

        <div className="flex gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinLock;

