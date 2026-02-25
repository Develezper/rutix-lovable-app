import { useParams, useNavigate } from 'react-router-dom';
import { savedRoutes } from '@/data/mockData';
import { ArrowLeft, Clock, Bus, ArrowRightLeft, MapPin, Footprints, DollarSign, Calendar, Route } from 'lucide-react';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const route = savedRoutes.find(r => r.id === id);

  useEffect(() => {
    if (!route || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Draw route polyline
    const polyline = L.polyline(route.path.map(p => [p[0], p[1]] as L.LatLngExpression), {
      color: 'hsl(142, 76%, 36%)',
      weight: 5,
      opacity: 0.9,
    }).addTo(map);

    // Origin marker
    const originIcon = L.divIcon({
      html: `<div style="width:14px;height:14px;background:hsl(142,76%,36%);border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      className: '',
    });

    // Destination marker
    const destIcon = L.divIcon({
      html: `<div style="width:14px;height:14px;background:hsl(0,80%,55%);border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      className: '',
    });

    const start = route.path[0];
    const end = route.path[route.path.length - 1];

    L.marker([start[0], start[1]], { icon: originIcon }).addTo(map).bindPopup(route.origin);
    L.marker([end[0], end[1]], { icon: destIcon }).addTo(map).bindPopup(route.destination);

    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

    mapInstanceRef.current = map;

    // Force resize
    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 400);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [route]);

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Ruta no encontrada</p>
      </div>
    );
  }

  const stats = [
    { icon: Clock, label: 'Tiempo total', value: `${route.totalTime} min` },
    { icon: Route, label: 'Distancia', value: `${route.distance} km` },
    { icon: Footprints, label: 'Caminando', value: `${route.walkingTime} min` },
    { icon: ArrowRightLeft, label: 'Transbordos', value: `${route.transfers}` },
    { icon: DollarSign, label: 'Tarifa', value: `$${route.fare.toLocaleString()}` },
    { icon: Calendar, label: 'Fecha', value: route.date },
  ];

  return (
    <div className="min-h-screen pb-20 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => navigate('/history')} className="p-2 rounded-lg bg-card border border-border">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{route.origin}</p>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <MapPin size={10} /> {route.destination}
          </p>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="w-full h-[45vh] z-0" />

      {/* Info panel */}
      <div className="px-4 pt-4 space-y-4">
        {/* Bus routes used */}
        <div className="flex items-center gap-2 flex-wrap">
          {route.busRoutes.map((code, i) => (
            <span key={i} className="transit-badge bg-primary/10 text-primary">
              <Bus size={12} /> {code}
            </span>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-card border border-border text-center">
              <stat.icon size={16} className="mx-auto mb-1 text-primary" />
              <p className="text-sm font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
