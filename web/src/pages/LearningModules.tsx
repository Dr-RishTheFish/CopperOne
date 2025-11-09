import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, CheckCircle, Circle, Loader2 } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';
import SectionCard from '../components/SectionCard';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  url: string;
  topics: string[];
}

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

const LearningModules: React.FC = () => {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [completedModules, setCompletedModules] = useState<Set<string>>(
    () => {
      const saved = localStorage.getItem('copperOne_completedModules');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const apiUrl = getApiUrl();
        
        // Try to fetch from API, but have fallback
        try {
          const response = await fetch(`${apiUrl}/khan-academy-modules`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.modules && data.modules.length > 0) {
              setModules(data.modules);
              setError(null);
              setLoading(false);
              return;
            }
          }
        } catch (apiError) {
          console.warn('API fetch failed, using fallback:', apiError);
        }

        // Fallback: Use default modules if API fails
        const fallbackModules: LearningModule[] = [
          {
            id: '1',
            title: 'Saving and Budgeting',
            description:
              'Learn how to save money and create budgets to reach your financial goals.',
            url:
              'https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:saving-and-budgeting',
            topics: ['Saving', 'Budgeting', 'Emergency Funds', 'Financial Goals'],
          },
          {
            id: '2',
            title: 'Interest and Debt',
            description:
              'Understand how interest works and how to manage debt responsibly.',
            url:
              'https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:interest-and-debt',
            topics: ['Interest Rates', 'Credit Cards', 'Loans', 'Debt Management'],
          },
          {
            id: '3',
            title: 'Investments and Retirement',
            description:
              'Explore how to invest money and plan for your financial future.',
            url:
              'https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:investments-and-retirement',
            topics: ['Stocks', 'Bonds', 'Retirement Planning', '401(k)'],
          },
          {
            id: '4',
            title: 'Income and Benefits',
            description:
              'Learn about different types of income and employee benefits.',
            url:
              'https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:income-and-benefits',
            topics: ['Salary', 'Benefits', 'Taxes', 'Paychecks'],
          },
          {
            id: '5',
            title: 'Housing',
            description:
              'Understand the costs and responsibilities of renting and owning a home.',
            url:
              'https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:housing',
            topics: ['Renting', 'Buying a Home', 'Mortgages', 'Home Expenses'],
          },
          {
            id: '6',
            title: 'Car Expenses',
            description:
              'Learn about the true cost of owning and maintaining a car.',
            url:
              'https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:car-expenses',
            topics: ['Car Payments', 'Insurance', 'Maintenance', 'Gas'],
          },
        ];

        setModules(fallbackModules);
        setError(null);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load learning modules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const toggleModuleComplete = (moduleId: string) => {
    setCompletedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      localStorage.setItem(
        'copperOne_completedModules',
        JSON.stringify(Array.from(newSet))
      );
      return newSet;
    });
  };

  const handleOpenModule = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <AppHeader
          title="Learning Modules"
          subtitle="Powered by Khan Academy"
          color="purple"
          icon={BookOpen}
        />

        {/* Info Banner */}
        <SectionCard className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-purple-900 mb-1">
                Financial Education Modules
              </h3>
              <p className="text-sm text-purple-700">
                Complete these Khan Academy modules to build your financial
                knowledge. Track your progress and earn achievements!
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Loading State */}
        {loading && (
          <SectionCard>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading modules...</span>
            </div>
          </SectionCard>
        )}

        {/* Error State */}
        {error && (
          <SectionCard className="border-red-200 bg-red-50">
            <p className="text-red-700 text-center py-4">{error}</p>
          </SectionCard>
        )}

        {/* Modules List */}
        {!loading && !error && (
          <div className="space-y-3">
            {modules.length === 0 ? (
              <SectionCard>
                <p className="text-gray-500 text-center py-4">
                  No modules available at the moment.
                </p>
              </SectionCard>
            ) : (
              modules.map((module) => {
                const isCompleted = completedModules.has(module.id);
                return (
                  <div
                    key={module.id}
                    className={`bg-white rounded-xl p-5 shadow-md border-2 ${
                      isCompleted
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-800 text-lg">
                            {module.title}
                          </h3>
                          {isCompleted && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {module.description}
                        </p>
                        {module.topics && module.topics.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {module.topics.map((topic, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModule(module.url)}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Start Learning</span>
                      </button>
                      <button
                        onClick={() => toggleModuleComplete(module.id)}
                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                          isCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={
                          isCompleted
                            ? 'Mark as incomplete'
                            : 'Mark as complete'
                        }
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">
                          {isCompleted ? 'Complete' : 'Mark Done'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Progress Summary */}
        {modules.length > 0 && (
          <SectionCard className="mt-4">
            <h3 className="font-bold text-gray-800 mb-2">Your Progress</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${
                        (completedModules.size / modules.length) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {completedModules.size} of {modules.length} modules completed
                </p>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((completedModules.size / modules.length) * 100)}%
              </div>
            </div>
          </SectionCard>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default LearningModules;

