// Datos simulados realistas para el Valle de Aburrá

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zone: string;
}

export interface BusRoute {
  id: string;
  name: string;
  code: string;
  color: string;
  company: string;
  stops: string[];
  frequency: number; // minutos entre buses
  confidence: number; // 0-100
  mappedBy: number; // cantidad de usuarios que la mapearon
  status: 'validated' | 'candidate' | 'pending';
}

export interface RouteResult {
  id: string;
  totalTime: number; // minutos
  walkingTime: number;
  waitingTime: number;
  transfers: number;
  fare: number;
  confidence: number;
  segments: RouteSegment[];
}

export interface RouteSegment {
  type: 'walk' | 'bus';
  from: BusStop;
  to: BusStop;
  duration: number;
  distance?: number; // metros
  busRoute?: BusRoute;
  instructions: string;
  path: [number, number][];
}

export interface SavedRoute {
  id: string;
  origin: string;
  destination: string;
  date: string;
  totalTime: number;
  transfers: number;
  busRoutes: string[];
  distance: number; // km
  fare: number;
  walkingTime: number;
  path: [number, number][];
}

export interface RecordedTrace {
  id: string;
  userId: string;
  userName: string;
  busCode: string;
  date: string;
  duration: number;
  distance: number;
  points: number;
  status: 'pending' | 'processed' | 'validated';
  path: [number, number][];
}

// Paraderos reales del Valle de Aburrá
export const busStops: BusStop[] = [
  { id: 's1', name: 'Parque de Aranjuez', lat: 6.2748, lng: -75.5544, zone: 'Aranjuez' },
  { id: 's2', name: 'Estación Hospital', lat: 6.2690, lng: -75.5637, zone: 'Centro' },
  { id: 's3', name: 'Parque Berrío', lat: 6.2518, lng: -75.5636, zone: 'Centro' },
  { id: 's4', name: 'Estación Caribe', lat: 6.2781, lng: -75.5712, zone: 'Caribe' },
  { id: 's5', name: 'Terminal del Norte', lat: 6.2900, lng: -75.5735, zone: 'Caribe' },
  { id: 's6', name: 'Estación Niquía', lat: 6.3379, lng: -75.5441, zone: 'Bello' },
  { id: 's7', name: 'Parque de Bello', lat: 6.3345, lng: -75.5560, zone: 'Bello' },
  { id: 's8', name: 'Estación Madera', lat: 6.3185, lng: -75.5530, zone: 'Bello' },
  { id: 's9', name: 'Universidad de Medellín', lat: 6.2310, lng: -75.6100, zone: 'Belén' },
  { id: 's10', name: 'Estación Industriales', lat: 6.2370, lng: -75.5770, zone: 'El Poblado' },
  { id: 's11', name: 'Estación Poblado', lat: 6.2105, lng: -75.5755, zone: 'El Poblado' },
  { id: 's12', name: 'Estación Envigado', lat: 6.1747, lng: -75.5832, zone: 'Envigado' },
  { id: 's13', name: 'Parque Envigado', lat: 6.1752, lng: -75.5907, zone: 'Envigado' },
  { id: 's14', name: 'Estación Itagüí', lat: 6.1850, lng: -75.5995, zone: 'Itagüí' },
  { id: 's15', name: 'Estación Sabaneta', lat: 6.1517, lng: -75.6167, zone: 'Sabaneta' },
  { id: 's16', name: 'La Estrella Centro', lat: 6.1590, lng: -75.6290, zone: 'La Estrella' },
  { id: 's17', name: 'Estación Acevedo', lat: 6.2900, lng: -75.5580, zone: 'Aranjuez' },
  { id: 's18', name: 'Estación San Antonio', lat: 6.2470, lng: -75.5690, zone: 'Centro' },
  { id: 's19', name: 'Estación Alpujarra', lat: 6.2440, lng: -75.5740, zone: 'Centro' },
  { id: 's20', name: 'Estación Suramericana', lat: 6.2350, lng: -75.5850, zone: 'Laureles' },
  { id: 's21', name: 'Estación Estadio', lat: 6.2345, lng: -75.5905, zone: 'Laureles' },
  { id: 's22', name: 'Terminal del Sur', lat: 6.2170, lng: -75.5880, zone: 'El Poblado' },
  { id: 's23', name: 'Av. Oriental con Calle 50', lat: 6.2560, lng: -75.5620, zone: 'Centro' },
  { id: 's24', name: 'Glorieta de Bulerías', lat: 6.2430, lng: -75.5950, zone: 'Laureles' },
  { id: 's25', name: 'Copacabana Centro', lat: 6.3500, lng: -75.5100, zone: 'Copacabana' },
];

