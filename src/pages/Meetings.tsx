import { useState } from 'react';
import { MOCK_MEETINGS, MOCK_PROJECTS } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Video, Phone, MapPin, List, CalendarDays, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const TYPE_CONFIG = {
  presencial: { label: 'Presencial', icon: MapPin, color: 'bg-blue-500/10 text-blue-600' },
  showroom: { label: 'Showroom', icon: MapPin, color: 'bg-purple-500/10 text-purple-600' },
  videollamada: { label: 'Videollamada', icon: Video, color: 'bg-emerald-500/10 text-emerald-600' },
  llamada: { label: 'Llamada', icon: Phone, color: 'bg-amber-500/10 text-amber-600' },
};

const STATUS_CONFIG = {
  pendiente: { label: 'Pendiente', color: 'bg-primary/10 text-primary' },
  realizada: { label: 'Realizada', color: 'bg-emerald-500/10 text-emerald-600' },
  cancelada: { label: 'Cancelada', color: 'bg-muted text-muted-foreground' },
  no_asistio: { label: 'No asistió', color: 'bg-destructive/10 text-destructive' },
};

export default function Meetings() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('month');
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: startOfWeek(monthStart, { weekStartsOn: 1 }), end: addDays(endOfMonth(currentDate), 6 - endOfMonth(currentDate).getDay()) });
  
  const today = new Date();

  const upcomingMeetings = MOCK_MEETINGS.filter(m => m.status === 'pendiente').sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const pastMeetings = MOCK_MEETINGS.filter(m => m.status !== 'pendiente');

  const getMeetingsForDay = (day: Date) => {
    return MOCK_MEETINGS.filter(m => 
      isSameDay(new Date(m.date), day) && m.status === 'pendiente'
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-semibold">Reuniones</h1>
          <p className="text-sm text-muted-foreground">
            {upcomingMeetings.length} reuniones pendientes
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
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

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tipo</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="showroom">Showroom</SelectItem>
                <SelectItem value="videollamada">Videollamada</SelectItem>
                <SelectItem value="llamada">Llamada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex border border-border rounded-md">
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => setView('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={view === 'calendar' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setView('calendar')}
            >
              <CalendarDays className="w-4 h-4" />
            </Button>
          </div>

          <Button size="sm" className="h-9" onClick={() => setShowNewMeetingModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva reunión
          </Button>
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-5">
          {/* Upcoming */}
          <Card>
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-medium">Próximas reuniones</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingMeetings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Sin reuniones pendientes</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-xs">Fecha</th>
                        <th className="text-left p-4 font-medium text-xs">Lead</th>
                        <th className="text-left p-4 font-medium text-xs">Proyecto</th>
                        <th className="text-left p-4 font-medium text-xs">Tipo</th>
                        <th className="text-left p-4 font-medium text-xs">Participantes</th>
                        <th className="text-center p-4 font-medium text-xs">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingMeetings.map((meeting) => {
                        const TypeIcon = TYPE_CONFIG[meeting.type].icon;
                        return (
                          <tr key={meeting.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <p className="font-medium text-sm">{format(new Date(meeting.date), 'd MMM', { locale: es })}</p>
                              <p className="text-xs text-muted-foreground">{meeting.time}</p>
                            </td>
                            <td className="p-4">
                              <Link to={`/leads/${meeting.leadId}`} className="font-medium text-sm hover:text-primary">
                                {meeting.leadName}
                              </Link>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{meeting.projectName}</td>
                            <td className="p-4">
                              <Badge className={cn('text-xs', TYPE_CONFIG[meeting.type].color)}>
                                <TypeIcon className="w-3 h-3 mr-1" />
                                {TYPE_CONFIG[meeting.type].label}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Users className="w-3.5 h-3.5" />
                                {meeting.participants.join(', ')}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-1">
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-emerald-600">
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                  Realizada
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive">
                                  <XCircle className="w-3.5 h-3.5 mr-1" />
                                  Cancelar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past */}
          {pastMeetings.length > 0 && (
            <Card>
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-medium">Reuniones pasadas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-xs">Fecha</th>
                        <th className="text-left p-4 font-medium text-xs">Lead</th>
                        <th className="text-left p-4 font-medium text-xs">Proyecto</th>
                        <th className="text-left p-4 font-medium text-xs">Tipo</th>
                        <th className="text-center p-4 font-medium text-xs">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastMeetings.map((meeting) => {
                        const TypeIcon = TYPE_CONFIG[meeting.type].icon;
                        return (
                          <tr key={meeting.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <p className="font-medium text-sm">{format(new Date(meeting.date), 'd MMM', { locale: es })}</p>
                              <p className="text-xs text-muted-foreground">{meeting.time}</p>
                            </td>
                            <td className="p-4">
                              <Link to={`/leads/${meeting.leadId}`} className="font-medium text-sm hover:text-primary">
                                {meeting.leadName}
                              </Link>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{meeting.projectName}</td>
                            <td className="p-4">
                              <span className="flex items-center gap-1.5 text-sm">
                                <TypeIcon className="w-3.5 h-3.5" />
                                {TYPE_CONFIG[meeting.type].label}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <Badge className={STATUS_CONFIG[meeting.status].color}>
                                {STATUS_CONFIG[meeting.status].label}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-sm font-medium">
                  {calendarView === 'month' 
                    ? format(currentDate, "MMMM yyyy", { locale: es })
                    : `Semana del ${format(weekStart, "d 'de' MMMM yyyy", { locale: es })}`
                  }
                </CardTitle>
                <div className="flex border border-border rounded-md">
                  <Button
                    variant={calendarView === 'week' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-7 text-xs rounded-r-none px-3"
                    onClick={() => setCalendarView('week')}
                  >
                    Semana
                  </Button>
                  <Button
                    variant={calendarView === 'month' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-7 text-xs rounded-l-none px-3"
                    onClick={() => setCalendarView('month')}
                  >
                    Mes
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentDate(calendarView === 'month' ? subMonths(currentDate, 1) : subWeeks(currentDate, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Hoy
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentDate(calendarView === 'month' ? addMonths(currentDate, 1) : addWeeks(currentDate, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {/* Week View */}
            {calendarView === 'week' && (
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const isToday = isSameDay(day, today);
                  const dayMeetings = getMeetingsForDay(day);

                  return (
                    <div 
                      key={day.toISOString()} 
                      className={cn(
                        'bg-muted/30 rounded-lg p-3 min-h-[160px] transition-all',
                        isToday && 'ring-2 ring-primary/30 bg-primary/5'
                      )}
                    >
                      <div className="text-center mb-3 pb-2 border-b border-border">
                        <p className="text-xs text-muted-foreground uppercase font-medium">
                          {format(day, 'EEE', { locale: es })}
                        </p>
                        <p className={cn(
                          'text-xl font-semibold mt-0.5',
                          isToday && 'text-primary'
                        )}>
                          {format(day, 'd')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {dayMeetings.map((meeting) => {
                          const TypeIcon = TYPE_CONFIG[meeting.type].icon;
                          return (
                            <div 
                              key={meeting.id}
                              className="bg-primary/10 text-primary rounded-md p-2 text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                            >
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <TypeIcon className="w-3 h-3" />
                                <span className="font-medium">{meeting.time}</span>
                              </div>
                              <p className="truncate text-[11px]">{meeting.leadName}</p>
                            </div>
                          );
                        })}
                        {dayMeetings.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-3">Sin reuniones</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Month View */}
            {calendarView === 'month' && (
              <div>
                {/* Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((day) => {
                    const isToday = isSameDay(day, today);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const dayMeetings = getMeetingsForDay(day);

                    return (
                      <div 
                        key={day.toISOString()} 
                        className={cn(
                          'min-h-[90px] p-2 rounded-lg transition-all',
                          isCurrentMonth ? 'bg-muted/30' : 'bg-muted/10',
                          isToday && 'ring-2 ring-primary/30 bg-primary/5'
                        )}
                      >
                        <p className={cn(
                          'text-sm font-medium mb-1',
                          !isCurrentMonth && 'text-muted-foreground/50',
                          isToday && 'text-primary'
                        )}>
                          {format(day, 'd')}
                        </p>
                        <div className="space-y-1">
                          {dayMeetings.slice(0, 2).map((meeting) => (
                            <div 
                              key={meeting.id}
                              className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] truncate cursor-pointer hover:bg-primary/20"
                            >
                              {meeting.time} - {meeting.leadName}
                            </div>
                          ))}
                          {dayMeetings.length > 2 && (
                            <p className="text-[10px] text-muted-foreground">+{dayMeetings.length - 2} más</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* New Meeting Modal */}
      <Dialog open={showNewMeetingModal} onOpenChange={setShowNewMeetingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar reunión</DialogTitle>
            <DialogDescription>
              Programa una nueva reunión con un lead
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input type="date" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <Input type="time" className="h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Proyecto</Label>
              <Select>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PROJECTS.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lead</Label>
              <Input placeholder="Buscar lead..." className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de reunión</Label>
              <Select>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="showroom">Showroom</SelectItem>
                  <SelectItem value="videollamada">Videollamada</SelectItem>
                  <SelectItem value="llamada">Llamada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notas (opcional)</Label>
              <Textarea placeholder="Notas adicionales..." className="min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewMeetingModal(false)}>Cancelar</Button>
            <Button onClick={() => setShowNewMeetingModal(false)}>Agendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}