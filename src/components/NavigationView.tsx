import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Navigation, Footprints, Bus, Clock, ChevronRight, X, MapPin } from 'lucide-react';
import MapView from '@/components/MapView';
import type { RouteResult, RouteSegment } from '@/data/mockData';

interface NavigationViewProps {
  route: RouteResult;
  from: string;
  to: string;
  onExit: () => void;
}

// Interpolate points along a path for smooth movement
function interpolatePath(path: [number, number][], totalSteps: number): [number, number][] {
  if (path.length < 2) return path;
  const result: [number, number][] = [];
  
  // Calculate total distance
  let totalDist = 0;
  const segDists: number[] = [];
  for (let i = 1; i < path.length; i++) {
    const d = Math.sqrt(
      Math.pow((path[i][0] - path[i-1][0]) * 111320, 2) +
      Math.pow((path[i][1] - path[i-1][1]) * 111320 * Math.cos(path[i-1][0] * Math.PI / 180), 2)
    );
    segDists.push(d);
    totalDist += d;
  }

  for (let step = 0; step <= totalSteps; step++) {
    const targetDist = (step / totalSteps) * totalDist;
    let accumulated = 0;
    
    for (let i = 0; i < segDists.length; i++) {
      if (accumulated + segDists[i] >= targetDist) {
        const ratio = segDists[i] > 0 ? (targetDist - accumulated) / segDists[i] : 0;
        const lat = path[i][0] + (path[i+1][0] - path[i][0]) * ratio;
        const lng = path[i][1] + (path[i+1][1] - path[i][1]) * ratio;
        result.push([lat, lng]);
        break;
      }
      accumulated += segDists[i];
      if (i === segDists.length - 1) {
        result.push(path[path.length - 1]);
      }
    }
  }
  
  return result;
}

