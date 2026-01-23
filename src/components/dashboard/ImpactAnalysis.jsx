import { Card, CardHeader } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { IMPACT_DATA as DEFAULT_IMPACT, CRITICAL_ZONES as DEFAULT_ZONES } from '../../data/mockData';
import { Badge } from '../ui/Badge';
import { TrendingUp, Wheat, Building2, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ImpactAnalysis({ data }) {
  const impactData = data?.impactData || DEFAULT_IMPACT;
  const zones = data?.riskAnalysis && data.riskAnalysis.length > 0 
    ? data.riskAnalysis.map((z) => ({
        name: z.subdivision,
        severity: (z.anomalyPercent || 0) / 100,
        state: z.subdivision
      }))
    : DEFAULT_ZONES;

  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const sortedZones = zones.sort((a,b) => (b.severity || 0) - (a.severity || 0));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      {/* Left Column: Vertical Flashcards */}
      <div className="lg:col-span-1">
        <motion.div
          className="flex flex-col gap-3 sticky top-24 max-h-[calc(100vh-150px)] overflow-y-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedZones.map((zone, idx) => (
            <motion.button
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              variants={itemVariants}
              className={`relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 transform hover:scale-105 ${
                selectedZone?.name === zone.name
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg ring-2 ring-blue-300 scale-105'
                  : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              {/* Animated background accent */}
              <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${
                selectedZone?.name === zone.name ? 'bg-blue-300' : 'bg-slate-300'
              }`} />
              
              <div className="relative pl-2">
                {/* Rank Badge */}
                <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mb-2 ${
                  selectedZone?.name === zone.name 
                    ? 'bg-blue-400 text-white'
                    : idx < 2 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {idx + 1}
                </div>

                {/* Zone Name */}
                <h4 className={`text-sm font-bold leading-tight ${
                  selectedZone?.name === zone.name ? 'text-white' : 'text-slate-800'
                }`}>
                  {zone.name}
                </h4>
                
                {/* Severity Score */}
                <div className="mt-2 flex items-center gap-1">
                  <div className="text-2xl font-black">{(zone.severity * 10).toFixed(1)}</div>
                  <div className="text-[10px] opacity-75">/10</div>
                </div>

                {/* Severity Bar */}
                <div className="mt-2 w-full h-1.5 bg-opacity-30 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: selectedZone?.name === zone.name ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'
                  }}>
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(zone.severity * 100, 100)}%` }}
                  />
                </div>

                {/* Status Indicator */}
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-xs opacity-75 font-medium">
                    {zone.severity > 0.7 ? 'CRITICAL' : zone.severity > 0.4 ? 'HIGH' : 'MODERATE'}
                  </span>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-b-8 border-l-transparent border-b-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Right Column: Analytics & Details */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Selected Zone Details - Hero Card */}
        {selectedZone && (
          <motion.div
            key={selectedZone.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white rounded-2xl p-6 shadow-xl border border-slate-600"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-black mb-1">{selectedZone.name}</h2>
                <p className="text-slate-300 text-sm">Impact Analysis Details</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-blue-400">{(selectedZone.severity * 100).toFixed(0)}%</div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mt-1">Anomaly</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3">
                <p className="text-slate-400 text-xs uppercase font-semibold tracking-wide">Severity</p>
                <p className="text-2xl font-black text-amber-400 mt-1">{(selectedZone.severity * 10).toFixed(1)}/10</p>
              </div>
              <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3">
                <p className="text-slate-400 text-xs uppercase font-semibold tracking-wide">Status</p>
                <p className="text-sm font-bold mt-1 text-red-400">● CRITICAL</p>
              </div>
              <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3">
                <p className="text-slate-400 text-xs uppercase font-semibold tracking-wide">Risk Level</p>
                <p className="text-sm font-bold mt-1 text-orange-400">HIGH</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Row Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader title="Sector-wise Loss" subtitle="Estimated financial impact distribution" />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactData.sectorLoss}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {impactData.sectorLoss.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2 flex-wrap px-2">
              {impactData.sectorLoss.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader title="Impact Progression" subtitle="Cascading severity over last 7 days" />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={impactData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="impact" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 7, shadow: '0 0 0 4px rgba(59, 130, 246, 0.2)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Bottom Row: Infrastructure */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader title="Infrastructure Damage Assessment" subtitle="Critical infrastructure units affected" />
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData.infrastructure} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#475569', fontWeight: 500}} width={100} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="loss" fill="#64748b" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
};
