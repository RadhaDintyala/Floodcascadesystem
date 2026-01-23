import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '../ui/Card';
import { AlertTriangle, Droplets, MapPin, Users, Activity, TrendingUp, Wind } from 'lucide-react';
import { CRITICAL_ZONES as DEFAULT_ZONES, CURRENT_STATS } from '../../data/mockData';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Fix for Leaflet default icon issues in React
import L from 'leaflet';

// Component to update map center dynamically
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function LiveSituation({ data }) {
  // Use real-time data from backend if available, otherwise fall back to mock data
  const zones = data?.criticalZones && data.criticalZones.length > 0 ? data.criticalZones : DEFAULT_ZONES;
  const center = [24.0, 88.0]; // Roughly centered on East India
  const [selectedZone, setSelectedZone] = useState(zones[0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  };

  const sortedZones = zones.sort((a, b) => (b.severity || 0.5) - (a.severity || 0.5));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 h-full">
      
      {/* Left Sidebar: Vertical Flashcards */}
      <div className="lg:col-span-2">
        <motion.div
          className="flex flex-col gap-3 sticky top-24 max-h-[calc(100vh-150px)] overflow-y-auto pr-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedZones.map((zone, idx) => {
            const severity = zone.severity || 0.5;
            const lat = zone.coordinates?.[0] || 24;
            const lng = zone.coordinates?.[1] || 88;
            const isSelected = selectedZone?.id === zone.id || selectedZone?.subdivision === zone.subdivision;

            return (
              <motion.button
                key={zone.id || zone.subdivision}
                onClick={() => setSelectedZone(zone)}
                variants={itemVariants}
                className={`relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 transform hover:scale-105 group ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg ring-2 ring-blue-300 scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                {/* Animated background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                </div>

                {/* Left accent line */}
                <div className={`absolute left-0 top-0 w-1 h-full transition-all duration-300 ${
                  isSelected ? 'bg-blue-300' : 'bg-slate-300'
                }`} />

                <div className="relative z-10 pl-2">
                  {/* Rank & Severity Badge */}
                  <div className="flex items-start justify-between mb-2">
                    <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      isSelected 
                        ? 'bg-blue-400 text-white'
                        : severity > 0.8 ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      severity > 0.8 ? 'bg-blue-200 text-blue-700' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {severity > 0.8 ? 'ALERT' : 'WARNING'}
                    </div>
                  </div>

                  {/* Zone Name */}
                  <h4 className={`text-sm font-bold leading-tight ${
                    isSelected ? 'text-white' : 'text-slate-800'
                  }`}>
                    {zone.name || zone.subdivision}
                  </h4>

                  {/* Severity Score */}
                  <div className="mt-2 flex items-baseline gap-1">
                    <div className="text-2xl font-black">{(severity * 10).toFixed(1)}</div>
                    <div className="text-xs opacity-75">/10</div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full h-2 bg-opacity-30 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'
                    }}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(severity * 100, 100)}%` }}
                    />
                  </div>

                  {/* Live indicator */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs opacity-75 font-medium">
                      Live • {zone.actualRainfall || 'N/A'} mm
                    </span>
                  </div>

                  {/* Anomaly % */}
                  <div className="mt-2 text-xs opacity-75">
                    Anomaly: <span className="font-bold">{zone.anomalyPercent || Math.round(severity * 100)}%</span>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-b-8 border-l-transparent border-b-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Right Column: Map & Stats */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full">
        
        {/* Main Map Panel */}
        <div className="flex flex-col h-[500px] lg:h-auto min-h-[500px] flex-1">
          <Card className="flex-1 relative z-0 h-full hover:shadow-lg transition-shadow" noPadding>
            <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur px-4 py-2.5 rounded-lg shadow-lg border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              🔄 Live Real-time • {zones.length} zones
            </div>
            
            <MapContainer 
              center={center} 
              zoom={6} 
              scrollWheelZoom={false} 
              className="w-full h-full rounded-xl"
              style={{ minHeight: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ChangeView center={center} zoom={6} />
              {zones.map((zone) => {
                const lat = zone.coordinates?.[0] || 24;
                const lng = zone.coordinates?.[1] || 88;
                const severity = zone.severity || 0.5;
                const isSelected = selectedZone?.id === zone.id || selectedZone?.subdivision === zone.subdivision;
                
                return (
                  <CircleMarker 
                    key={zone.id || zone.subdivision}
                    center={[lat, lng]}
                    pathOptions={{ 
                      color: isSelected ? '#2563eb' : severity > 0.8 ? '#3b82f6' : '#60a5fa',
                      fillColor: isSelected ? '#2563eb' : severity > 0.8 ? '#3b82f6' : '#60a5fa',
                      fillOpacity: isSelected ? 0.8 : 0.6,
                      weight: isSelected ? 3 : 2
                    }}
                    radius={Math.max(12, 24 * severity)}
                    eventHandlers={{
                      click: () => setSelectedZone(zone),
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-max">
                        <h4 className="font-bold text-slate-800 mb-1">{zone.name || zone.subdivision}</h4>
                        <p className="text-xs text-slate-500">{zone.state || 'N/A'}</p>
                        <div className="mt-2 text-xs font-semibold space-y-1">
                          <div>Severity: <span className="text-blue-600">{(severity * 10).toFixed(1)}/10</span></div>
                          <div>Anomaly: <span className="text-blue-600">{zone.anomalyPercent || 0}%</span></div>
                          <div>Rainfall: <span className="text-blue-600">{zone.actualRainfall || 'N/A'} mm</span></div>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </Card>
        </div>

        {/* Bottom Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-[10px] font-bold uppercase text-red-700 tracking-wider">Alert Level</p>
            </div>
            <p className="text-lg font-black text-red-900">CRITICAL</p>
            <p className="text-[10px] text-red-600 mt-1">Immediate action needed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <p className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">Zones</p>
            </div>
            <p className="text-lg font-black text-blue-900">{zones.length}</p>
            <p className="text-[10px] text-blue-600 mt-1">Under monitoring</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-600" />
              <p className="text-[10px] font-bold uppercase text-purple-700 tracking-wider">Population</p>
            </div>
            <p className="text-lg font-black text-purple-900">{CURRENT_STATS.affectedPopulation}</p>
            <p className="text-[10px] text-purple-600 mt-1">At risk</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3 border border-cyan-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-4 w-4 text-cyan-600" />
              <p className="text-[10px] font-bold uppercase text-cyan-700 tracking-wider">Water Level</p>
            </div>
            <p className="text-lg font-black text-cyan-900">{CURRENT_STATS.waterLevelTrend}</p>
            <p className="text-[10px] text-cyan-600 mt-1">Trend rising</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
