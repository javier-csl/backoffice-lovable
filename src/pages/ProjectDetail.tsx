import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { getProjectById, MOCK_LEADS } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  TrendingUp, 
  DollarSign, 
  FileCheck,
  Edit,
  ExternalLink,
  RefreshCw,
  Upload,
  Image,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type TabId = 'vista-general' | 'informacion' | 'imagenes' | 'integracion';

const TABS: { id: TabId; label: string }[] = [
  { id: 'vista-general', label: 'Vista general' },
  { id: 'informacion', label: 'Información' },
  { id: 'imagenes', label: 'Imágenes' },
  { id: 'integracion', label: 'Integración' },
];

const STATUS_CONFIG = {
  activo: { label: 'Activo', color: 'bg-emerald-500/10 text-emerald-600' },
  pausado: { label: 'Pausado', color: 'bg-amber-500/10 text-amber-600' },
  cerrado: { label: 'Cerrado', color: 'bg-muted text-muted-foreground' },
};

const LEADS_DATA = [
  { month: 'Sep', leads: 12 },
  { month: 'Oct', leads: 18 },
  { month: 'Nov', leads: 25 },
  { month: 'Dic', leads: 32 },
  { month: 'Ene', leads: 45 },
];

const CHANNEL_DATA = [
  { name: 'Meta Ads', value: 45, color: '#1C5CF5' },
  { name: 'Google Ads', value: 30, color: '#22C55E' },
  { name: 'Portales', value: 15, color: '#F59E0B' },
  { name: 'Referidos', value: 10, color: '#EC4899' },
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabId>('vista-general');
  
  const project = getProjectById(id || '');
  const projectLeads = MOCK_LEADS.filter(l => l.projectId === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">Proyecto no encontrado</p>
        <Link to="/proyectos">
          <Button variant="link">Volver a proyectos</Button>
        </Link>
      </div>
    );
  }

  const conversionRate = project.closedCount > 0 ? ((project.closedCount / project.leadsCount) * 100).toFixed(1) : '0';

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <Link to="/proyectos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
        <ArrowLeft className="w-4 h-4" />
        Volver a proyectos
      </Link>

      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold">{project.name}</h1>
              <Badge className={STATUS_CONFIG[project.status].color}>
                {STATUS_CONFIG[project.status].label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{project.inmobiliariaName}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {project.comuna}, {project.city}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Link to={`/leads?project=${project.id}`}>
              <Button size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver leads
              </Button>
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-5 gap-3">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">{project.leadsCount}</p>
              <p className="text-[10px] text-muted-foreground">Leads</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">{project.rialFitAvg.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground">RF prom</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">{project.closedCount}</p>
              <p className="text-[10px] text-muted-foreground">Cierres</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">{(project.pipelineUF / 1000).toFixed(0)}K</p>
              <p className="text-[10px] text-muted-foreground">Pipeline UF</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <FileCheck className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">{conversionRate}%</p>
              <p className="text-[10px] text-muted-foreground">Conversión</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-4">
        <nav className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'tab-button',
                activeTab === tab.id && 'tab-button-active'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'vista-general' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Leads by Month Chart */}
            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Evolución de leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={LEADS_DATA}>
                      <defs>
                        <linearGradient id="colorLeadsProject" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1C5CF5" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#1C5CF5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                      <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }} 
                      />
                      <Area type="monotone" dataKey="leads" stroke="#1C5CF5" fill="url(#colorLeadsProject)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Channel Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Por canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CHANNEL_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={55}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {CHANNEL_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CHANNEL_DATA.map((item) => (
                    <div key={item.name} className="flex items-center gap-1 text-[10px]">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Leads */}
            <Card className="col-span-3">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Últimos leads</CardTitle>
                  <Link to={`/leads?project=${project.id}`}>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      Ver todos →
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2 font-medium text-xs">Lead</th>
                      <th className="text-left p-2 font-medium text-xs">RialFit</th>
                      <th className="text-left p-2 font-medium text-xs">Canal</th>
                      <th className="text-left p-2 font-medium text-xs">Estado</th>
                      <th className="text-left p-2 font-medium text-xs">Última actividad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectLeads.slice(0, 5).map((lead) => (
                      <tr key={lead.id} className="border-t border-border">
                        <td className="p-2">
                          <Link to={`/leads/${lead.id}`} className="font-medium text-sm hover:text-primary">
                            {lead.name}
                          </Link>
                        </td>
                        <td className="p-2">
                          <Badge variant="secondary" className="text-[10px]">
                            RF {lead.rialFitScore}/5
                          </Badge>
                        </td>
                        <td className="p-2 text-xs text-muted-foreground">{lead.channel}</td>
                        <td className="p-2 text-xs">{lead.status.replace('_', ' ')}</td>
                        <td className="p-2 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(lead.lastActivity), { addSuffix: true, locale: es })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'informacion' && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Información general</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Nombre del proyecto</Label>
                  <Input value={project.name} className="mt-1 h-8" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Comuna</Label>
                    <Input value={project.comuna} className="mt-1 h-8" />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Ciudad</Label>
                    <Input value={project.city} className="mt-1 h-8" />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Descripción</Label>
                  <Textarea placeholder="Descripción del proyecto..." className="mt-1 min-h-[80px]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Detalles comerciales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Precio desde (UF)</Label>
                    <Input type="number" value={project.priceFrom || ''} className="mt-1 h-8" />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Precio hasta (UF)</Label>
                    <Input type="number" value={project.priceTo || ''} className="mt-1 h-8" />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Tipologías</Label>
                  <Input placeholder="Ej: 1D+1B, 2D+2B, 3D+2B" className="mt-1 h-8" />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Fecha entrega estimada</Label>
                  <Input type="date" className="mt-1 h-8" />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Amenities</Label>
                  <Input placeholder="Piscina, Gimnasio, Quincho..." className="mt-1 h-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Estado del proyecto</p>
                    <p className="text-xs text-muted-foreground">El proyecto se muestra en el screening público</p>
                  </div>
                  <Badge className={STATUS_CONFIG[project.status].color}>
                    {STATUS_CONFIG[project.status].label}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm">Guardar cambios</Button>
                  <Button size="sm" variant="outline">Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'imagenes' && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Galería de imágenes</CardTitle>
                <CardDescription className="text-xs">Sube y organiza las imágenes del proyecto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-muted-foreground" />
                    </div>
                  ))}
                  <div className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Subir imagen</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Arrastra las imágenes para reordenar. La primera será la imagen principal.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'integracion' && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Estado de sincronización</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">PlanOK</p>
                      <p className="text-xs text-muted-foreground">Conectado y sincronizando</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600">Activo</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-border">
                  <div>
                    <p className="text-lg font-semibold">
                      {project.lastSync ? formatDistanceToNow(new Date(project.lastSync), { addSuffix: true, locale: es }) : '-'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Última sincronización</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">15</p>
                    <p className="text-[10px] text-muted-foreground">Unidades sincronizadas</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">0</p>
                    <p className="text-[10px] text-muted-foreground">Errores</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="mt-4">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Forzar sincronización
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Logs recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>10/01/2024 08:00 - Sincronización completada (15 unidades)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>09/01/2024 22:00 - Sincronización completada (15 unidades)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>09/01/2024 08:00 - Advertencia: 2 unidades sin precio</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
