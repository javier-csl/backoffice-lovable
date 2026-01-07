import { useApp } from '@/context/AppContext';
import { KPICard } from '@/components/common/KPICard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, TrendingUp, DollarSign, Target, BarChart3, PieChart, Activity } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

const CHANNEL_DATA = [
  { channel: 'Meta Ads', leads: 245, conversions: 28, cpl: 12500, rf: 4.2, quality: 78 },
  { channel: 'Google Ads', leads: 189, conversions: 21, cpl: 15000, rf: 3.9, quality: 72 },
  { channel: 'Portal Inmob.', leads: 98, conversions: 8, cpl: 8000, rf: 3.5, quality: 65 },
  { channel: 'Orgánico', leads: 67, conversions: 9, cpl: 0, rf: 4.5, quality: 85 },
  { channel: 'Referidos', leads: 45, conversions: 11, cpl: 0, rf: 4.8, quality: 92 },
];

const CHANNEL_COLORS = ['#1C5CF5', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899'];

const CAMPAIGN_DATA = [
  { campaign: 'vista_cordillera_q1', channel: 'Meta Ads', leads: 89, conversions: 12, spend: 1100000, cpl: 12360 },
  { campaign: 'brand_lascondes', channel: 'Google Ads', leads: 67, conversions: 8, spend: 1005000, cpl: 15000 },
  { campaign: 'alto_lascondes_premium', channel: 'Meta Ads', leads: 56, conversions: 7, spend: 700000, cpl: 12500 },
  { campaign: 'parque_central_awareness', channel: 'Meta Ads', leads: 45, conversions: 4, spend: 540000, cpl: 12000 },
  { campaign: 'remarketing_visitantes', channel: 'Google Ads', leads: 34, conversions: 5, spend: 510000, cpl: 15000 },
];

const TREND_DATA = [
  { month: 'Sep', meta: 45, google: 38, organic: 15, portales: 22 },
  { month: 'Oct', meta: 52, google: 42, organic: 18, portales: 25 },
  { month: 'Nov', meta: 68, google: 55, organic: 22, portales: 28 },
  { month: 'Dic', meta: 75, google: 48, organic: 25, portales: 30 },
  { month: 'Ene', meta: 85, google: 58, organic: 28, portales: 32 },
];

const QUALITY_DATA = [
  { name: 'Válidos', value: 78, color: '#22C55E' },
  { name: 'Duplicados', value: 8, color: '#F59E0B' },
  { name: 'Incompletos', value: 10, color: '#EF4444' },
  { name: 'Basura', value: 4, color: '#6B7280' },
];

export default function Marketing() {
  const { currentRole } = useApp();

  const totalLeads = CHANNEL_DATA.reduce((sum, c) => sum + c.leads, 0);
  const totalConversions = CHANNEL_DATA.reduce((sum, c) => sum + c.conversions, 0);
  const avgCPL = CHANNEL_DATA.filter(c => c.cpl > 0).reduce((sum, c) => sum + c.cpl, 0) / CHANNEL_DATA.filter(c => c.cpl > 0).length;
  const avgRF = CHANNEL_DATA.reduce((sum, c) => sum + c.rf, 0) / CHANNEL_DATA.length;

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Marketing</h1>
          <p className="text-xs text-muted-foreground">Rendimiento de canales y campañas</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Período</Label>
            <Select defaultValue="30d">
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Canal</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-[110px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="meta">Meta Ads</SelectItem>
                <SelectItem value="google">Google Ads</SelectItem>
                <SelectItem value="organic">Orgánico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <KPICard label="Leads totales" value={totalLeads} change={18} icon={<Users className="w-4 h-4" />} />
        <KPICard label="CPL promedio" value={`$${(avgCPL / 1000).toFixed(1)}K`} change={-8} icon={<DollarSign className="w-4 h-4" />} />
        <KPICard label="Conversiones" value={totalConversions} change={12} icon={<Target className="w-4 h-4" />} />
        <KPICard label="Conv. rate" value={`${((totalConversions / totalLeads) * 100).toFixed(1)}%`} change={2.1} icon={<TrendingUp className="w-4 h-4" />} />
        <KPICard label="RialFit prom" value={avgRF.toFixed(1)} change={0.3} icon={<BarChart3 className="w-4 h-4" />} />
        <KPICard label="ROI estimado" value="3.2x" change={0.4} icon={<Activity className="w-4 h-4" />} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Leads by Channel */}
        <Card>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium">Leads por canal</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHANNEL_DATA}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="channel" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '11px' }} />
                  <Bar dataKey="leads" radius={[4, 4, 0, 0]}>
                    {CHANNEL_DATA.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend by Channel */}
        <Card>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium">Tendencia por canal</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1C5CF5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1C5CF5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '9px' }} />
                  <Area type="monotone" dataKey="meta" stroke="#1C5CF5" fill="url(#colorMeta)" strokeWidth={2} name="Meta Ads" />
                  <Area type="monotone" dataKey="google" stroke="#22C55E" fill="url(#colorGoogle)" strokeWidth={2} name="Google Ads" />
                  <Line type="monotone" dataKey="organic" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Orgánico" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Channel Performance */}
        <Card>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium">Rendimiento por canal</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-medium">Canal</th>
                    <th className="text-center p-2 font-medium">Leads</th>
                    <th className="text-center p-2 font-medium">Conv.</th>
                    <th className="text-center p-2 font-medium">%</th>
                    <th className="text-center p-2 font-medium">RF</th>
                    <th className="text-right p-2 font-medium">CPL</th>
                  </tr>
                </thead>
                <tbody>
                  {CHANNEL_DATA.map((channel, i) => (
                    <tr key={channel.channel} className="border-t border-border">
                      <td className="p-2 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHANNEL_COLORS[i] }} />
                        {channel.channel}
                      </td>
                      <td className="p-2 text-center">{channel.leads}</td>
                      <td className="p-2 text-center">{channel.conversions}</td>
                      <td className="p-2 text-center">{((channel.conversions / channel.leads) * 100).toFixed(1)}%</td>
                      <td className="p-2 text-center">{channel.rf.toFixed(1)}</td>
                      <td className="p-2 text-right text-muted-foreground">
                        {channel.cpl > 0 ? `$${(channel.cpl / 1000).toFixed(1)}K` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <Card>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium">Campañas activas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-medium">Campaña</th>
                    <th className="text-left p-2 font-medium">Canal</th>
                    <th className="text-center p-2 font-medium">Leads</th>
                    <th className="text-center p-2 font-medium">Conv.</th>
                    <th className="text-right p-2 font-medium">CPL</th>
                  </tr>
                </thead>
                <tbody>
                  {CAMPAIGN_DATA.map((campaign) => (
                    <tr key={campaign.campaign} className="border-t border-border">
                      <td className="p-2 font-medium truncate max-w-[120px]">{campaign.campaign}</td>
                      <td className="p-2 text-muted-foreground">{campaign.channel}</td>
                      <td className="p-2 text-center">{campaign.leads}</td>
                      <td className="p-2 text-center">{campaign.conversions}</td>
                      <td className="p-2 text-right">${(campaign.cpl / 1000).toFixed(1)}K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality & Attribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Lead Quality */}
        <Card>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium">Calidad de leads</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-2">
            <div className="space-y-2">
              {QUALITY_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs flex-1">{item.name}</span>
                  <span className="text-xs font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* UTM Attribution */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium">Atribución UTM</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-medium">UTM Source</th>
                    <th className="text-left p-2 font-medium">UTM Medium</th>
                    <th className="text-left p-2 font-medium">UTM Campaign</th>
                    <th className="text-center p-2 font-medium">Leads</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-2">facebook</td>
                    <td className="p-2">cpc</td>
                    <td className="p-2">vista_cordillera_q1</td>
                    <td className="p-2 text-center">89</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-2">google</td>
                    <td className="p-2">cpc</td>
                    <td className="p-2">brand_lascondes</td>
                    <td className="p-2 text-center">67</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-2">instagram</td>
                    <td className="p-2">cpc</td>
                    <td className="p-2">alto_lascondes_premium</td>
                    <td className="p-2 text-center">56</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-2">google</td>
                    <td className="p-2">display</td>
                    <td className="p-2">remarketing_visitantes</td>
                    <td className="p-2 text-center">34</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
