import { cn } from '@/lib/utils';
import { RialFitScore, RIALFIT_LABELS } from '@/types';

interface RialFitCompareProps {
  interestScore: RialFitScore;
  interestProjectName: string;
  topScore?: RialFitScore;
  topProjectName?: string;
  variant?: 'compact' | 'inline' | 'detailed';
  className?: string;
}

const SCORE_TEXT: Record<RialFitScore, string> = {
  1: 'text-rialfit-1',
  2: 'text-rialfit-2',
  3: 'text-rialfit-3',
  4: 'text-rialfit-4',
  5: 'text-rialfit-5',
};

const SCORE_BORDER: Record<RialFitScore, string> = {
  1: 'border-rialfit-1',
  2: 'border-rialfit-2',
  3: 'border-rialfit-3',
  4: 'border-rialfit-4',
  5: 'border-rialfit-5',
};

interface FitRowProps {
  glosa: string;
  projectName: string;
  score: RialFitScore;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Fila de RialFit (sin borde ni fondo): glosa + proyecto + score grande coloreado.
 * Las filas se separan visualmente con un divisor (border-t) en el contenedor.
 */
function FitRow({ glosa, projectName, score, size = 'md', className }: FitRowProps) {
  const scoreSize = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-3xl' : 'text-2xl';
  return (
    <div className={cn('flex items-center gap-3 py-2', className)}>
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
      </div>
      <div
        className={cn(
          'flex items-center justify-center rounded-md border border-border bg-card font-semibold tabular-nums shrink-0',
          scoreSize,
          SCORE_TEXT[score],
          size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11',
        )}
      >
        {score}
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

  // Compact: para cards de Kanban — filas separadas por divisor, sin chips
  if (variant === 'compact') {
    return (
      <div className={cn('divide-y divide-border', className)}>
        <FitRow
          glosa="RialFit proyecto interés"
          projectName={interestProjectName}
          score={interestScore}
          size="sm"
        />
        {showTop && (
          <FitRow
            glosa="Máximo RialFit"
            projectName={topProjectName!}
            score={topScore!}
            size="sm"
          />
        )}
      </div>
    );
  }

  // Inline: para tabla — filas en columna separadas por divisor
  if (variant === 'inline') {
    return (
      <div className={cn('divide-y divide-border min-w-[240px]', className)}>
        <FitRow
          glosa="RialFit interés"
          projectName={interestProjectName}
          score={interestScore}
          size="sm"
        />
        {showTop && (
          <FitRow
            glosa="Máximo RialFit"
            projectName={topProjectName!}
            score={topScore!}
            size="sm"
          />
        )}
      </div>
    );
  }

  // Detailed: vista detalle — filas grandes apiladas con divisor
  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
        RialFit – expectativa vs realidad
      </p>

      <div className="divide-y divide-border">
        <FitRow
          glosa="RialFit proyecto de interés"
          projectName={interestProjectName}
          score={interestScore}
          size="lg"
        />
        {showTop && (
          <FitRow
            glosa="Máximo RialFit disponible"
            projectName={topProjectName!}
            score={topScore!}
            size="lg"
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
