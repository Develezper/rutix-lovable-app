import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapView from '@/components/MapView';
import RouteCard from '@/components/RouteCard';
import RouteDetails from '@/components/RouteDetails';
import { getRouteResults } from '@/data/mockData';

export default function RouteResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const routes = useMemo(() => getRouteResults(from, to), [from, to]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Map */}
      <div className="relative h-[40vh]">
        <MapView
          center={[6.28, -75.56]}
          zoom={12}
          segments={mapSegments}
          markers={mapMarkers}
        />

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 z-[1000] glass-card p-2.5 rounded-xl"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>

        {/* Route info overlay */}
        <div className="absolute top-4 left-16 right-4 z-[1000]">
          <div className="glass-card px-4 py-2.5">
            <p className="text-xs text-muted-foreground">Ruta</p>
            <p className="text-sm font-medium text-foreground truncate">{from} → {to}</p>
          </div>
        </div>
      </div>

      {/* Results panel */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative -mt-6 flex-1 bg-background rounded-t-2xl z-[1000] px-4 pt-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">
            {routes.length} ruta{routes.length !== 1 ? 's' : ''} encontrada{routes.length !== 1 ? 's' : ''}
          </h2>
          <span className="text-xs text-muted-foreground">Ordenado por menor tiempo</span>
        </div>

        {/* Route cards */}
        <div className="space-y-3 mb-4">
          {routes.map((route, i) => (
            <RouteCard
              key={route.id}
              route={route}
              index={i}
              selected={i === selectedIdx}
              onClick={() => {
                setSelectedIdx(i);
                setShowDetails(true);
              }}
            />
          ))}
        </div>

        {/* Route details */}
        <AnimatePresence>
          {showDetails && selected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border pt-4 mb-6">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex items-center gap-1 text-xs text-primary mb-4"
                >
                  <ChevronDown size={14} /> Ocultar instrucciones
                </button>
                <RouteDetails route={selected} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
