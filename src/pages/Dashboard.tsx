import { useApp } from '@/context/AppContext';
import { KPICard } from '@/components/common/KPICard';
import { MOCK_LEADS, MOCK_PROJECTS, MOCK_MEETINGS, MOCK_ACTIVITY } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  FileCheck,
  Building2,
  Plus,
  Clock,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const LEADS_TREND_DATA = [
  { month: 'Sep', leads: 45, reuniones: 18 },
  { month: 'Oct', leads: 62, reuniones: 28 },
  { month: 'Nov', leads: 78, reuniones: 42 },
  { month: 'Dic', leads: 95, reuniones: 51 },
  { month: 'Ene', leads: 112, reuniones: 68 },
];

const CHANNEL_DATA = [
  { name: 'Meta Ads', leads: 45, color: '#1C5CF5' },
  { name: 'Google Ads', leads: 38, color: '#22C55E' },
  { name: 'Portales', leads: 22, color: '#F59E0B' },
  { name: 'Orgánico', leads: 15, color: '#8B5CF6' },
  { name: 'Referidos', leads: 12, color: '#EC4899' },
];

// Updated to only 5 official funnel states
const STATUS_DATA = [
  { name: 'Nuevo', value: 35, color: '#1C5CF5' },
  { name: 'En contacto', value: 28, color: '#8B5CF6' },
  { name: 'Reunión agendada', value: 18, color: '#A855F7' },
  { name: 'Ganado', value: 12, color: '#22C55E' },
  { name: 'Perdido', value: 7, color: '#EF4444' },
];

export default function Dashboard() {
  const { currentRole } = useApp();
  
  const totalLeads = MOCK_LEADS.length;
  const activeLeads = MOCK_LEADS.filter(l => !['ganado', 'perdido'].includes(l.status)).length;
  const pipelineUF = MOCK_LEADS.filter(l => !['ganado', 'perdido'].includes(l.status))
    .reduce((sum, lead) => sum + lead.ticketUF, 0);
  const meetingsCount = MOCK_MEETINGS.filter(m => m.status === 'pendiente').length;
  const reunionesRealizadas = MOCK_MEETINGS.filter(m => m.status === 'realizada').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Inicio</h1>
          <p className="text-sm text-muted-foreground">
            {currentRole === 'comercial' && 'Vista comercial'}
            {currentRole === 'marketing' && 'Vista marketing'}
            {currentRole === 'superadmin' && 'Vista general'}
            {currentRole === 'inmobiliaria' && 'Vista inmobiliaria'}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Período</Label>
            <Select defaultValue="30d">
              <SelectTrigger className="w-[140px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Proyecto</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {MOCK_PROJECTS.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Link to="/leads">
          <Button size="sm" variant="outline" className="h-8 text-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Nuevo lead
          </Button>
        </Link>
        <Link to="/reuniones">
          <Button size="sm" variant="outline" className="h-8 text-sm">
            <Calendar className="w-4 h-4 mr-1.5" />
            Agendar reunión
          </Button>
        </Link>
        {currentRole === 'superadmin' && (
          <Link to="/proyectos">
            <Button size="sm" variant="outline" className="h-8 text-sm">
              <Building2 className="w-4 h-4 mr-1.5" />
              Nuevo proyecto
            </Button>
          </Link>
        )}
      </div>

      {/* KPIs Row */}
      {currentRole === 'comercial' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <KPICard label="Leads activos" value={activeLeads} change={12} icon={<Users className="w-4 h-4" />} />
          <KPICard label="Pipeline (UF)" value={`${(pipelineUF / 1000).toFixed(0)}K`} change={8} icon={<DollarSign className="w-4 h-4" />} />
          <KPICard label="Reuniones pendientes" value={meetingsCount} change={-5} icon={<Calendar className="w-4 h-4" />} />
          <KPICard label="Reuniones realizadas" value={reunionesRealizadas} change={15} icon={<TrendingUp className="w-4 h-4" />} />
          <KPICard label="Tasa conversión" value="11.7%" change={5} icon={<FileCheck className="w-4 h-4" />} />
        </div>
      )}

      {currentRole === 'marketing' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <KPICard label="Leads totales" value={totalLeads} change={18} icon={<Users className="w-4 h-4" />} />
          <KPICard label="CPL promedio" value="$12.5K" change={-8} icon={<DollarSign className="w-4 h-4" />} />
          <KPICard label="Conv. a reunión" value="24%" change={5} icon={<Calendar className="w-4 h-4" />} />
          <KPICard label="Conv. a cierre" value="8.5%" change={1.2} icon={<TrendingUp className="w-4 h-4" />} />
          <KPICard label="RialFit prom" value="4.2" change={0.3} icon={<FileCheck className="w-4 h-4" />} />
        </div>
      )}

      {(currentRole === 'superadmin' || currentRole === 'inmobiliaria') && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <KPICard label="Inmobiliarias" value={3} icon={<Building2 className="w-4 h-4" />} />
          <KPICard label="Leads totales" value={524} change={22} icon={<Users className="w-4 h-4" />} />
          <KPICard label="Reuniones mes" value={156} change={35} icon={<FileCheck className="w-4 h-4" />} />
          <KPICard label="Ofelia completadas" value={89} change={28} icon={<TrendingUp className="w-4 h-4" />} />
          <KPICard label="Cierres mes" value={14} change={15} icon={<DollarSign className="w-4 h-4" />} />
        </div>
      )}

      {/* Charts Row - Equal widths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leads Trend Chart */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium">Evolución de leads</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={LEADS_TREND_DATA}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1C5CF5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1C5CF5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReuniones" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#1C5CF5" fill="url(#colorLeads)" strokeWidth={2} name="Leads" />
                  <Area type="monotone" dataKey="reuniones" stroke="#22C55E" fill="url(#colorReuniones)" strokeWidth={2} name="Reuniones" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution - Updated with 5 states */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium">Distribución por estado</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={STATUS_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                    {STATUS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 justify-center">
              {STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Channel Chart */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium">Leads por canal</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHANNEL_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={75} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '12px' }} />
                  <Bar dataKey="leads" radius={[0, 4, 4, 0]}>
                    {CHANNEL_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Projects */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Top proyectos</CardTitle>
              <Link to="/proyectos">
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">Ver todos →</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-2">
              {MOCK_PROJECTS.slice(0, 4).map((project, i) => (
                <Link key={project.id} to={`/proyectos/${project.id}`}>
                  <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0 hover:bg-muted/30 rounded px-2 -mx-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-5">{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{project.leadsCount} leads</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{(project.pipelineUF / 1000).toFixed(0)}K UF</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Actividad reciente</CardTitle>
              <Link to="/leads">
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">Ver más →</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-2">
              {MOCK_ACTIVITY.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.date), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}