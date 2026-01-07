import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLeadById, getMeetingsByLeadId, MOCK_ACTIVITY, MOCK_DOCUMENTS } from '@/data/mockData';
import { RialFitBadge } from '@/components/common/RialFitBadge';
import { OfeliaBadge } from '@/components/common/OfeliaBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LeadStatus, LEAD_STATUS_CONFIG, RIALFIT_LABELS } from '@/types';
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  Eye,
  XCircle,
  RefreshCw,
  Download,
  FileText,
  User,
  MessageCircle,
  PhoneCall,
  FileCheck,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

type TabId = 'resumen' | 'screening' | 'documentos' | 'actividad' | 'reuniones';

const TABS: { id: TabId; label: string }[] = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'screening', label: 'Screening' },
  { id: 'documentos', label: 'Documentos / Ofelia' },
  { id: 'actividad', label: 'Actividad' },
  { id: 'reuniones', label: 'Reuniones' },
];

const DOC_STATUS_CONFIG = {
  pendiente: { label: 'Pendiente', color: 'bg-muted text-muted-foreground', icon: Clock },
  subido: { label: 'Subido', color: 'bg-blue-500/10 text-blue-600', icon: FileText },
  revisar: { label: 'Revisar', color: 'bg-amber-500/10 text-amber-600', icon: AlertCircle },
  rechazado: { label: 'Rechazado', color: 'bg-destructive/10 text-destructive', icon: XCircle },
  aprobado: { label: 'Aprobado', color: 'bg-emerald-500/10 text-emerald-600', icon: CheckCircle2 },
};

