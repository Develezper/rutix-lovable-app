import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, ArrowDownUp, MapPin, Route, TrendingUp } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import MapView from '@/components/MapView';
import { busRoutes, adminStats, busStops } from '@/data/mockData';

const Index = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);

  const handleSearch = useCallback(() => {
    if (origin && destination) {
      navigate(`/results?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}`);
    }
  }, [origin, destination, navigate]);

  const swapLocations = () => {
    setOrigin(destination);
    setDestination(origin);
    setOriginCoords(destCoords);
    setDestCoords(originCoords);
  };

  const markers = [
    ...(originCoords ? [{ position: originCoords, label: origin, color: '#10b981' }] : []),
    ...(destCoords ? [{ position: destCoords, label: destination, color: '#ef4444' }] : []),
  ] as any[];

  const mapSegments = useMemo(() => busRoutes
    .filter(r => r.status === 'validated')
    .slice(0, 4)
    .map(route => ({
      path: route.stops.map(sid => {
        const stop = busStops.find(s => s.id === sid);
        return stop ? [stop.lat, stop.lng] as [number, number] : [6.25, -75.56] as [number, number];
      }),
      color: route.color,
      dashed: false,
    })), []);

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Map */}
      <div className="relative h-[42vh] w-full overflow-hidden">
        <MapView
          center={[6.2518, -75.5636]}
          zoom={12}
          segments={mapSegments}
          markers={markers}
          className="h-full"
        />

        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-[1000]">
          <div className="glass-card px-3 py-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Bus size={15} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground leading-none">RutaAburrá</h1>
              <p className="text-[10px] text-muted-foreground">Valle de Aburrá</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative -mt-6 mx-4 z-[1000]">
        <div className="glass-card p-4 space-y-2.5">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <SearchBar
                placeholder="¿Dónde estás?"
                value={origin}
                onChange={setOrigin}
                onSelect={p => setOriginCoords([p.lat, p.lng])}
                icon="origin"
              />
              <SearchBar
                placeholder="¿A dónde vas?"
                value={destination}
                onChange={setDestination}
                onSelect={p => setDestCoords([p.lat, p.lng])}
                icon="destination"
              />
            </div>
            <button
              onClick={swapLocations}
              className="self-center p-2 rounded-md bg-muted hover:bg-accent transition-colors text-muted-foreground"
            >
              <ArrowDownUp size={16} />
            </button>
          </div>

          <button
            onClick={handleSearch}
            disabled={!origin || !destination}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Buscar ruta
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mx-4 mt-5">
        <div className="glass-card p-3 text-center">
          <Route size={16} className="text-primary mx-auto mb-1" />
          <p className="text-lg font-semibold text-foreground">{adminStats.validatedRoutes}</p>
          <p className="text-[10px] text-muted-foreground">Rutas activas</p>
        </div>
        <div className="glass-card p-3 text-center">
          <TrendingUp size={16} className="text-primary mx-auto mb-1" />
          <p className="text-lg font-semibold text-foreground">{adminStats.coveragePercent}%</p>
          <p className="text-[10px] text-muted-foreground">Cobertura</p>
        </div>
      </div>

      {/* Quick routes */}
      <div className="mx-4 mt-5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Rutas populares</h2>
        <div className="space-y-2">
          {[
            { from: 'Parque de Aranjuez', to: 'Parque de Bello', time: '35 min', bus: '301A' },
            { from: 'Estación Poblado', to: 'Parque Envigado', time: '22 min', bus: '125' },
            { from: 'Centro (Berrío)', to: 'Laureles', time: '18 min', bus: 'C6' },
          ].map((r, i) => (
            <button
              key={i}
              onClick={() => {
                setOrigin(r.from);
                setDestination(r.to);
                navigate(`/results?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin size={13} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{r.from} → {r.to}</p>
                <p className="text-xs text-muted-foreground">~{r.time} · Bus {r.bus}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Zones needing data */}
      <div className="mx-4 mt-5 mb-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Zonas sin cobertura</h2>
        <div className="flex flex-wrap gap-1.5">
          {adminStats.zonesNeedingData.map(zone => (
            <span key={zone} className="transit-badge bg-destructive/10 text-destructive">
              {zone}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