export default function NavigationView({ route, from, to, onExit }: NavigationViewProps) {
  const [currentSegIdx, setCurrentSegIdx] = useState(0);
  const [positionIdx, setPositionIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [arrived, setArrived] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentSeg = route.segments[currentSegIdx];

  // Build interpolated points per segment for smooth movement
  const segmentPoints = useMemo(() => {
    return route.segments.map(seg => {
      const stepsPerSeg = seg.type === 'walk' ? Math.max(seg.duration * 3, 8) : Math.max(seg.duration * 2, 10);
      return interpolatePath(seg.path, stepsPerSeg);
    });
  }, [route]);

  // Full path for completed segments + current progress
  const completedPath = useMemo(() => {
    const pts: [number, number][] = [];
    for (let i = 0; i < currentSegIdx; i++) {
      pts.push(...segmentPoints[i]);
    }
    if (segmentPoints[currentSegIdx]) {
      pts.push(...segmentPoints[currentSegIdx].slice(0, positionIdx + 1));
    }
    return pts;
  }, [currentSegIdx, positionIdx, segmentPoints]);

  const currentPosition: [number, number] = useMemo(() => {
    if (segmentPoints[currentSegIdx] && segmentPoints[currentSegIdx][positionIdx]) {
      return segmentPoints[currentSegIdx][positionIdx];
    }
    return route.segments[0].path[0];
  }, [currentSegIdx, positionIdx, segmentPoints, route]);

  // Progress within current segment
  const segProgress = useMemo(() => {
    const total = segmentPoints[currentSegIdx]?.length || 1;
    return Math.round((positionIdx / (total - 1)) * 100);
  }, [currentSegIdx, positionIdx, segmentPoints]);

  // All route segments for map display
  const mapSegments = useMemo(() => {
    return route.segments.map((seg, i) => ({
      path: seg.path,
      color: i < currentSegIdx 
        ? '#9ca3af'
        : i === currentSegIdx 
          ? (seg.type === 'bus' ? (seg.busRoute?.color || '#3b82f6') : '#10b981')
          : (seg.type === 'bus' ? (seg.busRoute?.color || '#93bbf5') : '#d1d5db'),
      dashed: seg.type === 'walk',
    }));
  }, [route, currentSegIdx]);

  const mapMarkers = useMemo(() => {
    const markers: { position: [number, number]; label: string; color: string }[] = [];
    
    // Origin
    markers.push({ position: route.segments[0].path[0], label: from, color: '#10b981' });
    
    // Transfer points
    route.segments.forEach((seg, i) => {
      if (i > 0 && seg.type === 'bus') {
        markers.push({ position: seg.path[0], label: `🚌 Tomar ${seg.busRoute?.code}`, color: seg.busRoute?.color || '#3b82f6' });
      }
    });
    
    // Destination
    const lastSeg = route.segments[route.segments.length - 1];
    markers.push({ position: lastSeg.path[lastSeg.path.length - 1], label: to, color: '#ef4444' });
    
    return markers;
  }, [route, from, to]);

  // Start/stop simulation
  const startNavigation = useCallback(() => {
    setStarted(true);
    setCurrentSegIdx(0);
    setPositionIdx(0);
    setArrived(false);
  }, []);

  useEffect(() => {
    if (!started || arrived) return;
    
    const speed = currentSeg?.type === 'bus' ? 600 : 900; // bus moves faster
    
    intervalRef.current = setInterval(() => {
      setPositionIdx(prev => {
        const maxIdx = (segmentPoints[currentSegIdx]?.length || 1) - 1;
        if (prev >= maxIdx) {
          // Move to next segment
          setCurrentSegIdx(segIdx => {
            if (segIdx >= route.segments.length - 1) {
              // Arrived!
              setArrived(true);
              if (intervalRef.current) clearInterval(intervalRef.current);
              return segIdx;
            }
            setPositionIdx(0);
            return segIdx + 1;
          });
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started, arrived, currentSegIdx, currentSeg, segmentPoints, route.segments.length]);

  // Get next instruction preview
  const nextSeg = route.segments[currentSegIdx + 1];

  // Estimated time remaining
  const timeRemaining = useMemo(() => {
    let remaining = 0;
    for (let i = currentSegIdx; i < route.segments.length; i++) {
      if (i === currentSegIdx) {
        const total = segmentPoints[i]?.length || 1;
        const pct = 1 - (positionIdx / (total - 1));
        remaining += route.segments[i].duration * pct;
      } else {
        remaining += route.segments[i].duration;
      }
    }
    return Math.ceil(remaining);
  }, [currentSegIdx, positionIdx, segmentPoints, route.segments]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Full screen map */}
      <div className="relative flex-1 min-h-[60vh]">
        <MapView
          center={currentPosition}
          zoom={started ? 16 : 13}
          segments={mapSegments}
          markers={mapMarkers}
          currentPosition={started ? currentPosition : undefined}
          followPosition={started}
        />

        {/* Back button */}
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-[1000] glass-card p-2.5 rounded-xl"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>

        {/* Top bar - segment info */}
        {started && !arrived && (
          <div className="absolute top-4 left-16 right-4 z-[1000]">
            <div className="glass-card px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                {currentSeg.type === 'bus' ? (
                  <span
                    className="transit-badge text-primary-foreground text-xs"
                    style={{ backgroundColor: currentSeg.busRoute?.color }}
                  >
                    <Bus size={10} /> {currentSeg.busRoute?.code}
                  </span>
                ) : (
                  <span className="transit-badge bg-green-500/20 text-green-400 text-xs">
                    <Footprints size={10} /> Caminando
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                  <Clock size={10} /> ~{timeRemaining} min restantes
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">{currentSeg.instructions}</p>
            </div>
          </div>
        )}

        {/* Arrived overlay */}
        {arrived && (
          <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-black/40">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-6 rounded-2xl text-center mx-8 max-w-sm"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">¡Has llegado!</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Llegaste a <strong>{to}</strong> en {route.totalTime} min
              </p>
              <button
                onClick={onExit}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Finalizar navegación
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom panel */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative -mt-6 bg-background rounded-t-2xl z-[1000] px-4 pt-5 pb-24"
      >
        {!started ? (
          /* Pre-navigation: show route summary and start button */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Navegación GPS</h2>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock size={12} /> {route.totalTime} min · {route.transfers} transbordo{route.transfers !== 1 ? 's' : ''}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              {from} → {to}
            </p>

            {/* Segment summary */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {route.segments.map((seg, i) => (
                <div key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={12} className="text-muted-foreground" />}
                  {seg.type === 'bus' ? (
                    <span
                      className="transit-badge text-primary-foreground text-xs"
                      style={{ backgroundColor: seg.busRoute?.color }}
                    >
                      🚌 {seg.busRoute?.code}
                    </span>
                  ) : (
                    <span className="transit-badge bg-muted text-muted-foreground text-xs">
                      🚶 {seg.duration}min
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={startNavigation}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500 text-white font-semibold transition-all hover:bg-green-600"
            >
              <Navigation size={18} /> Iniciar navegación
            </button>
          </div>
        ) : !arrived ? (
          /* During navigation: current step + next */
          <div className="space-y-3">
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground">Paso {currentSegIdx + 1}/{route.segments.length}</span>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${((currentSegIdx + (segProgress / 100)) / route.segments.length) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-foreground">~{timeRemaining} min</span>
            </div>

            {/* Current instruction */}
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                {currentSeg.type === 'bus' ? (
                  <Bus size={16} style={{ color: currentSeg.busRoute?.color }} />
                ) : (
                  <Footprints size={16} className="text-green-500" />
                )}
                <span className="text-sm font-semibold text-foreground">
                  {currentSeg.type === 'bus' 
                    ? `Bus ${currentSeg.busRoute?.code} — ${currentSeg.busRoute?.name}`
                    : 'Caminar'}
                </span>
              </div>
              <p className="text-sm text-foreground">{currentSeg.instructions}</p>
              {currentSeg.distance && (
                <p className="text-xs text-muted-foreground mt-1">
                  {currentSeg.distance >= 1000 ? `${(currentSeg.distance / 1000).toFixed(1)} km` : `${currentSeg.distance}m`} · {currentSeg.duration} min
                </p>
              )}
            </div>

            {/* Next step preview */}
            {nextSeg && (
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Siguiente paso:</p>
                <div className="flex items-center gap-2">
                  {nextSeg.type === 'bus' ? (
                    <span
                      className="transit-badge text-primary-foreground text-[10px]"
                      style={{ backgroundColor: nextSeg.busRoute?.color }}
                    >
                      🚌 {nextSeg.busRoute?.code}
                    </span>
                  ) : (
                    <span className="transit-badge bg-muted text-muted-foreground text-[10px]">
                      🚶 Caminar
                    </span>
                  )}
                  <span className="text-xs text-foreground truncate">{nextSeg.instructions}</span>
                </div>
              </div>
            )}

            {/* Cancel button */}
            <button
              onClick={onExit}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-muted-foreground text-sm"
            >
              <X size={14} /> Cancelar navegación
            </button>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