// Rutas de buses simuladas
export const busRoutes: BusRoute[] = [
  {
    id: 'r1', name: 'Aranjuez - Bello por Caribe', code: '301A',
    color: '#3b82f6', company: 'Coonatra',
    stops: ['s1', 's2', 's4', 's5', 's8', 's7', 's6'],
    frequency: 8, confidence: 92, mappedBy: 156, status: 'validated'
  },
  {
    id: 'r2', name: 'Centro - Envigado', code: '125',
    color: '#f59e0b', company: 'Transportes Medellín',
    stops: ['s3', 's18', 's10', 's11', 's12', 's13'],
    frequency: 6, confidence: 95, mappedBy: 234, status: 'validated'
  },
  {
    id: 'r3', name: 'Bello - El Poblado', code: '250B',
    color: '#ef4444', company: 'Sotrames',
    stops: ['s6', 's7', 's8', 's5', 's4', 's17', 's2', 's3', 's18', 's10', 's11'],
    frequency: 10, confidence: 88, mappedBy: 98, status: 'validated'
  },
  {
    id: 'r4', name: 'Circular Laureles - Centro', code: 'C6',
    color: '#8b5cf6', company: 'Coonatra',
    stops: ['s24', 's21', 's20', 's19', 's18', 's3'],
    frequency: 5, confidence: 97, mappedBy: 312, status: 'validated'
  },
  {
    id: 'r5', name: 'Sabaneta - Terminal Norte', code: '345',
    color: '#06b6d4', company: 'Transportes Sabaneta',
    stops: ['s15', 's14', 's12', 's11', 's10', 's19', 's18', 's3', 's4', 's5'],
    frequency: 12, confidence: 82, mappedBy: 67, status: 'validated'
  },
  {
    id: 'r6', name: 'La Estrella - Centro', code: '410',
    color: '#10b981', company: 'Cootransfun',
    stops: ['s16', 's15', 's14', 's22', 's11', 's10', 's19', 's18'],
    frequency: 15, confidence: 75, mappedBy: 42, status: 'validated'
  },
  {
    id: 'r7', name: 'Copacabana - Parque Berrío', code: '290',
    color: '#f97316', company: 'Coonatra',
    stops: ['s25', 's6', 's8', 's5', 's4', 's2', 's3'],
    frequency: 10, confidence: 70, mappedBy: 35, status: 'candidate'
  },
  {
    id: 'r8', name: 'Aranjuez - Laureles', code: '080',
    color: '#ec4899', company: 'Sotrames',
    stops: ['s1', 's17', 's2', 's23', 's3', 's18', 's19', 's20', 's21', 's24'],
    frequency: 7, confidence: 90, mappedBy: 128, status: 'validated'
  },
  {
    id: 'r9', name: 'Envigado - Itagüí Circular', code: 'CI4',
    color: '#14b8a6', company: 'Transportes Envigado',
    stops: ['s13', 's12', 's22', 's14'],
    frequency: 8, confidence: 60, mappedBy: 22, status: 'candidate'
  },
  {
    id: 'r10', name: 'Bello - Sabaneta Expreso', code: '500E',
    color: '#6366f1', company: 'Coonatra',
    stops: ['s6', 's5', 's4', 's19', 's10', 's11', 's12', 's14', 's15'],
    frequency: 20, confidence: 55, mappedBy: 18, status: 'pending'
  },
];

