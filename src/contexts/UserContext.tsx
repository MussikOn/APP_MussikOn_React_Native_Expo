import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Token } from '@appTypes/DatasTypes';
import { getToken, getData, saveToken, deleteToken as removeToken } from '@utils/functions';

interface UserContextType {
  user: Token | null;
  setUser: (user: Token | null) => void;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Token | null>(null);

  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    const token = await getToken();
    if (token) {
      const userData = await getData();
      setUser(userData || null);
    } else {
      setUser(null);
    }
  };

  const login = async (token: string) => {
    await saveToken(token);
    await refreshUser();
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, refreshUser }}>
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