import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

export function MainLayout() {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className={cn(
          "flex-1 overflow-auto p-3 sm:p-4 lg:p-5",
          "transition-all duration-300"
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
