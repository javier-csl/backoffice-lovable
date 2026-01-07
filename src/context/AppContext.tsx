import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, Inmobiliaria } from '@/types';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentInmobiliaria: Inmobiliaria | null;
  setCurrentInmobiliaria: (inmobiliaria: Inmobiliaria) => void;
  inmobiliarias: Inmobiliaria[];
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_INMOBILIARIAS: Inmobiliaria[] = [
  { id: '1', name: 'Inmobiliaria Almagro', status: 'activo', projectsCount: 5, usersCount: 12 },
  { id: '2', name: 'Paz Corp', status: 'activo', projectsCount: 8, usersCount: 24 },
  { id: '3', name: 'Socovesa', status: 'activo', projectsCount: 3, usersCount: 8 },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('comercial');
  const [currentInmobiliaria, setCurrentInmobiliaria] = useState<Inmobiliaria | null>(MOCK_INMOBILIARIAS[0]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      currentInmobiliaria,
      setCurrentInmobiliaria,
      inmobiliarias: MOCK_INMOBILIARIAS,
      theme,
      setTheme,
      sidebarCollapsed,
      setSidebarCollapsed,
      sidebarOpen,
      setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
