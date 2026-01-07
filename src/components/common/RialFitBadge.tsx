import { cn } from '@/lib/utils';
import { RialFitScore, RIALFIT_LABELS } from '@/types';

interface RialFitBadgeProps {
  score: RialFitScore;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const SCORE_COLORS: Record<RialFitScore, string> = {
  1: 'bg-rialfit-1/10 text-rialfit-1 border-rialfit-1/20',
  2: 'bg-rialfit-2/10 text-rialfit-2 border-rialfit-2/20',
  3: 'bg-rialfit-3/10 text-rialfit-3 border-rialfit-3/20',
  4: 'bg-rialfit-4/10 text-rialfit-4 border-rialfit-4/20',
  5: 'bg-rialfit-5/10 text-rialfit-5 border-rialfit-5/20',
};

export function RialFitBadge({ score, showLabel = true, size = 'sm' }: RialFitBadgeProps) {
  return (
    <span
      className={cn(
        'badge-rialfit border',
        SCORE_COLORS[score],
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      )}
    >
      RialFit {score}/5{showLabel && ` – ${RIALFIT_LABELS[score]}`}
    </span>
  );
}
