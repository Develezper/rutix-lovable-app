import { Bus, Footprints, Clock } from 'lucide-react';
import type { RouteResult } from '@/data/mockData';

interface RouteDetailsProps {
  route: RouteResult;
}

export default function RouteDetails({ route }: RouteDetailsProps) {
  return (
    <div className="space-y-0">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Clock size={13} className="text-primary" />
        <span className="text-sm text-foreground">
          Tiempo total: <strong>{route.totalTime} min</strong>
        </span>
      </div>

      {route.segments.map((seg, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className="w-2.5 h-2.5 rounded-full border-2 shrink-0"
              style={{
                borderColor: seg.type === 'bus' ? seg.busRoute?.color : '#9ca3af',
                backgroundColor: seg.type === 'bus' ? seg.busRoute?.color : 'transparent',
              }}
            />
            {i < route.segments.length - 1 && (
              <div
                className="w-px flex-1 min-h-[36px]"
                style={{
                  backgroundColor: seg.type === 'bus' ? seg.busRoute?.color : '#d1d5db',
                  backgroundImage: seg.type === 'walk' ? 'repeating-linear-gradient(to bottom, #d1d5db 0, #d1d5db 3px, transparent 3px, transparent 6px)' : undefined,
                  background: seg.type === 'walk' ? undefined : seg.busRoute?.color,
                }}
              />
            )}
          </div>

          <div className="pb-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {seg.type === 'bus' ? (
                <span
                  className="transit-badge text-primary-foreground"
                  style={{ backgroundColor: seg.busRoute?.color }}
                >
                  <Bus size={10} /> {seg.busRoute?.code}
                </span>
              ) : (
                <span className="transit-badge bg-muted text-muted-foreground">
                  <Footprints size={10} /> Caminar
                </span>
              )}
              <span className="text-[11px] text-muted-foreground">{seg.duration} min</span>
              {seg.distance && (
                <span className="text-[11px] text-muted-foreground">
                  · {seg.distance >= 1000 ? `${(seg.distance / 1000).toFixed(1)} km` : `${seg.distance}m`}
                </span>
              )}
            </div>
            <p className="text-sm text-foreground leading-relaxed">{seg.instructions}</p>
            {seg.type === 'bus' && seg.busRoute && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {seg.busRoute.company} · c/{seg.busRoute.frequency} min · {seg.busRoute.confidence}%
              </p>
            )}
          </div>
        </div>
      ))}

      <div className="flex gap-3 items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive shrink-0" />
        <p className="text-sm font-medium text-foreground">Destino</p>
      </div>
    </div>
  );
}
