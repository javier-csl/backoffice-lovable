import { OfeliaStatus, OFELIA_STATUS_CONFIG } from '@/types';
import { cn } from '@/lib/utils';

interface OfeliaBadgeProps {
  status: OfeliaStatus;
  size?: 'sm' | 'md';
}

export function OfeliaBadge({ status, size = 'sm' }: OfeliaBadgeProps) {
  if (status === 'inactivo') return null;
  
  const config = OFELIA_STATUS_CONFIG[status];
  
  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.color,
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
      )}
    >
      {config.label}
    </span>
  );
}
