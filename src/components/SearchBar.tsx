import { useState, useMemo } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { places } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (place: { name: string; lat: number; lng: number }) => void;
  icon?: 'origin' | 'destination';
}

export default function SearchBar({ placeholder, value, onChange, onSelect, icon = 'origin' }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    if (!value || value.length < 2) return [];
    const q = value.toLowerCase();
    return places.filter(p =>
      p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [value]);

  const showSuggestions = focused && filtered.length > 0;

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <div className={`absolute left-3 w-3 h-3 rounded-full ${icon === 'origin' ? 'bg-primary' : 'bg-destructive'}`} />
        <input
          type="text"
          className="search-input pl-9 pr-9"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
        {value && (
          <button
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onChange('')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {filtered.map((place, i) => (
              <button
                key={i}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/60 transition-colors text-left"
                onClick={() => {
                  onChange(place.name);
                  onSelect?.(place);
                  setFocused(false);
                }}
              >
                <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{place.name}</p>
                  <p className="text-xs text-muted-foreground">{place.address}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
