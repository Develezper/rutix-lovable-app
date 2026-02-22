import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Pause, CheckCircle2, Bus, Clock, MapPin, Navigation, ChevronDown } from 'lucide-react';
import MapView from '@/components/MapView';
import { busRoutes } from '@/data/mockData';
import { toast } from 'sonner';

// Simulated GPS path around Medellín
const simulatedPath: [number, number][] = [
[6.2748, -75.5544], [6.2740, -75.5555], [6.2728, -75.5570],
[6.2715, -75.5588], [6.2700, -75.5605], [6.2690, -75.5637],
[6.2710, -75.5660], [6.2735, -75.5680], [6.2760, -75.5700],
[6.2781, -75.5712], [6.2810, -75.5720], [6.2850, -75.5730],
[6.2900, -75.5735], [6.2950, -75.5720], [6.3000, -75.5700],
[6.3050, -75.5670], [6.3100, -75.5620], [6.3140, -75.5580],
[6.3185, -75.5530], [6.3220, -75.5540], [6.3260, -75.5550],
[6.3300, -75.5555], [6.3345, -75.5560]];


export default function RecordRoute() {
  const [status, setStatus] = useState<'idle' | 'recording' | 'paused' | 'saved'>('idle');
  const [selectedBus, setSelectedBus] = useState('');
  const [busInputValue, setBusInputValue] = useState('');
  const [showBusDropdown, setShowBusDropdown] = useState(false);
  const busInputRef = useRef<HTMLInputElement>(null);
  const busWrapperRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState('ida');
  const [path, setPath] = useState<[number, number][]>([]);
  const [currentPos, setCurrentPos] = useState<[number, number]>([6.2748, -75.5544]);
  const [movingTime, setMovingTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const simIndex = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const startRecording = useCallback(() => {
    if (!selectedBus) {
      toast.error('Selecciona un bus primero');
      return;
    }
    setStatus('recording');
    setPath([simulatedPath[0]]);
    setCurrentPos(simulatedPath[0]);
    simIndex.current = 0;
    setMovingTime(0);
    setDistance(0);

    // Simulate GPS movement
    intervalRef.current = setInterval(() => {
      simIndex.current += 1;
      if (simIndex.current >= simulatedPath.length) {
        // Stop at end
        return;
      }
      const newPos = simulatedPath[simIndex.current];
      const prevPos = simulatedPath[simIndex.current - 1];

      // Calculate distance
      const dLat = (newPos[0] - prevPos[0]) * 111320;
      const dLng = (newPos[1] - prevPos[1]) * 111320 * Math.cos(prevPos[0] * Math.PI / 180);
      const segDist = Math.sqrt(dLat * dLat + dLng * dLng);

      setIsMoving(segDist > 5);
      setCurrentPos(newPos);
      setPath((prev) => [...prev, newPos]);
      setDistance((prev) => prev + segDist);
    }, 1500);

    // Timer only counts when moving
    timerRef.current = setInterval(() => {
      setIsMoving((moving) => {
        if (moving) {
          setMovingTime((prev) => prev + 1);
        }
        return moving;
      });
    }, 1000);
  }, [selectedBus]);

  const stopRecording = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('saved');
    toast.success('🎉 ¡Ruta guardada exitosamente!', {
      description: `Bus ${selectedBus} · ${formatTime(movingTime)} · ${(distance / 1000).toFixed(1)} km`,
      duration: 5000
    });
  }, [selectedBus, movingTime, distance]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Close bus dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (busWrapperRef.current && !busWrapperRef.current.contains(e.target as Node)) {
        setShowBusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const resetRecording = () => {
    setStatus('idle');
    setPath([]);
    setMovingTime(0);
    setDistance(0);
    simIndex.current = 0;
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Map */}
      <div className="relative h-[55vh]">
        <MapView
          center={currentPos}
          zoom={14}
          currentPosition={status === 'recording' ? currentPos : undefined}
          followPosition={status === 'recording'}
          recordingPath={path}
          markers={path.length > 0 ? [
          { position: path[0], label: 'Inicio', color: '#10b981' },
          ...(status === 'saved' && path.length > 1 ? [{ position: path[path.length - 1], label: 'Fin', color: '#ef4444' }] : [])] :
          []} />


        {/* Recording indicator */}
        {status === 'recording' &&
        <div className="absolute top-4 left-4 right-4 z-[1000]">
            <div className="glass-card px-4 py-3 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Grabando ruta</p>
                <p className="text-xs text-muted-foreground">
                  Bus {selectedBus} · {direction === 'ida' ? 'Ida' : 'Vuelta'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-bold text-foreground">{formatTime(movingTime)}</p>
                <p className="text-xs text-muted-foreground">
                  {isMoving ? '🟢 En movimiento' : '🔴 Detenido'}
                </p>
              </div>
            </div>
          </div>
        }
      </div>

      {/* Controls panel */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative -mt-6 flex-1 bg-background rounded-t-2xl z-[1000] px-4 pt-5">

        <AnimatePresence mode="wait">
          {status === 'idle' &&
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">🚌 Grabar nueva ruta</h2>
              <p className="text-sm text-muted-foreground">
                Selecciona el bus en el que estás y presiona grabar. El tiempo solo contará cuando estés en movimiento.
              </p>

              <div className="relative" ref={busWrapperRef}>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bus / Línea</label>
                <div className="relative">
                  <input
                  ref={busInputRef}
                  type="text"
                  value={busInputValue}
                  placeholder="Escribe o selecciona un bus..."
                  onChange={(e) => {
                    setBusInputValue(e.target.value);
                    setSelectedBus(e.target.value);
                    setShowBusDropdown(true);
                  }}
                  onFocus={() => setShowBusDropdown(true)}
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-muted border-0 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 my-[5px]" />

                  <button
                  type="button"
                  onClick={() => setShowBusDropdown((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">

                    <ChevronDown size={16} />
                  </button>
                </div>

                {showBusDropdown &&
              <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl bg-card border border-border shadow-lg z-50">
                    {busRoutes.
                filter((r) =>
                !busInputValue ||
                r.code.toLowerCase().includes(busInputValue.toLowerCase()) ||
                r.name.toLowerCase().includes(busInputValue.toLowerCase())
                ).
                map((r) =>
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedBus(r.code);
                    setBusInputValue(`${r.code} — ${r.name}`);
                    setShowBusDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl">

                          <span className="font-semibold">{r.code}</span>
                          <span className="text-muted-foreground"> — {r.name} ({r.company})</span>
                        </button>
                )
                }
                    {busInputValue && !busRoutes.some((r) => r.code.toLowerCase() === busInputValue.toLowerCase()) &&
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBus(busInputValue);
                    setShowBusDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-primary font-medium hover:bg-muted transition-colors border-t border-border">

                        + Agregar "<span className="font-semibold">{busInputValue}</span>" como bus nuevo
                      </button>
                }
                  </div>
              }
              </div>

              {/* Direction */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              </label>
                <div className="flex gap-2">
                  {['ida', 'vuelta'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDirection(d)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${direction === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                      {d === 'ida' ? '➡️ Ida' : '⬅️ Vuelta'}
                    </button>
                  ))}
                </div>
              </div>

              <button
              onClick={startRecording}
              disabled={!selectedBus}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-40 ${selectedBus ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>

                <Play size={18} /> Iniciar grabación
              </button>
            </motion.div>
          }

          {status === 'recording' &&
          <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="glass-card p-3 text-center">
                  <Clock size={16} className="text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold font-mono text-foreground">{formatTime(movingTime)}</p>
                  <p className="text-[10px] text-muted-foreground">Tiempo est. llegada</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <Navigation size={16} className="text-transit-blue mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground text-center">{(distance / 1000).toFixed(1)}</p>
                  <p className="text-[10px] text-muted-foreground">km</p>
                </div>
                




              </div>

              <button
              onClick={stopRecording}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-destructive text-destructive-foreground font-semibold my-[60px]">

                <Square size={18} /> Detener y guardar
              </button>
            </motion.div>
          }

          {status === 'saved' &&
          <motion.div key="saved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">¡Ruta guardada exitosamente!</h2>
              <p className="text-sm text-muted-foreground">
                Gracias por contribuir. Tu ruta del bus <strong>{selectedBus}</strong> ha sido registrada
                con {path.length} puntos GPS en {formatTime(movingTime)} de recorrido.
              </p>
              <div className="flex gap-3">
                <button
                onClick={resetRecording}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">

                  Grabar otra ruta
                </button>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </motion.div>
    </div>);

}