import { cn } from '@/lib/utils';
import { LeadStatus, LEAD_STATUS_CONFIG } from '@/types';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = LEAD_STATUS_CONFIG[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.color)} />
      {config.label}
    </span>
  );
}
