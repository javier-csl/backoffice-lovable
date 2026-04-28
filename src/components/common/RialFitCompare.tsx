import { cn } from '@/lib/utils';
import { RialFitScore, RIALFIT_LABELS } from '@/types';
import { TrendingUp } from 'lucide-react';

interface RialFitCompareProps {
  interestScore: RialFitScore;
  interestProjectName: string;
  topScore?: RialFitScore;
  topProjectName?: string;
  variant?: 'compact' | 'inline' | 'detailed';
  className?: string;
}

const SCORE_RING: Record<RialFitScore, string> = {
  1: 'text-rialfit-1 border-border bg-card',
  2: 'text-rialfit-2 border-border bg-card',
  3: 'text-rialfit-3 border-border bg-card',
  4: 'text-rialfit-4 border-border bg-card',
  5: 'text-rialfit-5 border-border bg-card',
};

const SCORE_TEXT: Record<RialFitScore, string> = {
  1: 'text-rialfit-1',
  2: 'text-rialfit-2',
  3: 'text-rialfit-3',
  4: 'text-rialfit-4',
  5: 'text-rialfit-5',
};

interface FitCardProps {
  glosa: string;
  projectName: string;
  score: RialFitScore;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
  className?: string;
}

/**
 * Card unitaria de RialFit:
 *  - Glosa arriba (Máximo RialFit / RialFit en [Proyecto])
 *  - Score grande
 *  - Etiqueta cualitativa pequeña
 */
function FitCard({ glosa, projectName, score, size = 'md', highlight, className }: FitCardProps) {
  const scoreSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';
  const padding = size === 'sm' ? 'p-2' : 'p-3';

  return (
    <div
      className={cn(
        'rounded-md border border-border bg-card flex items-center gap-2.5',
        padding,
        className,
      )}
    >
      {/* Score circular */}
      <div
        className={cn(
          'flex items-center justify-center rounded-md border font-semibold tabular-nums shrink-0',
          SCORE_RING[score],
          scoreSize,
          size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11',
        )}
      >
        {score}
      </div>

      {/* Texto */}
      <div className="min-w-0 flex-1">
        <p className={cn(
          'text-muted-foreground uppercase tracking-wide leading-tight',
          size === 'sm' ? 'text-[9px]' : 'text-[10px]',
        )}>
          {glosa}
        </p>
        <p className={cn(
          'font-medium truncate leading-tight',
          size === 'sm' ? 'text-xs' : 'text-sm',
        )}>
          {projectName}
        </p>
        <p className={cn('truncate leading-tight', size === 'sm' ? 'text-[10px]' : 'text-xs', SCORE_TEXT[score])}>
          {RIALFIT_LABELS[score]}
        </p>
      </div>
    </div>
  );
}

export function RialFitCompare({
  interestScore,
  interestProjectName,
  topScore,
  topProjectName,
  variant = 'compact',
  className,
}: RialFitCompareProps) {
  const delta = topScore ? topScore - interestScore : 0;
  const hasGap = delta > 0;
  const showTop = !!(topScore && topProjectName);

  // Compact: para cards de Kanban — dos cards apiladas, mínimas
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-1.5', className)}>
        <FitCard
          glosa="RialFit proyecto interés"
          projectName={interestProjectName}
          score={interestScore}
          size="sm"
        />
        {showTop && (
          <div className="relative">
            <FitCard
              glosa="Máximo RialFit"
              projectName={topProjectName!}
              score={topScore!}
              size="sm"
              highlight={hasGap}
            />
            {hasGap && (
              <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold text-primary-foreground bg-primary px-1.5 py-0.5 rounded-full leading-none flex items-center gap-0.5 shadow-sm">
                <TrendingUp className="w-2.5 h-2.5" />+{delta}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Inline: para tabla — dos mini cards lado a lado
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 min-w-[280px]', className)}>
        <FitCard
          glosa="RialFit interés"
          projectName={interestProjectName}
          score={interestScore}
          size="sm"
          className="flex-1"
        />
        {showTop && (
          <div className="relative flex-1">
            <FitCard
              glosa="Máximo RialFit"
              projectName={topProjectName!}
              score={topScore!}
              size="sm"
              highlight={hasGap}
            />
            {hasGap && (
              <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold text-primary-foreground bg-primary px-1.5 py-0.5 rounded-full leading-none shadow-sm">
                +{delta}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Detailed: vista detalle — cards apiladas verticalmente con jerarquía clara
  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
        RialFit – expectativa vs realidad
      </p>

      <div className="flex flex-col gap-2">
        <FitCard
          glosa="RialFit proyecto de interés"
          projectName={interestProjectName}
          score={interestScore}
          size="lg"
        />
        {showTop && (
          <FitCard
            glosa="Máximo RialFit disponible"
            projectName={topProjectName!}
            score={topScore!}
            size="lg"
            highlight={hasGap}
          />
        )}
      </div>

      {hasGap && (
        <p className="text-[11px] text-muted-foreground">
          El lead encaja mejor en otro proyecto. Considera ofrecer la alternativa para aumentar conversión.
        </p>
      )}
    </div>
  );
}
