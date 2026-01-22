import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { IMPACT_DATA, CRITICAL_ZONES } from '../../data/mockData';
import { Badge } from '../ui/Badge';
import { TrendingUp, Wheat, Building2 } from 'lucide-react';

export const ImpactAnalysis = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Critical Areas List */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <Card className="flex-1">
          <CardHeader 
            title="Critical Areas (Past 7 Days)" 
            subtitle="Ranked by cumulative damage score"
          />
          <div className="space-y-4">
            {CRITICAL_ZONES.sort((a,b) => b.severity - a.severity).map((zone, idx) => (
              <div key={zone.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{zone.name}</h4>
                    <p className="text-xs text-slate-500">{zone.state}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-800">{(zone.severity * 10).toFixed(1)}</div>
                  <p className="text-[10px] text-slate-500 uppercase">Impact Score</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right Column: Analytics */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Top Row Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Sector-wise Loss" subtitle="Estimated financial impact distribution" />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={IMPACT_DATA.sectorLoss}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {IMPACT_DATA.sectorLoss.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {IMPACT_DATA.sectorLoss.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Impact Progression" subtitle="Cascading severity over last 7 days" />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={IMPACT_DATA.timeline}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="impact" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Bottom Row: Infrastructure */}
        <Card>
          <CardHeader title="Infrastructure Damage Assessment" subtitle="Critical infrastructure units affected" />
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={IMPACT_DATA.infrastructure} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#475569', fontWeight: 500}} width={100} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="loss" fill="#64748b" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
};
