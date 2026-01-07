import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import logoLight from '@/assets/logo-light.svg';
import logoDark from '@/assets/logo-dark.svg';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Home,
  Users,
  Building2,
  Calendar,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Menu,
  Megaphone,
} from 'lucide-react';

type AllowedRole = 'comercial' | 'marketing' | 'superadmin' | 'inmobiliaria';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: AllowedRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'Leads', href: '/leads', icon: Users },
  { label: 'Proyectos', href: '/proyectos', icon: Building2 },
  { label: 'Reuniones', href: '/reuniones', icon: Calendar },
  { label: 'Marketing', href: '/marketing', icon: Megaphone, roles: ['marketing', 'superadmin'] },
  { label: 'Reportes', href: '/reportes', icon: BarChart3 },
];

function SidebarContent({ collapsed, onCollapse }: { collapsed: boolean; onCollapse?: () => void }) {
  const location = useLocation();
  const { currentRole, theme } = useApp();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const canAccess = (roles?: AllowedRole[]) => {
    if (!roles) return true;
    return roles.includes(currentRole as AllowedRole);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "h-14 flex items-center border-b border-sidebar-border transition-all",
        collapsed ? "px-2 justify-center" : "px-4"
      )}>
        {collapsed ? (
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
              <rect x="2" y="4" width="4" height="16" rx="1" fill="currentColor"/>
              <rect x="10" y="8" width="4" height="12" rx="1" fill="currentColor"/>
              <rect x="18" y="2" width="4" height="18" rx="1" fill="currentColor"/>
            </svg>
          </div>
        ) : (
          <img 
            src={theme === 'dark' ? logoDark : logoLight} 
            alt="Rialfit" 
            className="h-7"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            if (!canAccess(item.roles)) return null;
            const active = isActive(item.href);

            if (collapsed) {
              return (
                <li key={item.href}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          'flex items-center justify-center w-10 h-10 mx-auto rounded-md transition-colors',
                          active 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'sidebar-item',
                    active && 'sidebar-item-active'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Button & Footer */}
      <div className="border-t border-sidebar-border">
        {onCollapse && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCollapse}
                className="w-full h-10 rounded-none border-b border-sidebar-border justify-center"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {collapsed ? 'Expandir menú' : 'Colapsar menú'}
            </TooltipContent>
          </Tooltip>
        )}
        <div className={cn(
          "py-2 text-center",
          collapsed ? "px-1" : "px-4"
        )}>
          <p className={cn(
            "text-muted-foreground",
            collapsed ? "text-[8px]" : "text-[10px]"
          )}>
            {collapsed ? "" : "Powered by Rialfit"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex h-screen bg-sidebar border-r border-sidebar-border flex-col flex-shrink-0 transition-all duration-300",
          sidebarCollapsed ? "w-[56px]" : "w-[220px]"
        )}
      >
        <SidebarContent 
          collapsed={sidebarCollapsed} 
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </aside>

      {/* Mobile Menu Button */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-3 left-3 z-50 h-9 w-9 bg-card shadow-sm border border-border"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[220px] p-0 bg-sidebar">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  );
}