const ACTIVITY_ICONS = {
  status: Clock,
  document: FileText,
  contact: PhoneCall,
  message: MessageCircle,
  meeting: Calendar,
  note: MessageSquare,
};

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabId>('resumen');
  
  const lead = getLeadById(id || '');
  const meetings = getMeetingsByLeadId(id || '');

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">Lead no encontrado</p>
        <Link to="/leads">
          <Button variant="link">Volver a leads</Button>
        </Link>
      </div>
    );
  }

  const documentsApproved = MOCK_DOCUMENTS.filter(d => d.status === 'aprobado').length;
  const documentsTotal = MOCK_DOCUMENTS.length;
  const documentProgress = (documentsApproved / documentsTotal) * 100;

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <Link to="/leads" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
        <ArrowLeft className="w-4 h-4" />
        Volver a leads
      </Link>

      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold">{lead.name}</h1>
              <Badge variant="secondary" className="font-normal">
                {lead.projectName}
              </Badge>
              <RialFitBadge score={lead.rialFitScore} size="md" />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {lead.comuna}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Última actividad: {formatDistanceToNow(new Date(lead.lastActivity), { addSuffix: true, locale: es })}
              </span>
              <OfeliaBadge status={lead.ofeliaStatus} size="md" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select defaultValue={lead.status}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', config.color)} />
                      {config.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          <Button size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Agendar reunión
          </Button>
          <Button size="sm" variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Agregar nota
          </Button>
          <Button size="sm" variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Registrar contacto
          </Button>
          <Button size="sm" variant="outline" className="text-destructive hover:text-destructive ml-auto">
            <XCircle className="w-4 h-4 mr-2" />
            Marcar como perdido
          </Button>
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
        {activeTab === 'resumen' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm hover:text-primary">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {lead.email}
                </a>
                <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm hover:text-primary">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {lead.phone}
                </a>
                <div className="pt-2 border-t border-border space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Canal</p>
                      <p className="text-sm">{lead.channel}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Grupo</p>
                      <p className="text-sm capitalize">{lead.channelGroup}</p>
                    </div>
                  </div>
                  {lead.utmSource && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground">UTM Source</p>
                        <p className="text-xs">{lead.utmSource}</p>
                      </div>
                      {lead.utmCampaign && (
                        <div>
                          <p className="text-[10px] text-muted-foreground">UTM Campaign</p>
                          <p className="text-xs truncate">{lead.utmCampaign}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="pt-2 border-t border-border flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8">
                    <Phone className="w-3 h-3 mr-1" />
                    Llamar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Financial Data */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Datos financieros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-[10px] text-muted-foreground">Ticket esperado</p>
                  <p className="text-lg font-semibold">{lead.ticketUF.toLocaleString()} UF</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Renta declarada</p>
                    <p className="text-sm">$1.800.000 - $2.500.000</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Ahorro mensual</p>
                    <p className="text-sm">$400.000</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Pie disponible</p>
                    <p className="text-sm">15% (~675 UF)</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Est. crédito</p>
                    <p className="text-sm">3.825 UF</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-[10px] text-muted-foreground mb-1">RialFit</p>
                  <RialFitBadge score={lead.rialFitScore} size="md" />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Preferencias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Objetivo</p>
                    <p className="text-sm">Vivir</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Tipología</p>
                    <p className="text-sm">2D + 2B</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Zonas preferidas</p>
                  <p className="text-sm">Las Condes, Providencia, Ñuñoa</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Superficie</p>
                  <p className="text-sm">60-80 m²</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Extras</p>
                  <p className="text-sm">Estacionamiento, Bodega</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'screening' && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Perfil financiero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Renta líquida</p>
                    <p className="text-sm">$2.200.000</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Tipo de contrato</p>
                    <p className="text-sm">Indefinido</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Ahorro mensual</p>
                    <p className="text-sm">$400.000</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Ahorros totales</p>
                    <p className="text-sm">$12.000.000</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Pie disponible</p>
                    <p className="text-sm">15%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Ticket máximo</p>
                    <p className="text-sm">{lead.ticketUF.toLocaleString()} UF</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-muted-foreground">¿Tiene preaprobación?</p>
                    <p className="text-sm">No</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Intención y preferencias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Objetivo</p>
                    <p className="text-sm">Vivir</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Plazo de compra</p>
                    <p className="text-sm">3-6 meses</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Zonas de interés</p>
                    <p className="text-sm">Las Condes, Providencia</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Dormitorios</p>
                    <p className="text-sm">2-3</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Baños</p>
                    <p className="text-sm">2</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Superficie</p>
                    <p className="text-sm">60-80 m²</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-[10px] text-muted-foreground">Fecha de screening</p>
                  <p className="text-sm">{format(new Date(lead.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'documentos' && (
          <div className="space-y-4">
            {/* Progress Summary */}
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">Progreso de documentación</p>
                    <p className="text-xs text-muted-foreground">
                      {documentsApproved} de {documentsTotal} documentos aprobados
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{Math.round(documentProgress)}%</p>
                    <OfeliaBadge status={lead.ofeliaStatus} size="md" />
                  </div>
                </div>
                <Progress value={documentProgress} className="h-2" />
                
                {lead.preEvaluationStatus !== 'pendiente' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Pre-evaluación</p>
                        <p className="text-xs text-muted-foreground">
                          {lead.preEvaluationStatus === 'aprobado' && 'Aprobada - Cliente califica'}
                          {lead.preEvaluationStatus === 'condicionado' && 'Condicionada - Revisar detalles'}
                          {lead.preEvaluationStatus === 'en_curso' && 'En proceso de evaluación'}
                          {lead.preEvaluationStatus === 'rechazado' && 'Rechazada'}
                        </p>
                      </div>
                      <Badge 
                        className={cn(
                          lead.preEvaluationStatus === 'aprobado' && 'bg-emerald-500/10 text-emerald-600',
                          lead.preEvaluationStatus === 'condicionado' && 'bg-amber-500/10 text-amber-600',
                          lead.preEvaluationStatus === 'en_curso' && 'bg-blue-500/10 text-blue-600',
                          lead.preEvaluationStatus === 'rechazado' && 'bg-destructive/10 text-destructive',
                        )}
                      >
                        {lead.preEvaluationStatus === 'aprobado' && 'Aprobada'}
                        {lead.preEvaluationStatus === 'condicionado' && 'Condicionada'}
                        {lead.preEvaluationStatus === 'en_curso' && 'En curso'}
                        {lead.preEvaluationStatus === 'rechazado' && 'Rechazada'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Documentos requeridos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium text-xs">Documento</th>
                      <th className="text-left p-3 font-medium text-xs">Estado</th>
                      <th className="text-left p-3 font-medium text-xs">Resultado OCR</th>
                      <th className="text-left p-3 font-medium text-xs">Fecha</th>
                      <th className="text-right p-3 font-medium text-xs">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_DOCUMENTS.map((doc) => {
                      const config = DOC_STATUS_CONFIG[doc.status as keyof typeof DOC_STATUS_CONFIG];
                      const StatusIcon = config.icon;
                      return (
                        <tr key={doc.id} className="border-t border-border">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{doc.name}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={config.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            {doc.ocrResult || '-'}
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            {doc.date ? format(new Date(doc.date), 'dd/MM/yyyy') : '-'}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-end gap-1">
                              {doc.status !== 'pendiente' && (
                                <>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Eye className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Download className="w-3.5 h-3.5" />
                                  </Button>
                                </>
                              )}
                              {doc.status === 'revisar' && (
                                <>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                    <XCircle className="w-3.5 h-3.5" />
                                  </Button>
                                </>
                              )}
                              {(doc.status === 'pendiente' || doc.status === 'rechazado') && (
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Solicitar
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'actividad' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Historial de actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {MOCK_ACTIVITY.map((activity, index) => {
                  const Icon = ACTIVITY_ICONS[activity.type as keyof typeof ACTIVITY_ICONS] || Clock;
                  return (
                    <div key={activity.id} className={cn(
                      'flex gap-3 py-3',
                      index < MOCK_ACTIVITY.length - 1 && 'border-b border-border'
                    )}>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{activity.user}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(activity.date), "d MMM, HH:mm", { locale: es })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'reuniones' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Reuniones</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Agendar reunión
              </Button>
            </div>

            {meetings.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Sin reuniones programadas</p>
                  <Button size="sm" className="mt-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Agendar primera reunión
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium text-xs">Fecha</th>
                        <th className="text-left p-3 font-medium text-xs">Tipo</th>
                        <th className="text-left p-3 font-medium text-xs">Participantes</th>
                        <th className="text-left p-3 font-medium text-xs">Estado</th>
                        <th className="text-right p-3 font-medium text-xs">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meetings.map((meeting) => (
                        <tr key={meeting.id} className="border-t border-border">
                          <td className="p-3">
                            <p className="font-medium">{format(new Date(meeting.date), 'd MMM yyyy', { locale: es })}</p>
                            <p className="text-xs text-muted-foreground">{meeting.time}</p>
                          </td>
                          <td className="p-3 capitalize">{meeting.type}</td>
                          <td className="p-3 text-xs text-muted-foreground">
                            {meeting.participants.join(', ')}
                          </td>
                          <td className="p-3">
                            <Badge 
                              className={cn(
                                meeting.status === 'pendiente' && 'bg-primary/10 text-primary',
                                meeting.status === 'realizada' && 'bg-emerald-500/10 text-emerald-600',
                                meeting.status === 'cancelada' && 'bg-muted text-muted-foreground',
                                meeting.status === 'no_asistio' && 'bg-destructive/10 text-destructive',
                              )}
                            >
                              {meeting.status === 'pendiente' && 'Pendiente'}
                              {meeting.status === 'realizada' && 'Realizada'}
                              {meeting.status === 'cancelada' && 'Cancelada'}
                              {meeting.status === 'no_asistio' && 'No asistió'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-end gap-1">
                              {meeting.status === 'pendiente' && (
                                <>
                                  <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-600">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Realizada
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive">
                                    Cancelar
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
