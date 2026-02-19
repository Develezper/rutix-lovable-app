import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface RouteSegmentDisplay {
  path: [number, number][];
  color: string;
  dashed?: boolean;
}

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  segments?: RouteSegmentDisplay[];
  markers?: { position: [number, number]; label: string; color?: string; pulse?: boolean }[];
  currentPosition?: [number, number];
  followPosition?: boolean;
  className?: string;
  recordingPath?: [number, number][];
}

export default function MapView({
  center = [6.2518, -75.5636],
  zoom = 13,
  segments = [],
  markers = [],
  currentPosition,
  followPosition,
  className = '',
  recordingPath,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false }).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;
    layersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update layers
  useEffect(() => {
    if (!mapRef.current || !layersRef.current) return;
    layersRef.current.clearLayers();

    // Segments
    segments.forEach(seg => {
      L.polyline(seg.path, {
        color: seg.color,
        weight: seg.dashed ? 4 : 5,
        opacity: 0.85,
        dashArray: seg.dashed ? '8 12' : undefined,
      }).addTo(layersRef.current!);
    });

    // Recording path
    if (recordingPath && recordingPath.length > 1) {
      L.polyline(recordingPath, { color: '#10b981', weight: 5, opacity: 0.9 }).addTo(layersRef.current);
    }

    // Markers
    markers.forEach(m => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${m.color || '#10b981'};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker(m.position, { icon }).bindPopup(m.label).addTo(layersRef.current!);
    });

    // Current position
    if (currentPosition) {
      const pulseIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:18px;height:18px;border-radius:50%;background:#10b981;border:3px solid white;box-shadow:0 0 0 4px rgba(16,185,129,0.3),0 2px 8px rgba(0,0,0,0.3)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker(currentPosition, { icon: pulseIcon }).bindPopup('Tu ubicación').addTo(layersRef.current);
    }
  }, [segments, markers, currentPosition, recordingPath]);

  // Follow position
  useEffect(() => {
    if (followPosition && currentPosition && mapRef.current) {
      mapRef.current.flyTo(currentPosition, 15, { duration: 0.8 });
    }
  }, [currentPosition, followPosition]);

  return <div ref={containerRef} className={`map-container ${className}`} style={{ height: '100%', width: '100%' }} />;
}
