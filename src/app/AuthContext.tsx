import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { HabituxAPI } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, role?: UserRole) => Promise<UserProfile>;
  signUp: (profile: Partial<UserProfile> & { password?: string }) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  switchRole: (role: UserRole) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await HabituxAPI.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const signIn = async (email: string, role: UserRole = 'student'): Promise<UserProfile> => {
    setLoading(true);
    try {
      const loggedUser = await HabituxAPI.signIn(email, role);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (profile: Partial<UserProfile> & { password?: string }): Promise<UserProfile> => {
    setLoading(true);
    try {
      const newUser = await HabituxAPI.signUp(profile);
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await HabituxAPI.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const updated = await HabituxAPI.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const switchRole = async (role: UserRole): Promise<UserProfile> => {
    if (!user) {
      return signIn(role === 'owner' ? 'owner.demo@habitux.in' : role === 'admin' ? 'admin.demo@habitux.in' : 'student.demo@habitux.in', role);
    }
    const updated = await updateProfile({ role });
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
