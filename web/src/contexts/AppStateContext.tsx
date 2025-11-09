import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Goal {
  id: string;
  title: string;
  subtitle: string;
  targetAmount: number;
  currentAmount: number;
  completed: boolean;
  pointsReward: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: 'in' | 'out';
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  unlocked: boolean;
  icon?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  icon?: string;
}

export interface Chore {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  createdAt: string;
}

export interface AppState {
  balance: number;
  points: number;
  streak: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  goals: Goal[];
  chores: Chore[];
  transactions: Transaction[];
  rewards: Reward[];
  achievements: Achievement[];
}

interface AppStateContextType {
  state: AppState;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  completeGoal: (goalId: string) => boolean;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'completed' | 'currentAmount'>) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  addToGoal: (goalId: string, amount: number) => void;
  addChore: (chore: Omit<Chore, 'id' | 'createdAt' | 'completed'>) => void;
  updateChore: (choreId: string, updates: Partial<Chore>) => void;
  deleteChore: (choreId: string) => void;
  completeChore: (choreId: string) => boolean;
  redeemReward: (rewardId: string) => boolean;
  addPoints: (amount: number) => void;
  deductPoints: (amount: number) => boolean;
  addXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  resetAllData: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

// Sample initial data matching screenshots
const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'New Bike',
    subtitle: 'A cool new bike to ride around.',
    targetAmount: 1000,
    currentAmount: 250,
    completed: false,
    pointsReward: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Video Game',
    subtitle: 'The latest adventure game.',
    targetAmount: 400,
    currentAmount: 150,
    completed: false,
    pointsReward: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'New Sneakers',
    subtitle: 'Comfy and stylish shoes.',
    targetAmount: 250,
    currentAmount: 100,
    completed: false,
    pointsReward: 30,
    createdAt: new Date().toISOString(),
  },
];

const initialTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Allowance',
    category: 'Allowance',
    date: '11/9/2025',
    amount: 25.0,
    type: 'in',
  },
  {
    id: '2',
    title: 'Lunch',
    category: 'Food',
    date: '11/9/2025',
    amount: 5.5,
    type: 'out',
  },
];

const initialRewards: Reward[] = [
  { id: '1', title: 'Custom Avatar', description: 'Unlocked!', cost: 0, unlocked: true, icon: 'star' },
  { id: '2', title: 'Special Badge', description: 'Unlocked!', cost: 0, unlocked: true, icon: 'badge' },
  { id: '3', title: 'Premium Theme', description: 'Change your app theme', cost: 200, unlocked: false, icon: 'lightning' },
  { id: '4', title: 'Power Boost', description: 'Double your earnings', cost: 250, unlocked: false, icon: 'heart' },
  { id: '5', title: 'Mystery Gift', description: 'Surprise reward!', cost: 300, unlocked: false, icon: 'gift' },
  { id: '6', title: 'VIP Crown', description: 'Exclusive VIP status', cost: 500, unlocked: false, icon: 'crown' },
];

const initialAchievements: Achievement[] = [
  { id: '1', title: 'First Deposit', description: 'Made your first deposit', points: 50, unlocked: true, icon: 'badge' },
  { id: '2', title: 'Saving Streak', description: '7 days of consistent saving', points: 100, unlocked: true, icon: 'lightning' },
  { id: '3', title: 'Goal Getter', description: 'Completed your first savings goal', points: 150, unlocked: true, icon: 'person' },
  { id: '4', title: 'Quiz Master', description: 'Scored 100% on 5 quizzes', points: 200, unlocked: false, icon: 'star' },
  { id: '5', title: 'Super Saver', description: 'Saved $500 total', points: 250, unlocked: false, icon: 'piggy' },
];

