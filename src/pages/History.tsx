import { Clock, Bus, ArrowRightLeft, MapPin } from 'lucide-react';
import { savedRoutes } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-base font-semibold text-foreground">Historial de rutas</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{savedRoutes.length} rutas guardadas</p>
      </div>

      <div className="px-4 space-y-2">
        {savedRoutes.map((route) => (
          <button
            key={route.id}
            onClick={() => navigate(`/history/${route.id}`)}
            className="w-full text-left p-3.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{route.origin}</p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  <MapPin size={10} /> {route.destination}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{route.date}</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={11} /> {route.totalTime} min
              </span>
              <span className="flex items-center gap-1">
                <ArrowRightLeft size={11} /> {route.transfers} transb.
              </span>
              <div className="flex items-center gap-1">
                {route.busRoutes.map((code, j) => (
                  <span key={j} className="transit-badge bg-primary/10 text-primary">
                    <Bus size={9} /> {code}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
