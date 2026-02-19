import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Route, MapPin, TrendingUp, CheckCircle, Clock, AlertTriangle, Bus, Eye, Filter } from 'lucide-react';
import { adminStats, busRoutes, recordedTraces, busStops } from '@/data/mockData';
import MapView from '@/components/MapView';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'traces'>('overview');
  const [filterBus, setFilterBus] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredTraces = recordedTraces.filter(t => {
    if (filterBus && t.busCode !== filterBus) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">Panel de administración</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestión de rutas y datos colaborativos</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {(['overview', 'routes', 'traces'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              {tab === 'overview' ? 'General' : tab === 'routes' ? 'Rutas' : 'Trazas GPS'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4">
              <Users size={18} className="text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{adminStats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Usuarios totales</p>
              <p className="text-[10px] text-primary mt-1">+{adminStats.activeToday} hoy</p>
            </div>
            <div className="glass-card p-4">
              <Route size={18} className="text-transit-blue mb-2" />
              <p className="text-2xl font-bold text-foreground">{adminStats.totalRoutes}</p>
              <p className="text-xs text-muted-foreground">Rutas totales</p>
              <p className="text-[10px] text-primary mt-1">{adminStats.validatedRoutes} validadas</p>
            </div>
            <div className="glass-card p-4">
              <MapPin size={18} className="text-accent mb-2" />
              <p className="text-2xl font-bold text-foreground">{adminStats.totalTraces.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Trazas GPS</p>
              <p className="text-[10px] text-primary mt-1">+{adminStats.tracesToday} hoy</p>
            </div>
            <div className="glass-card p-4">
              <TrendingUp size={18} className="text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{adminStats.coveragePercent}%</p>
              <p className="text-xs text-muted-foreground">Cobertura</p>
              <p className="text-[10px] text-accent mt-1">{adminStats.zonesNeedingData.length} zonas pendientes</p>
            </div>
          </div>

          {/* Coverage map */}
          <div className="glass-card overflow-hidden">
            <div className="p-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Mapa de cobertura</h3>
            </div>
            <div className="h-[250px]">
              <MapView
                center={[6.25, -75.57]}
                zoom={11}
                segments={busRoutes.filter(r => r.status === 'validated').map(r => ({
                  path: r.stops.map(sid => {
                    const s = busStops.find(st => st.id === sid);
                    return s ? [s.lat, s.lng] as [number, number] : [6.25, -75.56] as [number, number];
                  }),
                  color: r.color,
                }))}
              />
            </div>
          </div>

          {/* Zones */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Zonas con datos</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {adminStats.zonesWithData.map(z => (
                <span key={z} className="transit-badge bg-primary/10 text-primary">{z}</span>
              ))}
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Zonas sin cobertura</h3>
            <div className="flex flex-wrap gap-2">
              {adminStats.zonesNeedingData.map(z => (
                <span key={z} className="transit-badge bg-accent/15 text-accent">{z}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Routes tab */}
      {activeTab === 'routes' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 space-y-3">
          {busRoutes.map((route, i) => (
            <div key={route.id} className="glass-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="transit-badge text-primary-foreground" style={{ backgroundColor: route.color }}>
                    <Bus size={10} /> {route.code}
                  </span>
                  <span className={`transit-badge ${
                    route.status === 'validated' ? 'bg-primary/15 text-primary' :
                    route.status === 'candidate' ? 'bg-accent/15 text-accent' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {route.status === 'validated' ? '✓ Validada' :
                     route.status === 'candidate' ? '⏳ Candidata' : '⬜ Pendiente'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{route.company}</span>
              </div>
              <p className="text-sm font-medium text-foreground mb-2">{route.name}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users size={12} /> {route.mappedBy} mapeos
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp size={12} /> {route.confidence}% confianza
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> c/{route.frequency} min
                </span>
                <span>{route.stops.length} paradas</span>
              </div>
              {route.mappedBy >= 30 && route.status !== 'validated' && (
                <div className="mt-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-primary font-medium">
                    ✅ {route.mappedBy} mapeos · Cumple umbral de validación (≥30)
                  </p>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {/* Traces tab */}
      {activeTab === 'traces' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 space-y-4">
          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterBus}
              onChange={e => setFilterBus(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-muted text-sm text-foreground"
            >
              <option value="">Todos los buses</option>
              {busRoutes.map(r => (
                <option key={r.id} value={r.code}>{r.code}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-muted text-sm text-foreground"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="processed">Procesada</option>
              <option value="validated">Validada</option>
            </select>
          </div>

          <p className="text-xs text-muted-foreground">{filteredTraces.length} trazas</p>

          {filteredTraces.map((trace, i) => (
            <div key={trace.id} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="transit-badge bg-primary/10 text-primary">
                    <Bus size={10} /> {trace.busCode}
                  </span>
                  <span className={`transit-badge ${
                    trace.status === 'validated' ? 'bg-primary/15 text-primary' :
                    trace.status === 'processed' ? 'bg-transit-blue/15 text-transit-blue' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {trace.status === 'validated' ? '✓ Validada' :
                     trace.status === 'processed' ? '⚙️ Procesada' : '⏳ Pendiente'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{trace.date}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>👤 {trace.userName}</span>
                <span>{trace.duration} min</span>
                <span>{trace.distance} km</span>
                <span>{trace.points} puntos</span>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
