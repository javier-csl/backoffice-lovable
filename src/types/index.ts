export type UserRole = 'comercial' | 'marketing' | 'superadmin' | 'inmobiliaria';

// Updated funnel states - only 5 official states
export type LeadStatus = 
  | 'nuevo'
  | 'en_contacto'
  | 'reunion_agendada'
  | 'ganado'
  | 'perdido';

export type RialFitScore = 1 | 2 | 3 | 4 | 5;

export type DocumentStatus = 'pendiente' | 'subido' | 'revisar' | 'rechazado' | 'aprobado';

export type PreEvaluationStatus = 'pendiente' | 'en_curso' | 'aprobado' | 'condicionado' | 'rechazado';

export type OfeliaStatus = 
  | 'inactivo'
  | 'activo'
  | 'documentos_pendientes'
  | 'documentos_revision'
  | 'documentos_aprobados'
  | 'preevaluacion_lista';

export interface Inmobiliaria {
  id: string;
  name: string;
  logo?: string;
  status?: 'activo' | 'inactivo';
  projectsCount?: number;
  usersCount?: number;
}

export interface Project {
  id: string;
  name: string;
  inmobiliariaId: string;
  inmobiliariaName: string;
  comuna: string;
  city: string;
  status: 'activo' | 'pausado' | 'cerrado';
  leadsCount: number;
  rialFitAvg: number;
  closedCount: number;
  pipelineUF: number;
  preEvaluationRate: number;
  priceFrom?: number;
  priceTo?: number;
  lastSync?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectId: string;
  projectName: string;
  comuna: string;
  status: LeadStatus;
  rialFitScore: RialFitScore;
  ticketUF: number;
  channel: string;
  channelGroup: 'paid' | 'organic' | 'referral';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: string;
  lastActivity: string;
  ofeliaStatus: OfeliaStatus;
  preEvaluationStatus: PreEvaluationStatus;
  documentsComplete: number;
  documentsTotal: number;
  assignedTo?: string;
}

export interface Meeting {
  id: string;
  leadId: string;
  leadName: string;
  projectName: string;
  date: string;
  time: string;
  type: 'presencial' | 'showroom' | 'videollamada' | 'llamada';
  status: 'pendiente' | 'realizada' | 'cancelada' | 'no_asistio';
  participants: string[];
  notes?: string;
  assignedTo?: string;
}

export interface KPIData {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

// Updated to only 5 official funnel states
export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; order: number }> = {
  nuevo: { label: 'Nuevo', color: 'bg-status-new', order: 1 },
  en_contacto: { label: 'En contacto', color: 'bg-status-in-contact', order: 2 },
  reunion_agendada: { label: 'Reunión agendada', color: 'bg-status-meeting', order: 3 },
  ganado: { label: 'Ganado', color: 'bg-status-won', order: 4 },
  perdido: { label: 'Perdido', color: 'bg-status-lost', order: 5 },
};

export const OFELIA_STATUS_CONFIG: Record<OfeliaStatus, { label: string; color: string }> = {
  inactivo: { label: '', color: '' },
  activo: { label: 'Ofelia activo', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  documentos_pendientes: { label: 'Docs pendientes', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  documentos_revision: { label: 'Docs en revisión', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  documentos_aprobados: { label: 'Docs aprobados', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  preevaluacion_lista: { label: 'Pre-eval lista', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
};

export const RIALFIT_LABELS: Record<RialFitScore, string> = {
  1: 'Sin match',
  2: 'Match bajo',
  3: 'Match moderado',
  4: 'Muy buen match',
  5: 'Excelente match',
};

// Only 5 official kanban columns
export const KANBAN_COLUMNS: LeadStatus[] = [
  'nuevo',
  'en_contacto',
  'reunion_agendada',
  'ganado',
  'perdido',
];