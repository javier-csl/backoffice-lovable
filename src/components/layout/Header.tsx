import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, 
  Building2, 
  Sun, 
  Moon,
  ShieldCheck,
  Megaphone,
  Briefcase,
  Settings,
  User,
  Bell,
  Link as LinkIcon,
  LogOut,
} from 'lucide-react';
import { UserRole } from '@/types';
import { Link } from 'react-router-dom';

const ROLE_CONFIG: Record<UserRole, { label: string; icon: React.ElementType }> = {
  comercial: { label: 'Comercial', icon: Briefcase },
  marketing: { label: 'Marketing', icon: Megaphone },
  superadmin: { label: 'Superadmin Rialfit', icon: ShieldCheck },
  inmobiliaria: { label: 'Inmobiliaria', icon: Building2 },
};

export function Header() {
  const { 
    currentRole, 
    setCurrentRole, 
    currentInmobiliaria, 
    setCurrentInmobiliaria,
    inmobiliarias,
    theme,
    setTheme,
  } = useApp();

  const RoleIcon = ROLE_CONFIG[currentRole].icon;

  return (
    <header className="h-14 bg-card border-b border-border px-4 flex items-center justify-between flex-shrink-0 md:pl-4 pl-14">
      {/* Left side - empty for breadcrumb */}
      <div className="flex items-center gap-2">
      </div>

      {/* Right side - Selectors */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Inmobiliaria Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs sm:text-sm font-normal px-2 sm:px-3">
              <Building2 className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <span className="max-w-[80px] sm:max-w-[140px] truncate">{currentInmobiliaria?.name}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Inmobiliaria
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {inmobiliarias.map((inmobiliaria) => (
              <DropdownMenuItem
                key={inmobiliaria.id}
                onClick={() => setCurrentInmobiliaria(inmobiliaria)}
                className={inmobiliaria.id === currentInmobiliaria?.id ? 'bg-accent' : ''}
              >
                {inmobiliaria.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Role Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs sm:text-sm font-normal px-2 sm:px-3">
              <RoleIcon className="w-4 h-4 text-muted-foreground" />
              <span className="hidden sm:inline">{ROLE_CONFIG[currentRole].label}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Cambiar rol
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => {
              const Icon = ROLE_CONFIG[role].icon;
              return (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={role === currentRole ? 'bg-accent' : ''}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {ROLE_CONFIG[role].label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Avatar className="h-7 w-7">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Juan Díaz</p>
                <p className="text-xs text-muted-foreground">juan@rialfit.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/configuracion/perfil" className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Mi perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/configuracion/notificaciones" className="cursor-pointer">
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/configuracion/integraciones" className="cursor-pointer">
                <LinkIcon className="w-4 h-4 mr-2" />
                Integraciones
              </Link>
            </DropdownMenuItem>
            {currentRole === 'superadmin' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/configuracion/inmobiliarias" className="cursor-pointer">
                    <Building2 className="w-4 h-4 mr-2" />
                    Inmobiliarias
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/configuracion/usuarios" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Usuarios y roles
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