// Lugares para autocompletado
export const places = [
  { name: 'Parque de Aranjuez', address: 'Cra. 50 #93-30, Aranjuez', lat: 6.2748, lng: -75.5544 },
  { name: 'Parque de Bello', address: 'Calle 50 #50-10, Bello', lat: 6.3345, lng: -75.5560 },
  { name: 'Parque Berrío', address: 'Cra. 50 #53-45, Centro', lat: 6.2518, lng: -75.5636 },
  { name: 'Parque Envigado', address: 'Calle 38 Sur #40-45, Envigado', lat: 6.1752, lng: -75.5907 },
  { name: 'Centro Comercial Unicentro', address: 'Cra. 66B #34A-76, Laureles', lat: 6.2420, lng: -75.5920 },
  { name: 'Centro Comercial Oviedo', address: 'Cra. 43A #6S-15, El Poblado', lat: 6.2030, lng: -75.5650 },
  { name: 'Centro Comercial Santafé', address: 'Cra. 43A #7S-170, El Poblado', lat: 6.2000, lng: -75.5700 },
  { name: 'Universidad de Antioquia', address: 'Calle 67 #53-108, Centro', lat: 6.2680, lng: -75.5680 },
  { name: 'Universidad de Medellín', address: 'Cra. 87 #30-65, Belén', lat: 6.2310, lng: -75.6100 },
  { name: 'Estación Metro Niquía', address: 'Cra. 52, Bello', lat: 6.3379, lng: -75.5441 },
  { name: 'Estación Metro San Antonio', address: 'Cra. 52 #44-40, Centro', lat: 6.2470, lng: -75.5690 },
  { name: 'Terminal del Norte', address: 'Cra. 64C #78-580, Caribe', lat: 6.2900, lng: -75.5735 },
  { name: 'Terminal del Sur', address: 'Cra. 65 #8B-91, El Poblado', lat: 6.2170, lng: -75.5880 },
  { name: 'Hospital Pablo Tobón Uribe', address: 'Calle 78B #69-240, Robledo', lat: 6.2710, lng: -75.5890 },
  { name: 'Estadio Atanasio Girardot', address: 'Cra. 74 #48-139, Laureles', lat: 6.2570, lng: -75.5910 },
  { name: 'Plaza Botero', address: 'Cra. 52 #52-43, Centro', lat: 6.2520, lng: -75.5695 },
  { name: 'Jardín Botánico', address: 'Calle 73 #51D-14, Caribe', lat: 6.2710, lng: -75.5640 },
  { name: 'Pueblito Paisa', address: 'Cra. 55A #40A-200, La Candelaria', lat: 6.2360, lng: -75.5770 },
  { name: 'Copacabana Centro', address: 'Calle 50 #50-20, Copacabana', lat: 6.3500, lng: -75.5100 },
  { name: 'Sabaneta Parque', address: 'Calle 75S #43A-1, Sabaneta', lat: 6.1517, lng: -75.6167 },
  { name: 'La Estrella Centro', address: 'Cra. 60 #80S-10, La Estrella', lat: 6.1590, lng: -75.6290 },
  { name: 'Itagüí Centro', address: 'Cra. 52 #51-20, Itagüí', lat: 6.1850, lng: -75.5995 },
];

// Función para generar resultados de ruta simulados
export function getRouteResults(origin: string, destination: string): RouteResult[] {
  const originPlace = places.find(p => p.name.toLowerCase().includes(origin.toLowerCase()));
  const destPlace = places.find(p => p.name.toLowerCase().includes(destination.toLowerCase()));

  if (!originPlace || !destPlace) return getDefaultRouteResults();

  return getDefaultRouteResults();
}

