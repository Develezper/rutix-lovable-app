import { useState } from 'react';
import { Users, Route, MapPin, TrendingUp, Clock, Bus } from 'lucide-react';
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
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-base font-semibold text-foreground">Administración</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Gestión de rutas y datos</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          {(['overview', 'routes', 'traces'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === tab ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
            >
              {tab === 'overview' ? 'General' : tab === 'routes' ? 'Rutas' : 'Trazas GPS'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="px-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="glass-card p-3">
              <Users size={15} className="text-primary mb-1.5" />
              <p className="text-xl font-semibold text-foreground">{adminStats.totalUsers.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Usuarios</p>
              <p className="text-[10px] text-primary mt-0.5">+{adminStats.activeToday} hoy</p>
            </div>
            <div className="glass-card p-3">
              <Route size={15} className="text-primary mb-1.5" />
              <p className="text-xl font-semibold text-foreground">{adminStats.totalRoutes}</p>
              <p className="text-[10px] text-muted-foreground">Rutas</p>
              <p className="text-[10px] text-primary mt-0.5">{adminStats.validatedRoutes} validadas</p>
            </div>
            <div className="glass-card p-3">
              <MapPin size={15} className="text-primary mb-1.5" />
              <p className="text-xl font-semibold text-foreground">{adminStats.totalTraces.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Trazas GPS</p>
              <p className="text-[10px] text-primary mt-0.5">+{adminStats.tracesToday} hoy</p>
            </div>
            <div className="glass-card p-3">
              <TrendingUp size={15} className="text-primary mb-1.5" />
              <p className="text-xl font-semibold text-foreground">{adminStats.coveragePercent}%</p>
              <p className="text-[10px] text-muted-foreground">Cobertura</p>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-3 border-b border-border">
              <h3 className="text-sm font-medium text-foreground">Cobertura</h3>
            </div>
            <div className="h-[220px]">
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

          <div className="glass-card p-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Zonas cubiertas</h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {adminStats.zonesWithData.map(z => (
                <span key={z} className="transit-badge bg-primary/10 text-primary">{z}</span>
              ))}
            </div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sin cobertura</h3>
            <div className="flex flex-wrap gap-1.5">
              {adminStats.zonesNeedingData.map(z => (
                <span key={z} className="transit-badge bg-destructive/10 text-destructive">{z}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Routes */}
      {activeTab === 'routes' && (
        <div className="px-4 space-y-2">
          {busRoutes.map(route => (
            <div key={route.id} className="glass-card p-3">
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="transit-badge text-primary-foreground" style={{ backgroundColor: route.color }}>
                    <Bus size={9} /> {route.code}
                  </span>
                  <span className={`transit-badge ${
                    route.status === 'validated' ? 'bg-primary/10 text-primary' :
                    route.status === 'candidate' ? 'bg-accent text-accent-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {route.status === 'validated' ? 'Validada' :
                     route.status === 'candidate' ? 'Candidata' : 'Pendiente'}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">{route.company}</span>
              </div>
              <p className="text-sm font-medium text-foreground mb-1.5">{route.name}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Users size={10} /> {route.mappedBy}</span>
                <span className="flex items-center gap-1"><TrendingUp size={10} /> {route.confidence}%</span>
                <span className="flex items-center gap-1"><Clock size={10} /> c/{route.frequency}min</span>
                <span>{route.stops.length} paradas</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Traces */}
      {activeTab === 'traces' && (
        <div className="px-4 space-y-3">
          <div className="flex gap-2">
            <select
              value={filterBus}
              onChange={e => setFilterBus(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground"
            >
              <option value="">Todos los buses</option>
              {busRoutes.map(r => <option key={r.id} value={r.code}>{r.code}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground"
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="processed">Procesada</option>
              <option value="validated">Validada</option>
            </select>
          </div>

          <p className="text-[11px] text-muted-foreground">{filteredTraces.length} trazas</p>

          {filteredTraces.map(trace => (
            <div key={trace.id} className="glass-card p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="transit-badge bg-primary/10 text-primary">
                    <Bus size={9} /> {trace.busCode}
                  </span>
                  <span className={`transit-badge ${
                    trace.status === 'validated' ? 'bg-primary/10 text-primary' :
                    trace.status === 'processed' ? 'bg-accent text-accent-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {trace.status === 'validated' ? 'Validada' :
                     trace.status === 'processed' ? 'Procesada' : 'Pendiente'}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">{trace.date}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>{trace.userName}</span>
                <span>{trace.duration} min</span>
                <span>{trace.distance} km</span>
                <span>{trace.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
