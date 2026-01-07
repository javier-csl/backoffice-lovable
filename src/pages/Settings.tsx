import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Building2, Users, Settings2, Bell, Shield, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const { currentRole } = useApp();

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold">Configuración</h1>
        <p className="text-sm text-muted-foreground">
          Administra tu cuenta y preferencias
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notificaciones por email</p>
              <p className="text-xs text-muted-foreground">Recibe alertas de nuevos leads</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notificaciones push</p>
              <p className="text-xs text-muted-foreground">Notificaciones en el navegador</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Resumen semanal</p>
              <p className="text-xs text-muted-foreground">Recibe un reporte cada lunes</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Superadmin Only Sections */}
      {currentRole === 'superadmin' && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Inmobiliarias
              </CardTitle>
              <CardDescription>Gestiona las inmobiliarias del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Inmobiliaria Almagro', 'Paz Corp', 'Socovesa'].map((name, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">3 proyectos activos</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success">Activa</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Agregar inmobiliaria
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Usuarios y roles
              </CardTitle>
              <CardDescription>Administra los usuarios del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'Comercial' },
                  { name: 'María García', email: 'maria@ejemplo.com', role: 'Marketing' },
                  { name: 'Admin Rialfit', email: 'admin@rialfit.com', role: 'Superadmin' },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Invitar usuario
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* API & Integrations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="w-4 h-4" />
            Integraciones
          </CardTitle>
          <CardDescription>Conexiones con servicios externos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium">Google Calendar</p>
              <p className="text-xs text-muted-foreground">Sincroniza reuniones</p>
            </div>
            <Button variant="outline" size="sm">Conectar</Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium">WhatsApp Business</p>
              <p className="text-xs text-muted-foreground">Mensajes automatizados</p>
            </div>
            <Badge className="bg-success/10 text-success">Conectado</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
