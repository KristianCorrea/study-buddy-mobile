import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  animalType: string; // e.g., "cat", "dog", "raccoon"
  animalName: string;
  level: number;
  xp: number;
  streak: number;
  // Add more stats as needed
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Example: Load user from async storage or API on mount
  useEffect(() => {
    // You can implement loading user from backend or local storage here
    // setLoading(true);
    // fetchUser().then(setUser).finally(() => setLoading(false));
  }, []);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  };

  const clearUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, loading, setUser, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
