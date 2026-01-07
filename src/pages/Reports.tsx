import { useApp } from '@/context/AppContext';
import { KPICard } from '@/components/common/KPICard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Users, TrendingUp, DollarSign, Calendar, FileCheck, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts';

// Updated to only 5 official funnel states
const FUNNEL_DATA = [
  { name: 'Nuevo', value: 120, fill: '#1C5CF5' },
  { name: 'En contacto', value: 85, fill: '#8B5CF6' },
  { name: 'Reunión agendada', value: 48, fill: '#A855F7' },
  { name: 'Ganado', value: 18, fill: '#22C55E' },
  { name: 'Perdido', value: 32, fill: '#EF4444' },
];

const MONTHLY_DATA = [
  { month: 'Sep', leads: 45, cierres: 4 },
  { month: 'Oct', leads: 62, cierres: 6 },
  { month: 'Nov', leads: 78, cierres: 8 },
  { month: 'Dic', leads: 95, cierres: 11 },
  { month: 'Ene', leads: 112, cierres: 14 },
];

const CHANNEL_PERFORMANCE = [
  { channel: 'Meta Ads', leads: 45, cierres: 5, cpl: 12500, rf: 4.2 },
  { channel: 'Google Ads', leads: 38, cierres: 4, cpl: 15000, rf: 3.9 },
  { channel: 'Portales', leads: 22, cierres: 2, cpl: 8000, rf: 3.5 },
  { channel: 'Orgánico', leads: 15, cierres: 2, cpl: 0, rf: 4.5 },
  { channel: 'Referidos', leads: 12, cierres: 3, cpl: 0, rf: 4.8 },
];

const OFELIA_DATA = [
  { metric: 'Leads enviados a Ofelia', value: '68%', change: 12 },
  { metric: 'Documentos completos', value: '52%', change: 8 },
  { metric: 'Pre-eval aprobadas', value: '78%', change: 5 },
  { metric: 'Tiempo promedio docs', value: '3.2 días', change: -15 },
];

const EXECUTIVE_PERFORMANCE = [
  { name: 'Juan Pérez', leads: 45, reuniones: 32, cierres: 8, conversion: 17.8 },
  { name: 'María García', leads: 38, reuniones: 28, cierres: 6, conversion: 15.8 },
  { name: 'Carlos López', leads: 29, reuniones: 18, cierres: 4, conversion: 13.8 },
];

const PROJECT_PERFORMANCE = [
  { name: 'Vista Cordillera', leads: 156, reuniones: 89, cierres: 23, conversion: 14.7 },
  { name: 'Parque Central', leads: 98, reuniones: 52, cierres: 12, conversion: 12.2 },
  { name: 'Alto Las Condes', leads: 203, reuniones: 124, cierres: 34, conversion: 16.7 },
];

