import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, ArrowDownUp, MapPin, Users, Route, TrendingUp } from 'lucide-react';
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
  ...(destCoords ? [{ position: destCoords, label: destination, color: '#ef4444' }] : [])] as
  any[];

  // Show some validated route stops on map
  const mapSegments = useMemo(() => busRoutes.
  filter((r) => r.status === 'validated').
  slice(0, 4).
  map((route) => ({
    path: route.stops.map((sid) => {
      const stop = busStops.find((s) => s.id === sid);
      return stop ? [stop.lat, stop.lng] as [number, number] : [6.25, -75.56] as [number, number];
    }),
    color: route.color,
    dashed: false
  })), []);

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Map background */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <MapView
          center={[6.2518, -75.5636]}
          zoom={12}
          segments={mapSegments}
          markers={markers}
          className="h-full" />


        {/* Logo overlay */}
        <div className="absolute top-4 left-4 right-4 z-[1000]">
          <div className="glass-card px-4 py-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bus size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none">RutaAburrá</h1>
              <p className="text-[10px] text-muted-foreground">Movilidad en bus · Valle de Aburrá</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search panel */}
      <div
        className="relative -mt-8 mx-4 z-[1000]">

        <div className="glass-card p-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <SearchBar
                placeholder="¿Dónde estás?"
                value={origin}
                onChange={setOrigin}
                onSelect={(p) => setOriginCoords([p.lat, p.lng])}
                icon="origin" />

              <SearchBar
                placeholder="¿A dónde vas?"
                value={destination}
                onChange={setDestination}
                onSelect={(p) => setDestCoords([p.lat, p.lng])}
                icon="destination" />

            </div>
            <button
              onClick={swapLocations}
              className="self-center p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-muted-foreground">

              <ArrowDownUp size={18} />
            </button>
          </div>

          <button
            onClick={handleSearch}
            disabled={!origin || !destination}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">

            Buscar ruta
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 gap-3 mx-4 mt-6">

        <div className="glass-card p-3 text-center">
          <Route size={18} className="text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{adminStats.validatedRoutes}</p>
          <p className="text-[10px] text-muted-foreground">Rutas activas</p>
        </div>
        




        <div className="glass-card p-3 text-center">
          <TrendingUp size={18} className="text-transit-blue mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{adminStats.coveragePercent}%</p>
          <p className="text-[10px] text-muted-foreground">Cobertura</p>
        </div>
      </div>

      {/* Quick routes */}
      <div className="mx-4 mt-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Rutas populares</h2>
        <div className="space-y-2">
          {[
          { from: 'Parque de Aranjuez', to: 'Parque de Bello', time: '35 min', bus: '301A' },
          { from: 'Estación Poblado', to: 'Parque Envigado', time: '22 min', bus: '125' },
          { from: 'Centro (Berrío)', to: 'Laureles', time: '18 min', bus: 'C6' }].
          map((r, i) =>
          <button
            key={i}
            onClick={() => {
              setOrigin(r.from);
              setDestination(r.to);
              navigate(`/results?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-left">

              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{r.from} → {r.to}</p>
                <p className="text-xs text-muted-foreground">~{r.time} · Bus {r.bus}</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Zones needing data */}
      <div className="mx-4 mt-6 mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-2">📍 Zonas sin cobertura — ¡Ayúdanos!</h2>
        <div className="flex flex-wrap gap-2">
          {adminStats.zonesNeedingData.map((zone) =>
          <span key={zone} className="transit-badge text-xs bg-red-200 text-red-500">
              {zone}
            </span>
          )}
        </div>
      </div>
    </div>);

};

export default Index;