function getDefaultRouteResults(): RouteResult[] {
  return [
    {
      id: 'result1',
      totalTime: 35,
      walkingTime: 8,
      waitingTime: 5,
      transfers: 0,
      fare: 2950,
      confidence: 94,
      segments: [
        {
          type: 'walk', duration: 4, distance: 320,
          from: busStops[0], to: busStops[1],
          instructions: 'Camina 320m por la Cra. 50 hacia la Estación Hospital',
          path: [[6.2748, -75.5544], [6.2720, -75.5570], [6.2690, -75.5637]]
        },
        {
          type: 'bus', duration: 22,
          from: busStops[1], to: busStops[7],
          busRoute: busRoutes[0],
          instructions: 'Toma el bus 301A (Coonatra) dirección Bello. Baja en Parque de Bello',
          path: [[6.2690, -75.5637], [6.2781, -75.5712], [6.2900, -75.5735], [6.3185, -75.5530], [6.3345, -75.5560]]
        },
        {
          type: 'walk', duration: 4, distance: 250,
          from: busStops[7], to: busStops[6],
          instructions: 'Camina 250m hasta el Parque de Bello',
          path: [[6.3345, -75.5560], [6.3379, -75.5441]]
        }
      ]
    },
    {
      id: 'result2',
      totalTime: 48,
      walkingTime: 12,
      waitingTime: 10,
      transfers: 1,
      fare: 5900,
      confidence: 88,
      segments: [
        {
          type: 'walk', duration: 3, distance: 200,
          from: busStops[0], to: busStops[16],
          instructions: 'Camina 200m hasta la Estación Acevedo',
          path: [[6.2748, -75.5544], [6.2900, -75.5580]]
        },
        {
          type: 'bus', duration: 15,
          from: busStops[16], to: busStops[2],
          busRoute: busRoutes[7],
          instructions: 'Toma el bus 080 (Sotrames) dirección Centro. Baja en Parque Berrío',
          path: [[6.2900, -75.5580], [6.2690, -75.5637], [6.2560, -75.5620], [6.2518, -75.5636]]
        },
        {
          type: 'walk', duration: 2, distance: 150,
          from: busStops[2], to: busStops[3],
          instructions: 'Camina 150m hasta la parada de la Estación Caribe',
          path: [[6.2518, -75.5636], [6.2600, -75.5680], [6.2781, -75.5712]]
        },
        {
          type: 'bus', duration: 20,
          from: busStops[3], to: busStops[6],
          busRoute: busRoutes[2],
          instructions: 'Toma el bus 250B (Sotrames) dirección Bello. Baja en Parque de Bello',
          path: [[6.2781, -75.5712], [6.2900, -75.5735], [6.3185, -75.5530], [6.3345, -75.5560]]
        },
        {
          type: 'walk', duration: 7, distance: 500,
          from: busStops[6], to: busStops[5],
          instructions: 'Camina 500m hasta Estación Niquía',
          path: [[6.3345, -75.5560], [6.3379, -75.5441]]
        }
      ]
    },
    {
      id: 'result3',
      totalTime: 55,
      walkingTime: 6,
      waitingTime: 15,
      transfers: 1,
      fare: 5900,
      confidence: 76,
      segments: [
        {
          type: 'walk', duration: 3, distance: 180,
          from: busStops[0], to: busStops[1],
          instructions: 'Camina 180m hasta Estación Hospital',
          path: [[6.2748, -75.5544], [6.2690, -75.5637]]
        },
        {
          type: 'bus', duration: 18,
          from: busStops[1], to: busStops[4],
          busRoute: busRoutes[0],
          instructions: 'Toma el bus 301A dirección Norte. Baja en Terminal del Norte',
          path: [[6.2690, -75.5637], [6.2781, -75.5712], [6.2900, -75.5735]]
        },
        {
          type: 'walk', duration: 1, distance: 80,
          from: busStops[4], to: busStops[4],
          instructions: 'Espera en la misma parada el bus 290',
          path: [[6.2900, -75.5735], [6.2900, -75.5735]]
        },
        {
          type: 'bus', duration: 25,
          from: busStops[4], to: busStops[5],
          busRoute: busRoutes[6],
          instructions: 'Toma el bus 290 (Coonatra) dirección Bello/Copacabana. Baja en Niquía',
          path: [[6.2900, -75.5735], [6.3185, -75.5530], [6.3345, -75.5560], [6.3379, -75.5441]]
        },
        {
          type: 'walk', duration: 2, distance: 120,
          from: busStops[5], to: busStops[6],
          instructions: 'Camina 120m hasta Parque de Bello',
          path: [[6.3379, -75.5441], [6.3345, -75.5560]]
        }
      ]
    }
  ];
}

