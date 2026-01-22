// Mock data for the dashboard

export const REGIONS = [
  { id: 'assam', name: 'Assam', lat: 26.2006, lng: 92.9376 },
  { id: 'bihar', name: 'Bihar', lat: 25.0961, lng: 85.3131 },
  { id: 'odisha', name: 'Odisha', lat: 20.9517, lng: 85.0985 },
];

export const CURRENT_STATS = {
  activeZones: 12,
  criticalRegion: 'Barpeta, Assam',
  impactSeverity: 'High',
  affectedPopulation: '2.4M',
  waterLevelTrend: 'Rising', // Rising, Stable, Receding
};

export const CRITICAL_ZONES = [
  { id: 1, name: 'Barpeta', state: 'Assam', severity: 0.9, coordinates: [26.32, 91.00] },
  { id: 2, name: 'Kaziranga', state: 'Assam', severity: 0.85, coordinates: [26.65, 93.35] },
  { id: 3, name: 'Darbhanga', state: 'Bihar', severity: 0.78, coordinates: [26.15, 85.89] },
  { id: 4, name: 'Puri', state: 'Odisha', severity: 0.45, coordinates: [19.81, 85.83] },
];

export const IMPACT_DATA = {
  infrastructure: [
    { name: 'Roads', loss: 450, unit: 'km' },
    { name: 'Bridges', loss: 12, unit: 'units' },
    { name: 'Power Grid', loss: 85, unit: 'substations' },
    { name: 'Telecom', loss: 120, unit: 'towers' },
  ],
  sectorLoss: [
    { name: 'Agriculture', value: 65, color: '#eab308' }, // Yellow-500
    { name: 'Aquaculture', value: 20, color: '#3b82f6' }, // Blue-500
    { name: 'Housing', value: 15, color: '#ef4444' },    // Red-500
  ],
  timeline: [
    { day: 'Day 1', impact: 20 },
    { day: 'Day 2', impact: 35 },
    { day: 'Day 3', impact: 55 },
    { day: 'Day 4', impact: 80 },
    { day: 'Day 5', impact: 75 },
    { day: 'Day 6', impact: 60 },
    { day: 'Day 7', impact: 58 },
  ]
};

export const PRIORITY_ACTIONS = [
  {
    id: 1,
    region: 'Barpeta Dist.',
    action: 'Deploy NDRF Teams',
    type: 'Immediate',
    urgency: 'Critical',
    coverage: 85,
  },
  {
    id: 2,
    region: 'NH-27 Corridor',
    action: 'Reinforce Embankments',
    type: 'Infrastructure',
    urgency: 'High',
    coverage: 60,
  },
  {
    id: 3,
    region: 'Lower Assam',
    action: 'Evacuate Low-lying Zones',
    type: 'Prevention',
    urgency: 'High',
    coverage: 45,
  },
  {
    id: 4,
    region: 'Koshi Belt',
    action: 'Activate Sluice Gates',
    type: 'Drainage',
    urgency: 'Moderate',
    coverage: 90,
  },
];
