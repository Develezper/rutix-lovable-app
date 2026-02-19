import { Bus, Footprints, Clock } from 'lucide-react';
import type { RouteResult } from '@/data/mockData';
import { motion } from 'framer-motion';

interface RouteDetailsProps {
  route: RouteResult;
}

export default function RouteDetails({ route }: RouteDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-0"
    >
      <div className="flex items-center gap-2 mb-4 px-1">
        <Clock size={14} className="text-primary" />
        <span className="text-sm font-medium text-foreground">
          Tiempo total estimado: <strong>{route.totalTime} min</strong>
        </span>
      </div>

      {route.segments.map((seg, i) => (
        <div key={i} className="flex gap-3">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div
              className="w-3 h-3 rounded-full border-2 shrink-0"
              style={{
                borderColor: seg.type === 'bus' ? seg.busRoute?.color : '#9ca3af',
                backgroundColor: seg.type === 'bus' ? seg.busRoute?.color : 'transparent',
              }}
            />
            {i < route.segments.length - 1 && (
              <div
                className="w-0.5 flex-1 min-h-[40px]"
                style={{
                  backgroundColor: seg.type === 'bus' ? seg.busRoute?.color : '#d1d5db',
                  backgroundImage: seg.type === 'walk' ? 'repeating-linear-gradient(to bottom, #d1d5db 0, #d1d5db 4px, transparent 4px, transparent 8px)' : undefined,
                  background: seg.type === 'walk' ? undefined : seg.busRoute?.color,
                }}
              />
            )}
          </div>

          {/* Content */}
          <div className="pb-4 flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
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
              <span className="text-xs text-muted-foreground">{seg.duration} min</span>
              {seg.distance && (
                <span className="text-xs text-muted-foreground">
                  · {seg.distance >= 1000 ? `${(seg.distance / 1000).toFixed(1)} km` : `${seg.distance}m`}
                </span>
              )}
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {seg.instructions}
            </p>
            {seg.type === 'bus' && seg.busRoute && (
              <p className="text-xs text-muted-foreground mt-1">
                {seg.busRoute.company} · Cada {seg.busRoute.frequency} min · {seg.busRoute.confidence}% confiabilidad
              </p>
            )}
          </div>
        </div>
      ))}

      {/* End marker */}
      <div className="flex gap-3 items-center">
        <div className="w-3 h-3 rounded-full bg-destructive border-2 border-destructive shrink-0" />
        <p className="text-sm font-medium text-foreground">Destino</p>
      </div>
    </motion.div>
  );
}