// Historial de rutas guardadas simulado
export const savedRoutes: SavedRoute[] = [
  { id: 'h1', origin: 'Parque de Aranjuez', destination: 'Parque de Bello', date: '2026-02-18', totalTime: 35, transfers: 0, busRoutes: ['301A'], distance: 8.5, fare: 2950, walkingTime: 8, path: [[6.2748, -75.5544], [6.2720, -75.5570], [6.2690, -75.5637], [6.2781, -75.5712], [6.2900, -75.5735], [6.3185, -75.5530], [6.3345, -75.5560]] },
  { id: 'h2', origin: 'Estación Poblado', destination: 'Universidad de Medellín', date: '2026-02-17', totalTime: 42, transfers: 1, busRoutes: ['125', 'C6'], distance: 10.2, fare: 5900, walkingTime: 10, path: [[6.2105, -75.5755], [6.2370, -75.5770], [6.2470, -75.5690], [6.2440, -75.5740], [6.2350, -75.5850], [6.2345, -75.5905], [6.2310, -75.6100]] },
  { id: 'h3', origin: 'Parque Envigado', destination: 'Terminal del Norte', date: '2026-02-15', totalTime: 55, transfers: 0, busRoutes: ['345'], distance: 15.8, fare: 2950, walkingTime: 6, path: [[6.1752, -75.5907], [6.1747, -75.5832], [6.2105, -75.5755], [6.2370, -75.5770], [6.2518, -75.5636], [6.2781, -75.5712], [6.2900, -75.5735]] },
  { id: 'h4', origin: 'Sabaneta Parque', destination: 'Parque Berrío', date: '2026-02-14', totalTime: 48, transfers: 1, busRoutes: ['410', '125'], distance: 13.4, fare: 5900, walkingTime: 12, path: [[6.1517, -75.6167], [6.1590, -75.6290], [6.1850, -75.5995], [6.2105, -75.5755], [6.2370, -75.5770], [6.2470, -75.5690], [6.2518, -75.5636]] },
  { id: 'h5', origin: 'Copacabana Centro', destination: 'Estadio Atanasio Girardot', date: '2026-02-12', totalTime: 65, transfers: 2, busRoutes: ['290', '301A', 'C6'], distance: 18.7, fare: 8850, walkingTime: 15, path: [[6.3500, -75.5100], [6.3379, -75.5441], [6.3185, -75.5530], [6.2900, -75.5735], [6.2781, -75.5712], [6.2690, -75.5637], [6.2518, -75.5636], [6.2470, -75.5690], [6.2350, -75.5850], [6.2345, -75.5905]] },
  { id: 'h6', origin: 'La Estrella Centro', destination: 'Universidad de Antioquia', date: '2026-02-10', totalTime: 58, transfers: 1, busRoutes: ['410', '080'], distance: 16.1, fare: 5900, walkingTime: 8, path: [[6.1590, -75.6290], [6.1517, -75.6167], [6.1850, -75.5995], [6.2105, -75.5755], [6.2370, -75.5770], [6.2470, -75.5690], [6.2560, -75.5620], [6.2680, -75.5680]] },
];

