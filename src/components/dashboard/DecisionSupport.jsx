import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import AlertPanel from '../AlertPanel';
import { PRIORITY_ACTIONS as DEFAULT_ACTIONS, CRITICAL_ZONES as DEFAULT_ZONES } from '../../data/mockData';
import { ArrowRight, CheckCircle2, ShieldAlert, Truck, Waves, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DecisionSupport({ data }) {
  const actions = data?.riskAnalysis && data.riskAnalysis.length > 0
    ? data.riskAnalysis
        .filter((z) => ['Critical', 'High', 'Moderate'].includes(z.riskLevel))
        .slice(0, 4)
        .map((zone, idx) => ({
          id: idx + 1,
          region: zone.subdivision,
          action: zone.anomalyPercent > 20 
            ? 'Deploy Emergency Response & Evacuation' 
            : zone.anomalyPercent > 10 
            ? 'Increase Monitoring & Alert Status' 
            : 'Prepare Response Teams',
          type: zone.anomalyPercent > 20 ? 'Immediate' : 'Prevention',
          urgency: zone.riskLevel === 'Critical' ? 'Critical' : zone.riskLevel === 'High' ? 'High' : 'Moderate',
          coverage: Math.round(50 + Math.abs(zone.anomalyPercent)),
        }))
    : DEFAULT_ACTIONS;

  const zones = data?.criticalZones || DEFAULT_ZONES;
  const alerts = data?.alerts || [];
  const [selectedAction, setSelectedAction] = useState(actions[0]);

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
      
      {/* Left Column: Vertical Action Flashcards */}
      <div className="lg:col-span-1">
        <motion.div
          className="flex flex-col gap-3 sticky top-24 max-h-[calc(100vh-150px)] overflow-y-auto pr-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {actions.map((action) => {
            const isSelected = selectedAction?.id === action.id;
            const urgencyColor = {
              'Critical': 'from-red-600 to-red-700',
              'High': 'from-orange-600 to-orange-700',
              'Moderate': 'from-blue-600 to-blue-700'
            };

            return (
              <motion.button
                key={action.id}
                onClick={() => setSelectedAction(action)}
                variants={itemVariants}
                className={`relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 transform hover:scale-105 group ${
                  isSelected
                    ? `bg-gradient-to-br ${urgencyColor[action.urgency]} text-white shadow-lg ring-2 ring-opacity-50 scale-105`
                    : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                {/* Animated background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                </div>

                {/* Left accent line */}
                <div className={`absolute left-0 top-0 w-1 h-full transition-all duration-300 ${
                  isSelected ? 'bg-white opacity-50' : 'bg-slate-300'
                }`} />

                <div className="relative z-10 pl-2">
                  {/* Priority number & urgency */}
                  <div className="flex items-start justify-between mb-2">
                    <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      isSelected 
                        ? 'bg-white/30 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {action.id}
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      action.urgency === 'Critical' ? 'bg-red-200 text-red-700' :
                      action.urgency === 'High' ? 'bg-orange-200 text-orange-700' : 'bg-blue-200 text-blue-700'
                    }`}>
                      {action.urgency}
                    </div>
                  </div>

                  {/* Region & Action Title */}
                  <h4 className={`text-xs font-bold leading-tight opacity-75 mb-1 ${
                    isSelected ? 'text-white' : 'text-slate-500'
                  }`}>
                    {action.region}
                  </h4>
                  <h3 className={`text-sm font-bold leading-tight ${
                    isSelected ? 'text-white' : 'text-slate-800'
                  }`}>
                    {action.action.split(' & ')[0]}
                  </h3>

                  {/* Coverage percentage */}
                  <div className="mt-3 flex items-baseline gap-1">
                    <div className="text-lg font-black">{action.coverage}%</div>
                    <div className="text-xs opacity-75">Coverage</div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full h-1.5 bg-opacity-30 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'
                    }}>
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(action.coverage, 100)}%` }}
                    />
                  </div>

                  {/* Status indicator */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: action.urgency === 'Critical' ? '#ef4444' : action.urgency === 'High' ? '#f59e0b' : '#3b82f6'
                      }} />
                    <span className="text-xs opacity-75 font-medium">
                      {action.type === 'Immediate' ? 'Urgent' : 'Preventive'}
                    </span>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-b-8 border-l-transparent border-b-white border-b-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Right Column: Details & Resource Allocation */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Selected Action Details - Hero Card */}
        {selectedAction && (
          <motion.div
            key={selectedAction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${
              selectedAction.urgency === 'Critical' ? 'from-red-900 via-red-800 to-red-700' :
              selectedAction.urgency === 'High' ? 'from-orange-900 via-orange-800 to-orange-700' : 'from-blue-900 via-blue-800 to-blue-700'
            } text-white rounded-2xl p-6 shadow-xl border border-opacity-30`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-300 text-sm uppercase tracking-wider mb-1">Priority Action</p>
                <h2 className="text-2xl md:text-3xl font-black">{selectedAction.action}</h2>
              </div>
              <div className="text-right ml-4">
                <div className="text-4xl font-black opacity-20">{selectedAction.id}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                <p className="text-slate-200 text-xs uppercase font-semibold tracking-wide">Region</p>
                <p className="text-lg font-bold mt-1">{selectedAction.region}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                <p className="text-slate-200 text-xs uppercase font-semibold tracking-wide">Type</p>
                <p className="text-lg font-bold mt-1">{selectedAction.type}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                <p className="text-slate-200 text-xs uppercase font-semibold tracking-wide">Coverage</p>
                <p className="text-lg font-bold mt-1">{selectedAction.coverage}%</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl px-6 py-3 font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:from-emerald-700 hover:to-emerald-800 transition-all"
          >
            <Zap className="h-5 w-5" />
            Initiate Action
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white text-slate-800 border-2 border-slate-200 rounded-xl px-6 py-3 font-bold hover:border-slate-300 hover:shadow-md transition-all"
          >
            View Full Details
          </motion.button>
        </div>

        {/* Two Column Layout for Alerts and Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Government Alerts */}
          <AlertPanel riskZones={alerts.length > 0 ? alerts : zones} />

          {/* Resource Allocation */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none">
            <CardHeader 
              title="Resource Status" 
              subtitle="Available assets for deployment"
              dark={true}
            />
            
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium">NDRF Teams</span>
                  <span className="font-mono font-bold">12/20</span>
                </div>
                <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 w-[60%] rounded-full" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium">Relief Boats</span>
                  <span className="font-mono font-bold">45/50</span>
                </div>
                <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[90%] rounded-full" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium">Medical Units</span>
                  <span className="font-mono font-bold">8/15</span>
                </div>
                <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 w-[53%] rounded-full" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium">Evacuation Shelters</span>
                  <span className="font-mono font-bold">34/50</span>
                </div>
                <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 w-[68%] rounded-full" />
                </div>
              </motion.div>
            </div>
          </Card>
        </div>

        {/* Impact Projection */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader title="Preventive Impact" subtitle="Projected outcome of implementing recommended actions" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8 flex-1">
              <div className="relative h-40 w-40 flex items-center justify-center flex-shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-emerald-500" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-800">75%</span>
                  <span className="text-xs text-slate-500 font-bold uppercase mt-1">Risk</span>
                  <span className="text-xs text-slate-500 font-bold uppercase">Reduction</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Expected Outcomes</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Lives at risk reduced by 75%
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Property damage minimized
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    Response time improved to {'<'} 2 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Infrastructure safeguarded
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
};
