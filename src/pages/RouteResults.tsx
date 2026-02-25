import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Navigation } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import MapView from '@/components/MapView';
import RouteCard from '@/components/RouteCard';
import RouteDetails from '@/components/RouteDetails';
import NavigationView from '@/components/NavigationView';
import { getRouteResults } from '@/data/mockData';

export default function RouteResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const routes = useMemo(() => getRouteResults(from, to), [from, to]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const selected = routes[selectedIdx];

  const mapSegments = selected?.segments.map(seg => ({
    path: seg.path,
    color: seg.type === 'bus' ? (seg.busRoute?.color || '#3b82f6') : '#9ca3af',
    dashed: seg.type === 'walk',
  })) || [];

  const mapMarkers = selected ? [
    { position: selected.segments[0].from.lat ? [selected.segments[0].from.lat, selected.segments[0].from.lng] as [number, number] : [6.25, -75.56] as [number, number], label: from, color: '#10b981' },
    { position: selected.segments[selected.segments.length - 1].to.lat ? [selected.segments[selected.segments.length - 1].to.lat, selected.segments[selected.segments.length - 1].to.lng] as [number, number] : [6.33, -75.55] as [number, number], label: to, color: '#ef4444' },
  ] : [];

  if (navigating && selected) {
    return <NavigationView route={selected} from={from} to={to} onExit={() => setNavigating(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Map */}
      <div className="relative h-[38vh]">
        <MapView center={[6.28, -75.56]} zoom={12} segments={mapSegments} markers={mapMarkers} />

        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 z-[1000] glass-card p-2 rounded-lg"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>

        <div className="absolute top-4 left-14 right-4 z-[1000]">
          <div className="glass-card px-3 py-2">
            <p className="text-[10px] text-muted-foreground">Ruta</p>
            <p className="text-sm font-medium text-foreground truncate">{from} → {to}</p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="relative -mt-5 flex-1 bg-background rounded-t-xl z-[1000] px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">
            {routes.length} ruta{routes.length !== 1 ? 's' : ''} encontrada{routes.length !== 1 ? 's' : ''}
          </h2>
          <span className="text-[10px] text-muted-foreground">Por menor tiempo</span>
        </div>

        <div className="space-y-2 mb-3">
          {routes.map((route, i) => (
            <RouteCard
              key={route.id}
              route={route}
              index={i}
              selected={i === selectedIdx}
              onClick={() => { setSelectedIdx(i); setShowDetails(true); }}
            />
          ))}
        </div>

        {showDetails && selected && (
          <button
            onClick={() => setNavigating(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-medium mb-3 transition-all hover:opacity-90"
          >
            <Navigation size={16} /> Iniciar navegación
          </button>
        )}

        <AnimatePresence>
          {showDetails && selected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border pt-3 mb-6">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex items-center gap-1 text-xs text-primary mb-3"
                >
                  <ChevronDown size={14} /> Ocultar instrucciones
                </button>
                <RouteDetails route={selected} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