// Trazas GPS grabadas (admin)
export const recordedTraces: RecordedTrace[] = [
  { id: 't1', userId: 'u1', userName: 'Carlos M.', busCode: '301A', date: '2026-02-18', duration: 38, distance: 12.4, points: 458, status: 'validated', path: [[6.2748, -75.5544], [6.2690, -75.5637], [6.2781, -75.5712], [6.3345, -75.5560]] },
  { id: 't2', userId: 'u2', userName: 'María P.', busCode: '125', date: '2026-02-18', duration: 32, distance: 9.8, points: 312, status: 'validated', path: [[6.2518, -75.5636], [6.2370, -75.5770], [6.2105, -75.5755], [6.1752, -75.5907]] },
  { id: 't3', userId: 'u3', userName: 'Andrés G.', busCode: '250B', date: '2026-02-17', duration: 45, distance: 15.2, points: 523, status: 'processed', path: [[6.3379, -75.5441], [6.3185, -75.5530], [6.2781, -75.5712], [6.2518, -75.5636], [6.2105, -75.5755]] },
  { id: 't4', userId: 'u4', userName: 'Laura R.', busCode: 'C6', date: '2026-02-17', duration: 18, distance: 5.6, points: 178, status: 'validated', path: [[6.2430, -75.5950], [6.2345, -75.5905], [6.2350, -75.5850], [6.2440, -75.5740], [6.2518, -75.5636]] },
  { id: 't5', userId: 'u5', userName: 'Jorge L.', busCode: '345', date: '2026-02-16', duration: 52, distance: 18.3, points: 634, status: 'processed', path: [[6.1517, -75.6167], [6.1850, -75.5995], [6.1747, -75.5832], [6.2370, -75.5770], [6.2900, -75.5735]] },
  { id: 't6', userId: 'u6', userName: 'Valentina S.', busCode: '500E', date: '2026-02-16', duration: 60, distance: 22.1, points: 745, status: 'pending', path: [[6.3379, -75.5441], [6.2900, -75.5735], [6.2370, -75.5770], [6.1747, -75.5832], [6.1517, -75.6167]] },
  { id: 't7', userId: 'u7', userName: 'Santiago V.', busCode: '301A', date: '2026-02-15', duration: 40, distance: 12.8, points: 472, status: 'validated', path: [[6.2748, -75.5544], [6.2781, -75.5712], [6.3185, -75.5530], [6.3345, -75.5560]] },
  { id: 't8', userId: 'u8', userName: 'Camila H.', busCode: '290', date: '2026-02-15', duration: 35, distance: 14.5, points: 389, status: 'pending', path: [[6.3500, -75.5100], [6.3379, -75.5441], [6.2900, -75.5735], [6.2518, -75.5636]] },
  { id: 't9', userId: 'u1', userName: 'Carlos M.', busCode: '080', date: '2026-02-14', duration: 28, distance: 8.9, points: 267, status: 'validated', path: [[6.2748, -75.5544], [6.2690, -75.5637], [6.2518, -75.5636], [6.2470, -75.5690], [6.2350, -75.5850], [6.2430, -75.5950]] },
  { id: 't10', userId: 'u9', userName: 'Felipe D.', busCode: '410', date: '2026-02-13', duration: 48, distance: 16.7, points: 556, status: 'processed', path: [[6.1590, -75.6290], [6.1517, -75.6167], [6.1850, -75.5995], [6.2105, -75.5755], [6.2370, -75.5770], [6.2470, -75.5690]] },
];

// Estadísticas para el admin
export const adminStats = {
  totalUsers: 2847,
  activeToday: 342,
  totalRoutes: 10,
  validatedRoutes: 7,
  candidateRoutes: 2,
  pendingRoutes: 1,
  totalTraces: 15632,
  tracesToday: 87,
  coveragePercent: 68,
  zonesWithData: ['Aranjuez', 'Centro', 'Bello', 'El Poblado', 'Envigado', 'Laureles', 'Sabaneta', 'Itagüí', 'La Estrella', 'Copacabana'],
  zonesNeedingData: ['Robledo', 'San Cristóbal', 'Santa Elena', 'Caldas', 'Barbosa', 'Girardota'],
};
