import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  PiggyBank,
  Home,
  DollarSign,
  Trophy,
  MessageCircle,
  BookOpen,
  Target,
  ClipboardList,
  Gamepad2,
  Settings,
} from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navItems = [
    { id: 'home', path: '/dashboard', icon: Home, label: 'Home' },
    { id: 'transactions', path: '/transactions', icon: DollarSign, label: 'Money' },
    { id: 'rewards', path: '/rewards', icon: Trophy, label: 'Rewards' },
    { id: 'penny', path: '/penny', icon: MessageCircle, label: 'Penny' },
    { id: 'learn', path: '/learn', icon: BookOpen, label: 'Learn' },
    { id: 'goals', path: '/goals', icon: Target, label: 'Goals' },
    { id: 'chores', path: '/chores', icon: ClipboardList, label: 'Chores' },
    { id: 'game', path: '/game', icon: Gamepad2, label: 'Game' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 rounded-t-2xl shadow-lg z-50">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isPenny = item.id === 'penny';
          const isHome = item.id === 'home';

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-1 py-1 rounded-lg transition-colors flex-1 min-w-0 ${
                  isActive ? '' : ''
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1.5 rounded-full relative ${
                      isActive
                        ? isPenny
                          ? 'bg-blue-100'
                          : 'bg-red-100'
                        : 'bg-transparent'
                    }`}
                  >
                    {isHome && isActive ? (
                      <div className="relative">
                        <Home className="w-5 h-5 text-[#C8102E]" />
                        <PiggyBank className="w-2.5 h-2.5 text-[#C8102E] absolute bottom-0 right-0" />
                      </div>
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${
                          isActive
                            ? isPenny
                              ? 'text-blue-600'
                              : 'text-[#C8102E]'
                            : 'text-gray-600'
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isActive
                        ? isPenny
                          ? 'text-blue-600'
                          : 'text-[#C8102E]'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;

