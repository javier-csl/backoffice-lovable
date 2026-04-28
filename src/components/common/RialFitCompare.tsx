import { cn } from '@/lib/utils';
import { RialFitScore } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RialFitCompareProps {
  interestScore: RialFitScore;
  interestProjectName: string;
  topScore?: RialFitScore;
  topProjectName?: string;
  variant?: 'compact' | 'inline' | 'detailed';
  className?: string;
}

const SCORE_COLORS: Record<RialFitScore, string> = {
  1: 'bg-rialfit-1',
  2: 'bg-rialfit-2',
  3: 'bg-rialfit-3',
  4: 'bg-rialfit-4',
  5: 'bg-rialfit-5',
};

const SCORE_TEXT: Record<RialFitScore, string> = {
  1: 'text-rialfit-1',
  2: 'text-rialfit-2',
  3: 'text-rialfit-3',
  4: 'text-rialfit-4',
  5: 'text-rialfit-5',
};

/** Mini barra segmentada 1-5 que muestra el score como una "señal". */
function FitBars({ score, className }: { score: RialFitScore; className?: string }) {
  return (
    <div className={cn('flex items-end gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={cn(
            'w-1 rounded-sm transition-colors',
            i === 1 && 'h-1.5',
            i === 2 && 'h-2',
            i === 3 && 'h-2.5',
            i === 4 && 'h-3',
            i === 5 && 'h-3.5',
            i <= score ? SCORE_COLORS[score] : 'bg-muted'
          )}
        />
      ))}
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

  // Compact: para cards de kanban — 1 fila, mínima altura
  if (variant === 'compact') {
    return (
      <TooltipProvider delayDuration={200}>
        <div className={cn('flex items-center justify-between gap-2', className)}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 cursor-help min-w-0">
                <FitBars score={interestScore} />
                <span className={cn('text-xs font-semibold tabular-nums', SCORE_TEXT[interestScore])}>
                  {interestScore}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">interés</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              RialFit en proyecto de interés: <strong>{interestProjectName}</strong>
            </TooltipContent>
          </Tooltip>

          {topScore && topProjectName && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help min-w-0">
                  <span className={cn(
                    'text-[10px] truncate max-w-[80px]',
                    hasGap ? 'text-primary font-medium' : 'text-muted-foreground'
                  )}>
                    mejor: {topProjectName}
                  </span>
                  <span className={cn('text-xs font-semibold tabular-nums', SCORE_TEXT[topScore])}>
                    {topScore}
                  </span>
                  <FitBars score={topScore} />
                  {hasGap && (
                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-1 rounded">
                      +{delta}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Mejor match: <strong>{topProjectName}</strong>
                {hasGap && <div className="text-xs opacity-80 mt-0.5">Oportunidad: ofrecer alternativa (+{delta})</div>}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    );
  }

  // Inline: para tabla — una celda
  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-col gap-0.5', className)}>
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-semibold tabular-nums', SCORE_TEXT[interestScore])}>
            {interestScore}
          </span>
          {topScore && (
            <>
              <span className="text-muted-foreground text-xs">→</span>
              <span className={cn('text-sm font-semibold tabular-nums', SCORE_TEXT[topScore])}>
                {topScore}
              </span>
              {hasGap && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1 rounded">
                  +{delta}
                </span>
              )}
            </>
          )}
        </div>
        {topProjectName && hasGap && (
          <span className="text-[10px] text-primary truncate max-w-[160px]">
            mejor: {topProjectName}
          </span>
        )}
        {topProjectName && !hasGap && (
          <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">
            top: {topProjectName}
          </span>
        )}
      </div>
    );
  }

  // Detailed: para vista detalle — dos columnas con barras grandes
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
          RialFit – expectativa vs realidad
        </p>
        {hasGap && (
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
            +{delta} mejor en otro proyecto
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Interés */}
        <div className="rounded-md border border-border p-2.5">
          <p className="text-[10px] text-muted-foreground mb-0.5">Proyecto de interés</p>
          <p className="text-xs font-medium truncate mb-2">{interestProjectName}</p>
          <div className="flex items-end justify-between gap-2">
            <FitBars score={interestScore} className="scale-150 origin-bottom-left" />
            <span className={cn('text-2xl font-semibold tabular-nums leading-none', SCORE_TEXT[interestScore])}>
              {interestScore}
              <span className="text-xs text-muted-foreground font-normal">/5</span>
            </span>
          </div>
        </div>

        {/* Top */}
        {topScore && topProjectName && (
          <div className={cn(
            'rounded-md border p-2.5',
            hasGap ? 'border-primary/40 bg-primary/5' : 'border-border'
          )}>
            <p className="text-[10px] text-muted-foreground mb-0.5">Top match disponible</p>
            <p className="text-xs font-medium truncate mb-2">{topProjectName}</p>
            <div className="flex items-end justify-between gap-2">
              <FitBars score={topScore} className="scale-150 origin-bottom-left" />
              <span className={cn('text-2xl font-semibold tabular-nums leading-none', SCORE_TEXT[topScore])}>
                {topScore}
                <span className="text-xs text-muted-foreground font-normal">/5</span>
              </span>
            </div>
          </div>
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
