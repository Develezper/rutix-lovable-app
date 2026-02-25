import { motion } from 'framer-motion';
import { Clock, Bus, ArrowRightLeft, MapPin, Trash2 } from 'lucide-react';
import { savedRoutes } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">Historial de rutas</h1>
        <p className="text-sm text-muted-foreground mt-1">{savedRoutes.length} rutas guardadas</p>
      </div>

      <div className="px-4 space-y-3">
        {savedRoutes.map((route, i) => (
          <motion.button
            key={route.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/history/${route.id}`)}
            className="w-full text-left p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {route.origin}
                </p>
                <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                  <MapPin size={12} /> {route.destination}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{route.date}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {route.totalTime} min
              </span>
              <span className="flex items-center gap-1">
                <ArrowRightLeft size={12} /> {route.transfers} transbordo{route.transfers !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-1">
                {route.busRoutes.map((code, j) => (
                  <span key={j} className="transit-badge bg-primary/10 text-primary">
                    <Bus size={10} /> {code}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
