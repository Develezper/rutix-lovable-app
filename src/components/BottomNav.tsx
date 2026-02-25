import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, History, Shield, Navigation } from 'lucide-react';

const navItems = [
  { path: '/', icon: Search, label: 'Buscar' },
  { path: '/record', icon: Navigation, label: 'Grabar' },
  { path: '/history', icon: History, label: 'Historial' },
  { path: '/admin', icon: Shield, label: 'Admin' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
