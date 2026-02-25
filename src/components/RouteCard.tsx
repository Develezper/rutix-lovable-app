import { Clock, Footprints, ArrowRightLeft, Star, ChevronRight } from 'lucide-react';
import type { RouteResult } from '@/data/mockData';

interface RouteCardProps {
  route: RouteResult;
  index: number;
  selected?: boolean;
  onClick?: () => void;
}

export default function RouteCard({ route, index, selected, onClick }: RouteCardProps) {
  const isRecommended = index === 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-lg border transition-all ${
        selected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border bg-card hover:border-primary/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">{route.totalTime} min</span>
          {isRecommended && (
            <span className="transit-badge bg-primary/10 text-primary">
              <Star size={10} className="fill-current" /> Mejor
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-sm">${route.fare.toLocaleString()}</span>
          <ChevronRight size={14} />
        </div>
      </div>

      {/* Segments */}
      <div className="flex items-center gap-1 mb-2 flex-wrap">
        {route.segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={10} className="text-muted-foreground" />}
            {seg.type === 'bus' ? (
              <span
                className="transit-badge text-primary-foreground"
                style={{ backgroundColor: seg.busRoute?.color }}
              >
                {seg.busRoute?.code}
              </span>
            ) : (
              <span className="transit-badge bg-muted text-muted-foreground">
                {seg.duration}min
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Footprints size={11} /> {route.walkingTime} min
        </span>
        <span className="flex items-center gap-1">
          <ArrowRightLeft size={11} /> {route.transfers} transb.
        </span>
        <span className="flex items-center gap-1">
          <Star size={11} className="fill-current text-amber-500" /> {route.confidence}%
        </span>
      </div>
    </button>
  );
}