const initialState: AppState = {
  balance: 127.5,
  points: 850,
  streak: 13,
  level: 8,
  xp: 850,
  xpToNextLevel: 1000,
  goals: initialGoals,
  chores: [],
  transactions: initialTransactions,
  rewards: initialRewards,
  achievements: initialAchievements,
};

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('copperOne_appState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure chores array exists (for backward compatibility)
        if (!parsed.chores) {
          parsed.chores = [];
        }
        // Check if user is admin and ensure values are 99999
        const user = localStorage.getItem('copperOne_user');
        if (user) {
          try {
            const userData = JSON.parse(user);
            if (userData.username === 'admin') {
              parsed.balance = 99999;
              parsed.points = 99999;
              parsed.streak = 99999;
              parsed.level = 999;
              parsed.xp = 99999;
            }
          } catch (e) {
            // Ignore user parse errors
          }
        }
        return parsed;
      } catch (error) {
        console.error('Error loading app state:', error);
      }
    }
    return initialState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('copperOne_appState', JSON.stringify(state));
  }, [state]);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...tx,
      id: Date.now().toString(),
    };

    setState((prev) => {
      const newBalance = tx.type === 'in' ? prev.balance + tx.amount : prev.balance - tx.amount;
      const newAchievements = [...prev.achievements];
      let pointsToAdd = 0;
      
      // First Deposit achievement
      if (tx.type === 'in' && prev.transactions.filter(t => t.type === 'in').length === 0) {
        const firstDeposit = newAchievements.find(a => a.id === '1');
        if (firstDeposit && !firstDeposit.unlocked) {
          firstDeposit.unlocked = true;
          pointsToAdd += firstDeposit.points;
        }
      }
      
      // Super Saver achievement - saved $500 total
      const totalSaved = prev.transactions
        .filter(t => t.type === 'in')
        .reduce((sum, t) => sum + t.amount, 0) + (tx.type === 'in' ? tx.amount : 0);
      if (totalSaved >= 500) {
        const superSaver = newAchievements.find(a => a.id === '5');
        if (superSaver && !superSaver.unlocked) {
          superSaver.unlocked = true;
          pointsToAdd += superSaver.points;
        }
      }
      
        return {
          ...prev,
          transactions: [newTransaction, ...prev.transactions],
          balance: newBalance,
          achievements: newAchievements,
          points: prev.points + pointsToAdd,
        };
      });
    };

  const completeGoal = (goalId: string): boolean => {
    const goal = state.goals.find((g) => g.id === goalId);
    if (!goal || goal.completed) return false;

    if (goal.currentAmount >= goal.targetAmount) {
      setState((prev) => {
        const newAchievements = [...prev.achievements];
        
        // Goal Getter achievement - completed first goal
        const completedGoals = prev.goals.filter(g => g.completed).length;
        if (completedGoals === 0) {
          const goalGetter = newAchievements.find(a => a.id === "3");
          if (goalGetter && !goalGetter.unlocked) {
            goalGetter.unlocked = true;
          }
        }
        
        return {
          ...prev,
          goals: prev.goals.map((g) =>
            g.id === goalId ? { ...g, completed: true } : g
          ),
          points: prev.points + goal.pointsReward + (newAchievements
            .filter(a => a.unlocked && !prev.achievements.find(pa => pa.id === a.id && pa.unlocked))
            .reduce((sum, a) => sum + a.points, 0)),
          balance: prev.balance - goal.targetAmount, // Deduct from balance when completed
          achievements: newAchievements,
        };
      });
      return true;
    }
    return false;
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'completed' | 'currentAmount'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      currentAmount: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId ? { ...g, ...updates } : g
      ),
    }));
  };

  const deleteGoal = (goalId: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));
  };

  const addToGoal = (goalId: string, amount: number) => {
    setState((prev) => {
      const goal = prev.goals.find((g) => g.id === goalId);
      if (!goal || goal.completed) return prev;

      const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
      const isNowComplete = newAmount >= goal.targetAmount;

      return {
        ...prev,
        goals: prev.goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                currentAmount: newAmount,
                completed: isNowComplete,
              }
            : g
        ),
        points: isNowComplete ? prev.points + goal.pointsReward : prev.points,
        balance: prev.balance - amount,
      };
    });
  };

  const redeemReward = (rewardId: string): boolean => {
    const reward = state.rewards.find((r) => r.id === rewardId);
    if (!reward || reward.unlocked) return false;

    if (state.points >= reward.cost) {
      setState((prev) => ({
        ...prev,
        rewards: prev.rewards.map((r) =>
          r.id === rewardId ? { ...r, unlocked: true } : r
        ),
        points: prev.points - reward.cost,
      }));
      return true;
    }
    return false;
  };

  const addPoints = (amount: number) => {
    setState((prev) => ({
      ...prev,
      points: prev.points + amount,
    }));
  };

  const deductPoints = (amount: number): boolean => {
    if (state.points >= amount) {
      setState((prev) => ({
        ...prev,
        points: prev.points - amount,
      }));
      return true;
    }
    return false;
  };

  const addXP = (amount: number) => {
    setState((prev) => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXPToNextLevel = prev.xpToNextLevel;

      // Level up logic
      while (newXP >= newXPToNextLevel) {
        newXP -= newXPToNextLevel;
        newLevel += 1;
        newXPToNextLevel = newLevel * 100 + 500; // Increasing XP needed per level
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXPToNextLevel,
      };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setState((prev) => {
      const achievement = prev.achievements.find((a) => a.id === achievementId);
      if (achievement && !achievement.unlocked) {
        return {
          ...prev,
          achievements: prev.achievements.map((a) =>
            a.id === achievementId ? { ...a, unlocked: true } : a
          ),
          points: prev.points + achievement.points,
        };
      }
      return prev;
    });
  };

  const addChore = (choreData: Omit<Chore, 'id' | 'createdAt' | 'completed'>) => {
    const newChore: Chore = {
      ...choreData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      chores: [...prev.chores, newChore],
    }));
  };

  const updateChore = (choreId: string, updates: Partial<Chore>) => {
    setState((prev) => ({
      ...prev,
      chores: prev.chores.map((chore) =>
        chore.id === choreId ? { ...chore, ...updates } : chore
      ),
    }));
  };

  const deleteChore = (choreId: string) => {
    setState((prev) => ({
      ...prev,
      chores: prev.chores.filter((chore) => chore.id !== choreId),
    }));
  };

  const completeChore = (choreId: string): boolean => {
    const chore = state.chores.find((c) => c.id === choreId);
    if (!chore || chore.completed) return false;

    setState((prev) => ({
      ...prev,
      chores: prev.chores.map((c) =>
        c.id === choreId
          ? {
              ...c,
              completed: true,
              completedAt: new Date().toISOString(),
            }
          : c
      ),
      points: prev.points + chore.pointsReward,
    }));
    return true;
  };

  const resetAllData = () => {
    // Reset to initial state but keep the structure
    setState({
      balance: 0,
      points: 0,
      streak: 0,
      level: 1,
      xp: 0,
      xpToNextLevel: 500,
      goals: [],
      chores: [],
      transactions: [],
      rewards: initialRewards.map((r) => ({ ...r, unlocked: r.id === '1' || r.id === '2' })),
      achievements: initialAchievements.map((a) => ({ ...a, unlocked: false })),
    });
  };

  const value: AppStateContextType = {
    state,
    addTransaction,
    completeGoal,
    addGoal,
    updateGoal,
    deleteGoal,
    addToGoal,
    addChore,
    updateChore,
    deleteChore,
    completeChore,
    redeemReward,
    addPoints,
    deductPoints,
    addXP,
    unlockAchievement,
    resetAllData,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

