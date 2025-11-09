import React from 'react';
import { Gamepad2 } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';

const Game: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col flex-1">
        <div className="px-4 pt-6 pb-4">
          <AppHeader
            title="Finance Quest"
            subtitle="Learn money skills through play!"
            color="purple"
            icon={Gamepad2}
          />
        </div>

        {/* Game Container */}
        <div className="flex-1 px-4 pb-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
            <iframe
              src="/finance-quest-game.html"
              className="w-full h-full border-0"
              title="Finance Quest Game"
              allow="fullscreen"
              style={{ display: 'block' }}
            />
          </div>
        </div>

        {/* Info Banner */}
        <div className="px-4 pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Use WASD or arrow keys to move, SPACE to jump, and E to interact with piggy banks!
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Game;

