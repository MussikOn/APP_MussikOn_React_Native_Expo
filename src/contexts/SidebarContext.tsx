import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  sidebarVisible: boolean;
  activeScreen: string;
  openSidebar: () => void;
  closeSidebar: () => void;
  setActiveScreen: (screen: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeScreen, setActiveScreen] = useState('Dashboard');

  const openSidebar = () => setSidebarVisible(true);
  const closeSidebar = () => setSidebarVisible(false);

  return (
    <SidebarContext.Provider value={{ 
      sidebarVisible, 
      activeScreen,
      openSidebar, 
      closeSidebar,
      setActiveScreen 
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}; 