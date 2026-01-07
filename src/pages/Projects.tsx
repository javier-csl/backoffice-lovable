import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PROJECTS } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, LayoutGrid, List, MapPin, MoreHorizontal, Eye, Edit, RefreshCw, Plus, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';

const STATUS_CONFIG = {
  activo: { label: 'Activo', color: 'bg-emerald-500/10 text-emerald-600' },
  pausado: { label: 'Pausado', color: 'bg-amber-500/10 text-amber-600' },
  cerrado: { label: 'Cerrado', color: 'bg-muted text-muted-foreground' },
  invisible: { label: 'Invisible', color: 'bg-slate-500/10 text-slate-500' },
};

export default function Projects() {
  const [view, setView] = useState<'cards' | 'table'>('table');
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const filteredProjects = MOCK_PROJECTS.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase()) ||
    project.comuna.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in px-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg font-semibold">Proyectos</h1>
          <p className="text-xs text-muted-foreground">{MOCK_PROJECTS.length} proyectos</p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          {/* Create button - desktop */}
          <Button className="hidden sm:flex" onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear proyecto
          </Button>
          {/* Search */}
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Nombre, comuna..." 
                className="pl-9 w-[160px] sm:w-[180px] h-9 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filters with labels */}
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Estado</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-[110px] h-9 text-xs">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
                <SelectItem value="cerrado">Cerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Comuna</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-[130px] h-9 text-xs">
                <SelectValue placeholder="Comuna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="las-condes">Las Condes</SelectItem>
                <SelectItem value="providencia">Providencia</SelectItem>
                <SelectItem value="vina">Viña del Mar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex border border-border rounded-md">
            <Button
              variant={view === 'table' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => setView('table')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={view === 'cards' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setView('cards')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto relative">
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none z-10 md:hidden" />
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-xs">Nombre</th>
                  <th className="text-left p-3 font-medium text-xs">Comuna</th>
                  <th className="text-right p-3 font-medium text-xs">UF desde</th>
                  <th className="text-right p-3 font-medium text-xs">UF hasta</th>
                  <th className="text-center p-3 font-medium text-xs">Leads</th>
                  <th className="text-center p-3 font-medium text-xs">RF prom.</th>
                  <th className="text-center p-3 font-medium text-xs">Reservas</th>
                  <th className="text-center p-3 font-medium text-xs">Estado</th>
                  <th className="text-left p-3 font-medium text-xs">Última sync</th>
                  <th className="text-center p-3 font-medium text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <Link to={`/proyectos/${project.id}`} className="font-medium text-sm hover:text-primary">
                        {project.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{project.inmobiliariaName}</p>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{project.comuna}</td>
                    <td className="p-3 text-right text-sm">{project.priceFrom?.toLocaleString() || '-'}</td>
                    <td className="p-3 text-right text-sm">{project.priceTo?.toLocaleString() || '-'}</td>
                    <td className="p-3 text-center font-medium text-sm">{project.leadsCount}</td>
                    <td className="p-3 text-center text-sm">{project.rialFitAvg.toFixed(1)}</td>
                    <td className="p-3 text-center text-sm">{project.closedCount}</td>
                    <td className="p-3 text-center">
                      <Badge className={STATUS_CONFIG[project.status].color}>
                        {STATUS_CONFIG[project.status].label}
                      </Badge>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {project.lastSync ? formatDistanceToNow(new Date(project.lastSync), { addSuffix: true, locale: es }) : '-'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link to={`/proyectos/${project.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Sincronizar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cards View */}
      {view === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Link key={project.id} to={`/proyectos/${project.id}`}>
              <div className="bg-card rounded-lg border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-sm">{project.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {project.comuna}
                    </p>
                  </div>
                  <Badge className={cn('text-xs', STATUS_CONFIG[project.status].color)}>
                    {STATUS_CONFIG[project.status].label}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{project.inmobiliariaName}</span>
                  <span className="font-medium text-foreground">
                    UF {project.priceFrom?.toLocaleString() || '-'} - {project.priceTo?.toLocaleString() || '-'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 pt-3 border-t border-border text-center">
                  <div>
                    <p className="text-base font-semibold">{project.leadsCount}</p>
                    <p className="text-[10px] text-muted-foreground">Leads</p>
                  </div>
                  <div>
                    <p className="text-base font-semibold">{project.rialFitAvg.toFixed(1)}</p>
                    <p className="text-[10px] text-muted-foreground">RF prom</p>
                  </div>
                  <div>
                    <p className="text-base font-semibold">{project.closedCount}</p>
                    <p className="text-[10px] text-muted-foreground">Cierres</p>
                  </div>
                  <div>
                    <p className="text-base font-semibold">{(project.pipelineUF / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] text-muted-foreground">Pipeline</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* FAB for mobile */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg sm:hidden z-50"
        size="icon"
        onClick={() => setCreateModalOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Create Project Modal */}
      <CreateProjectModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
}
