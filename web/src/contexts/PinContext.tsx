import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PinContextType {
  pinEnabled: boolean;
  pin: string | null;
  setPin: (pin: string | null) => void;
  enablePin: (pin: string) => void;
  disablePin: () => void;
  verifyPin: (inputPin: string) => boolean;
}

const PinContext = createContext<PinContextType | undefined>(undefined);

export const usePin = () => {
  const context = useContext(PinContext);
  if (context === undefined) {
    throw new Error('usePin must be used within a PinProvider');
  }
  return context;
};

interface PinProviderProps {
  children: ReactNode;
}

export const PinProvider: React.FC<PinProviderProps> = ({ children }) => {
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pin, setPinState] = useState<string | null>(null);

  // Load PIN settings from localStorage
  useEffect(() => {
    const savedPinEnabled = localStorage.getItem('copperOne_pinEnabled');
    const savedPin = localStorage.getItem('copperOne_pin');
    
    if (savedPinEnabled === 'true' && savedPin) {
      setPinEnabled(true);
      setPinState(savedPin);
    }
  }, []);

  const setPin = (newPin: string | null) => {
    setPinState(newPin);
    if (newPin) {
      localStorage.setItem('copperOne_pin', newPin);
    } else {
      localStorage.removeItem('copperOne_pin');
    }
  };

  const enablePin = (newPin: string) => {
    if (newPin.length === 4 && /^\d{4}$/.test(newPin)) {
      setPin(newPin);
      setPinEnabled(true);
      localStorage.setItem('copperOne_pinEnabled', 'true');
    }
  };

  const disablePin = () => {
    setPinEnabled(false);
    setPin(null);
    localStorage.removeItem('copperOne_pinEnabled');
    localStorage.removeItem('copperOne_pin');
  };

  const verifyPin = (inputPin: string): boolean => {
    if (!pinEnabled || !pin) return true; // If PIN is disabled, always verify
    return inputPin === pin;
  };

  const value: PinContextType = {
    pinEnabled,
    pin,
    setPin,
    enablePin,
    disablePin,
    verifyPin,
  };

  return <PinContext.Provider value={value}>{children}</PinContext.Provider>;
};

