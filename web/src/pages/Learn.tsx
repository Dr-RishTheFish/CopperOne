import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ExternalLink, GraduationCap } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';
import SectionCard from '../components/SectionCard';

// Get the API URL
const getApiUrl = (): string => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID || 'copperone';
  if (process.env.NODE_ENV === 'production') {
    return `https://us-central1-${projectId}.cloudfunctions.net/api`;
  }
  return `http://localhost:5001/${projectId}/us-central1/api`;
};

const Learn: React.FC = () => {
  const navigate = useNavigate();
  const khanAcademyUrl = 'https://www.khanacademy.org/college-careers-more/financial-literacy';

  const handleOpenKhanAcademy = () => {
    window.open(khanAcademyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col flex-1">
        <div className="px-4 pt-6 pb-4">
          <AppHeader
            title="Financial Education"
            subtitle="Learn from Khan Academy"
            color="purple"
            icon={BookOpen}
          />
        </div>

        {/* Khan Academy Card */}
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-lg mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  Khan Academy
                </h2>
                <p className="text-purple-100 text-sm">
                  Free financial literacy courses
                </p>
              </div>
            </div>
            <p className="text-white/90 text-sm mb-6">
              Explore interactive lessons, videos, and exercises to build your
              financial knowledge. Perfect for kids and teens!
            </p>
            <button
              onClick={handleOpenKhanAcademy}
              className="w-full bg-white text-purple-700 font-bold py-4 px-6 rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>Open Khan Academy</span>
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>

        {/* Learning Modules Link */}
        <div
          className="mt-4 cursor-pointer"
          onClick={() => navigate('/modules')}
        >
          <SectionCard className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">
                  Learning Modules
                </h3>
                <p className="text-sm text-gray-600">
                  Track your progress through Khan Academy financial courses
                </p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </div>
          </SectionCard>
        </div>

        {/* Info Banner */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Click the button above to open Khan Academy
            in a new tab and start learning!
          </p>
        </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Learn;
