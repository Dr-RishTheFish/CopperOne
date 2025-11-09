import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  uid: string;
  username: string;
  childName?: string;
  childAge?: string;
  email?: string;
  balance?: number;
  streak?: number;
  points?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (formData: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('copperOne_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('copperOne_user');
      }
    }
    setLoading(false);
  }, []);

  // Bypass account: admin / password
  const BYPASS_ACCOUNT = {
    username: 'admin',
    password: 'password',
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Check bypass account - admin gets 99999 for everything
      if (username === BYPASS_ACCOUNT.username && password === BYPASS_ACCOUNT.password) {
        const adminUser: User = {
          uid: 'admin-001',
          username: 'admin',
          childName: 'Admin User',
          childAge: '10',
          balance: 99999,
          streak: 99999,
          points: 99999,
        };
        setUser(adminUser);
        localStorage.setItem('copperOne_user', JSON.stringify(adminUser));
        
        // Also set app state to 99999 - create or update
        try {
          const currentState = localStorage.getItem('copperOne_appState');
          let state;
          if (currentState) {
            state = JSON.parse(currentState);
          } else {
            // Create initial state with 99999 values
            state = {
              balance: 99999,
              points: 99999,
              streak: 99999,
              level: 999,
              xp: 99999,
              xpToNextLevel: 1000,
              goals: [],
              transactions: [],
              rewards: [],
              achievements: [],
            };
          }
          // Update to 99999
          state.balance = 99999;
          state.points = 99999;
          state.streak = 99999;
          state.level = 999;
          state.xp = 99999;
          localStorage.setItem('copperOne_appState', JSON.stringify(state));
          
          // Trigger a page reload to refresh app state
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } catch (e) {
          console.error('Error updating app state:', e);
        }
        
        setLoading(false);
        return true;
      }

      // TODO: Add Firebase authentication here
      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      // setUser({ uid: userCredential.user.uid, ...userDoc.data() });

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const signup = async (formData: any): Promise<boolean> => {
    setLoading(true);
    
    try {
      // TODO: Add Firebase authentication here
      // const userCredential = await createUserWithEmailAndPassword(auth, formData.parentEmail, formData.password);
      // await setDoc(doc(db, 'users', userCredential.user.uid), {
      //   username: formData.username,
      //   childName: formData.childName,
      //   childAge: formData.childAge,
      //   parentName: formData.parentName,
      //   parentEmail: formData.parentEmail,
      //   accountType: formData.accountType,
      //   balance: 0,
      //   streak: 0,
      //   points: 0,
      //   createdAt: serverTimestamp(),
      // });

      // For now, create a local user account
      const newUser: User = {
        uid: `user-${Date.now()}`,
        username: formData.username,
        childName: formData.childName,
        childAge: formData.childAge,
        email: formData.parentEmail,
        balance: 0,
        streak: 0,
        points: 0,
      };

      setUser(newUser);
      localStorage.setItem('copperOne_user', JSON.stringify(newUser));
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('copperOne_user');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