export default function Reports() {
  const { currentRole } = useApp();

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Reportes</h1>
          <p className="text-sm text-muted-foreground">
            Análisis de rendimiento
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Período</Label>
            <Select defaultValue="30d">
              <SelectTrigger className="w-[150px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs by Role */}
      {currentRole === 'comercial' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard label="Pipeline UF" value="485K" change={8} icon={<DollarSign className="w-4 h-4" />} />
          <KPICard label="Tasa conversión" value="11.7%" change={2.1} icon={<TrendingUp className="w-4 h-4" />} />
          <KPICard label="Reuniones agendadas" value={28} change={12} icon={<Calendar className="w-4 h-4" />} />
          <KPICard label="Reuniones realizadas" value={22} change={8} icon={<Calendar className="w-4 h-4" />} />
          <KPICard label="Leads activos" value={86} change={15} icon={<Users className="w-4 h-4" />} />
          <KPICard label="Ofelia completas" value="78%" change={5} icon={<FileCheck className="w-4 h-4" />} />
        </div>
      )}

      {currentRole === 'marketing' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <KPICard label="CPL promedio" value="$11.8K" change={-8} icon={<DollarSign className="w-4 h-4" />} />
          <KPICard label="Leads totales" value={132} change={18} icon={<Users className="w-4 h-4" />} />
          <KPICard label="RialFit prom" value="4.1" change={0.3} icon={<TrendingUp className="w-4 h-4" />} />
          <KPICard label="Conv. a cierre" value="10.6%" change={2.1} icon={<TrendingUp className="w-4 h-4" />} />
          <KPICard label="ROI estimado" value="3.2x" change={0.4} icon={<DollarSign className="w-4 h-4" />} />
        </div>
      )}

      {currentRole === 'superadmin' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <KPICard label="Inmobiliarias" value={3} icon={<Users className="w-4 h-4" />} />
          <KPICard label="Proyectos activos" value={12} change={2} icon={<TrendingUp className="w-4 h-4" />} />
          <KPICard label="Leads totales" value={524} change={22} icon={<Users className="w-4 h-4" />} />
          <KPICard label="Cierres mes" value={14} change={27} icon={<DollarSign className="w-4 h-4" />} />
          <KPICard label="Sync activas" value="100%" icon={<FileCheck className="w-4 h-4" />} />
        </div>
      )}

      {/* Main Charts - Equal widths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funnel Chart - Updated with 5 states */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium">Embudo de conversión</CardTitle>
            <CardDescription className="text-xs">
              Estados oficiales del funnel
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FUNNEL_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value} leads`, 'Cantidad']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {FUNNEL_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium">Tendencia mensual</CardTitle>
            <CardDescription className="text-xs">
              Leads vs cierres
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="leads" stroke="#1C5CF5" strokeWidth={2} name="Leads" />
                  <Line type="monotone" dataKey="cierres" stroke="#22C55E" strokeWidth={2} name="Cierres" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel & Ofelia Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Channel Performance */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium">Rendimiento por canal</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-xs">Canal</th>
                    <th className="text-center p-3 font-medium text-xs">Leads</th>
                    <th className="text-center p-3 font-medium text-xs">Cierres</th>
                    <th className="text-center p-3 font-medium text-xs">Conv.</th>
                    <th className="text-center p-3 font-medium text-xs">RF prom</th>
                    <th className="text-right p-3 font-medium text-xs">CPL</th>
                  </tr>
                </thead>
                <tbody>
                  {CHANNEL_PERFORMANCE.map((channel) => (
                    <tr key={channel.channel} className="border-t border-border">
                      <td className="p-3 font-medium">{channel.channel}</td>
                      <td className="p-3 text-center">{channel.leads}</td>
                      <td className="p-3 text-center">{channel.cierres}</td>
                      <td className="p-3 text-center">
                        {((channel.cierres / channel.leads) * 100).toFixed(1)}%
                      </td>
                      <td className="p-3 text-center">{channel.rf.toFixed(1)}</td>
                      <td className="p-3 text-right text-muted-foreground">
                        {channel.cpl > 0 ? `$${(channel.cpl / 1000).toFixed(1)}K` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Ofelia Performance */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium">Performance Ofelia</CardTitle>
            <CardDescription className="text-xs">
              Métricas del flujo documental
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-2 gap-4">
              {OFELIA_DATA.map((item) => (
                <div key={item.metric} className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">{item.metric}</p>
                  <div className="flex items-end justify-between mt-2">
                    <p className="text-xl font-semibold">{item.value}</p>
                    <span className={cn(
                      'text-xs font-medium',
                      item.change > 0 ? 'text-emerald-600' : 'text-destructive'
                    )}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>Tiempo promedio de cierre completo: 12.5 días</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executive & Project Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Executive Performance */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium">Rendimiento por ejecutivo</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-xs">Ejecutivo</th>
                    <th className="text-center p-3 font-medium text-xs">Leads</th>
                    <th className="text-center p-3 font-medium text-xs">Reuniones</th>
                    <th className="text-center p-3 font-medium text-xs">Cierres</th>
                    <th className="text-center p-3 font-medium text-xs">Conv.</th>
                  </tr>
                </thead>
                <tbody>
                  {EXECUTIVE_PERFORMANCE.map((exec) => (
                    <tr key={exec.name} className="border-t border-border">
                      <td className="p-3 font-medium">{exec.name}</td>
                      <td className="p-3 text-center">{exec.leads}</td>
                      <td className="p-3 text-center">{exec.reuniones}</td>
                      <td className="p-3 text-center">{exec.cierres}</td>
                      <td className="p-3 text-center font-medium text-emerald-600">{exec.conversion}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Project Performance */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium">Rendimiento por proyecto</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-xs">Proyecto</th>
                    <th className="text-center p-3 font-medium text-xs">Leads</th>
                    <th className="text-center p-3 font-medium text-xs">Reuniones</th>
                    <th className="text-center p-3 font-medium text-xs">Cierres</th>
                    <th className="text-center p-3 font-medium text-xs">Conv.</th>
                  </tr>
                </thead>
                <tbody>
                  {PROJECT_PERFORMANCE.map((project) => (
                    <tr key={project.name} className="border-t border-border">
                      <td className="p-3 font-medium">{project.name}</td>
                      <td className="p-3 text-center">{project.leads}</td>
                      <td className="p-3 text-center">{project.reuniones}</td>
                      <td className="p-3 text-center">{project.cierres}</td>
                      <td className="p-3 text-center font-medium text-emerald-600">{project.conversion}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}