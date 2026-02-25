import { Clock, Footprints, ArrowRightLeft, Star, ChevronRight } from 'lucide-react';
import type { RouteResult } from '@/data/mockData';
import { motion } from 'framer-motion';

interface RouteCardProps {
  route: RouteResult;
  index: number;
  selected?: boolean;
  onClick?: () => void;
}

export default function RouteCard({ route, index, selected, onClick }: RouteCardProps) {
  const busSegments = route.segments.filter((s) => s.type === 'bus');
  const isRecommended = index === 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
      selected ?
      'border-primary bg-primary/5 shadow-md' :
      'border-border bg-card hover:border-primary/30 hover:shadow-sm'}`
      }>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">{route.totalTime} min</span>
          {isRecommended &&
          <span className="transit-badge bg-primary/15 text-primary">
              <Star size={10} className="fill-current" /> Recomendada
            </span>
          }
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-sm font-medium">${route.fare.toLocaleString()}</span>
          <ChevronRight size={16} />
        </div>
      </div>

      {/* Bus route badges */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {route.segments.map((seg, i) =>
        <div key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} className="text-muted-foreground" />}
            {seg.type === 'bus' ?
          <span
            className="transit-badge text-primary-foreground"
            style={{ backgroundColor: seg.busRoute?.color }}>

                🚌 {seg.busRoute?.code}
              </span> :

          <span className="transit-badge bg-muted text-muted-foreground">
                🚶 {seg.duration}min
              </span>
          }
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Footprints size={12} /> {route.walkingTime} min caminando
        </span>
        <span className="flex items-center gap-1">
          <ArrowRightLeft size={12} /> {route.transfers} transbordo{route.transfers !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1">
          <Star size={12} className="fill-current text-amber-400 bg-transparent" /> {route.confidence}%
        </span>
      </div>
    </motion.button>);

}