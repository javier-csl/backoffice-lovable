import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MOCK_LEADS, MOCK_PROJECTS } from '@/data/mockData';
import { Lead, LeadStatus, LEAD_STATUS_CONFIG, KANBAN_COLUMNS } from '@/types';
import { RialFitBadge } from '@/components/common/RialFitBadge';
import { OfeliaBadge } from '@/components/common/OfeliaBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Clock, 
  Phone, 
  Eye, 
  UserPlus, 
  StickyNote,
  MoreHorizontal,
  FileText,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface KanbanLeads {
  [key: string]: Lead[];
}

function groupLeadsByStatus(leads: Lead[]): KanbanLeads {
  return KANBAN_COLUMNS.reduce((acc, status) => {
    acc[status] = leads.filter(lead => lead.status === status);
    return acc;
  }, {} as KanbanLeads);
}

function LeadCard({ lead, index }: { lead: Lead; index: number }) {
  const timeAgo = formatDistanceToNow(new Date(lead.lastActivity), { 
    addSuffix: false, 
    locale: es 
  });

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'bg-kanban-card rounded-lg border border-border p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/20 mb-3',
            snapshot.isDragging && 'shadow-lg ring-2 ring-primary/20'
          )}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <Link to={`/leads/${lead.id}`} className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate hover:text-primary">{lead.name}</h4>
            </Link>
            <div className="flex items-center gap-1.5">
              <RialFitBadge score={lead.rialFitScore} showLabel={false} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 -mr-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to={`/leads/${lead.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver lead
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="w-4 h-4 mr-2" />
                    Editar contacto
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Ver documentos
                  </DropdownMenuItem>
                  {lead.preEvaluationStatus !== 'pendiente' && (
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver pre-evaluación
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Cambiar estado
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <XCircle className="w-4 h-4 mr-2" />
                    Marcar como perdido
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mb-2">
            {lead.projectName} – {lead.comuna}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">{lead.ticketUF.toLocaleString()} UF</span>
            <span className="text-xs text-muted-foreground">{lead.channel}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              hace {timeAgo}
            </div>
            <OfeliaBadge status={lead.ofeliaStatus} />
          </div>
        </div>
      )}
    </Draggable>
  );
}

function KanbanColumn({ status, leads }: { status: LeadStatus; leads: Lead[] }) {
  const config = LEAD_STATUS_CONFIG[status];
  const totalUF = leads.reduce((sum, lead) => sum + lead.ticketUF, 0);

  return (
    <div className="bg-kanban-column rounded-lg min-h-[450px] w-[260px] flex-shrink-0 snap-start">
      <div className="p-4 border-b border-border sticky top-0 bg-kanban-column z-10">
        <div className="flex items-center gap-2">
          <span className={cn('w-3 h-3 rounded-full', config.color)} />
          <h3 className="text-sm font-medium truncate flex-1">{config.label}</h3>
          <Badge variant="secondary" className="h-6 text-xs px-2">
            {leads.length}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          {(totalUF / 1000).toFixed(0)}K UF
        </p>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'p-3 min-h-[380px] transition-colors',
              snapshot.isDraggingOver && 'bg-primary/5'
            )}
          >
            {leads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default function Leads() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [search, setSearch] = useState('');
  const [closedWonModal, setClosedWonModal] = useState<Lead | null>(null);
  const [closedLostModal, setClosedLostModal] = useState<Lead | null>(null);

  const kanbanLeads = groupLeadsByStatus(leads);

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.email.toLowerCase().includes(search.toLowerCase()) ||
    lead.projectName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as LeadStatus;
    const lead = leads.find(l => l.id === draggableId);
    
    if (!lead) return;

    if (newStatus === 'ganado') {
      setClosedWonModal(lead);
      return;
    }
    if (newStatus === 'perdido') {
      setClosedLostModal(lead);
      return;
    }

    setLeads(prev => prev.map(l => 
      l.id === draggableId ? { ...l, status: newStatus } : l
    ));
  };

  const confirmClosedWon = () => {
    if (!closedWonModal) return;
    setLeads(prev => prev.map(l => 
      l.id === closedWonModal.id ? { ...l, status: 'ganado' as LeadStatus } : l
    ));
    setClosedWonModal(null);
  };

  const confirmClosedLost = () => {
    if (!closedLostModal) return;
    setLeads(prev => prev.map(l => 
      l.id === closedLostModal.id ? { ...l, status: 'perdido' as LeadStatus } : l
    ));
    setClosedLostModal(null);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-semibold">Leads</h1>
          <p className="text-sm text-muted-foreground">{leads.length} leads en total</p>
        </div>
        
        <div className="flex flex-wrap items-end gap-3">
          {/* Search */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Nombre, email..." 
                className="pl-9 w-[160px] sm:w-[200px] h-9 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filters with labels */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Proyecto</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] h-9 text-sm">
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

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Canal</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-[120px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="meta">Meta Ads</SelectItem>
                <SelectItem value="google">Google Ads</SelectItem>
                <SelectItem value="organic">Orgánico</SelectItem>
                <SelectItem value="referral">Referidos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Estado</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-[130px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {KANBAN_COLUMNS.map(status => (
                  <SelectItem key={status} value={status}>
                    {LEAD_STATUS_CONFIG[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex border border-border rounded-md">
            <Button
              variant={view === 'kanban' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => setView('kanban')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={view === 'table' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setView('table')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto scrollbar-thin snap-x snap-mandatory relative pb-4">
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 md:hidden" />
            <div className="flex gap-4 min-w-max">
              {KANBAN_COLUMNS.map((status) => (
                <KanbanColumn 
                  key={status} 
                  status={status} 
                  leads={kanbanLeads[status] || []} 
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="flex-1 overflow-hidden bg-card rounded-lg border border-border">
          <div className="overflow-x-auto relative">
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent pointer-events-none z-10 md:hidden" />
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left p-4 font-medium text-xs">Lead</th>
                  <th className="text-left p-4 font-medium text-xs">Proyecto</th>
                  <th className="text-left p-4 font-medium text-xs">RialFit</th>
                  <th className="text-right p-4 font-medium text-xs">Ticket UF</th>
                  <th className="text-left p-4 font-medium text-xs">Canal</th>
                  <th className="text-left p-4 font-medium text-xs">Última actividad</th>
                  <th className="text-left p-4 font-medium text-xs">Estado</th>
                  <th className="text-left p-4 font-medium text-xs">Ofelia</th>
                  <th className="text-center p-4 font-medium text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <Link to={`/leads/${lead.id}`} className="font-medium text-sm hover:text-primary">
                        {lead.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{lead.projectName}</span>
                      <p className="text-xs text-muted-foreground">{lead.comuna}</p>
                    </td>
                    <td className="p-4">
                      <RialFitBadge score={lead.rialFitScore} />
                    </td>
                    <td className="p-4 text-right text-sm font-medium">{lead.ticketUF.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="text-sm">{lead.channel}</span>
                      <p className="text-xs text-muted-foreground capitalize">{lead.channelGroup}</p>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(lead.lastActivity), { addSuffix: true, locale: es })}
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-2">
                        <span className={cn('w-2.5 h-2.5 rounded-full', LEAD_STATUS_CONFIG[lead.status].color)} />
                        <span className="text-sm">{LEAD_STATUS_CONFIG[lead.status].label}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <OfeliaBadge status={lead.ofeliaStatus} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link to={`/leads/${lead.id}`}>
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
                              <Phone className="w-4 h-4 mr-2" />
                              Llamar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Asignar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <StickyNote className="w-4 h-4 mr-2" />
                              Agregar nota
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

      {/* Closed Won Modal */}
      <Dialog open={!!closedWonModal} onOpenChange={() => setClosedWonModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar cierre ganado</DialogTitle>
            <DialogDescription>
              Registra los datos del cierre para {closedWonModal?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Valor de cierre (UF)</Label>
              <Input type="number" defaultValue={closedWonModal?.ticketUF} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea placeholder="Detalles del cierre..." className="min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClosedWonModal(null)}>Cancelar</Button>
            <Button onClick={confirmClosedWon}>Confirmar cierre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Closed Lost Modal */}
      <Dialog open={!!closedLostModal} onOpenChange={() => setClosedLostModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Marcar como perdido</DialogTitle>
            <DialogDescription>
              Indica el motivo de pérdida para {closedLostModal?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Motivo de pérdida</Label>
              <Select>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Precio fuera de rango</SelectItem>
                  <SelectItem value="financing">No calificó financieramente</SelectItem>
                  <SelectItem value="location">Ubicación no conveniente</SelectItem>
                  <SelectItem value="competitor">Eligió competencia</SelectItem>
                  <SelectItem value="timing">Timing inadecuado</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notas adicionales</Label>
              <Textarea placeholder="Detalles adicionales..." className="min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClosedLostModal(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmClosedLost}>Confirmar pérdida</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}