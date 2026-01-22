import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '../ui/Card';
import { AlertTriangle, Droplets, MapPin, Users, Activity } from 'lucide-react';
import { CRITICAL_ZONES, CURRENT_STATS } from '../../data/mockData';

// Fix for Leaflet default icon issues in React
import L from 'leaflet';

// Component to update map center dynamically
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export const LiveSituation = () => {
  const center: [number, number] = [24.0, 88.0]; // Roughly centered on East India

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Main Map Panel */}
      <div className="lg:col-span-9 flex flex-col h-[500px] lg:h-auto min-h-[500px]">
        <Card className="flex-1 relative z-0 h-full" noPadding>
          <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-md shadow border border-slate-200 text-xs font-medium text-slate-600">
            Live Satellite Feed • Updated 12m ago
          </div>
          
          <MapContainer 
            center={center} 
            zoom={6} 
            scrollWheelZoom={false} 
            className="w-full h-full"
            style={{ minHeight: '100%' }}
          >
            <ChangeView center={center} zoom={6} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {CRITICAL_ZONES.map((zone) => (
              <CircleMarker 
                key={zone.id}
                center={zone.coordinates as [number, number]}
                pathOptions={{ 
                  color: zone.severity > 0.8 ? '#ef4444' : '#f59e0b',
                  fillColor: zone.severity > 0.8 ? '#ef4444' : '#f59e0b',
                  fillOpacity: 0.6
                }}
                radius={20 * zone.severity}
              >
                <Popup>
                  <div className="p-1">
                    <h4 className="font-bold text-slate-800">{zone.name}</h4>
                    <p className="text-xs text-slate-500">{zone.state}</p>
                    <div className="mt-2 text-xs font-semibold">
                      Severity Score: {(zone.severity * 10).toFixed(1)}/10
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </Card>
      </div>

      {/* Side Summary Cards */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <Card className="bg-red-50 border-red-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 uppercase tracking-wider">Overall Status</p>
              <h3 className="text-2xl font-bold text-red-900 mt-1">{CURRENT_STATS.impactSeverity} Alert</h3>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-sm text-red-700 mt-2">
            Severe flooding reported in {CURRENT_STATS.activeZones} zones. Immediate action required.
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Most Critical Region</p>
              <p className="font-semibold text-slate-800">{CURRENT_STATS.criticalRegion}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Affected Population</p>
              <p className="font-semibold text-slate-800">{CURRENT_STATS.affectedPopulation}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Droplets className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Water Level Trend</p>
              <p className="font-semibold text-slate-800">{CURRENT_STATS.waterLevelTrend}</p>
            </div>
          </div>
        </Card>

        <div className="mt-auto p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600">System Status</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Sensors Active</span>
            <span className="text-emerald-600 font-medium">98.4%</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>ML Confidence</span>
            <span className="text-blue-600 font-medium">High (92%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
