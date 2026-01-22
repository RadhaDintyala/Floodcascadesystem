import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PRIORITY_ACTIONS } from '../../data/mockData';
import { ArrowRight, CheckCircle2, ShieldAlert, Truck, Waves } from 'lucide-react';
import { cn } from '../../lib/utils';

export const DecisionSupport = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Priority Actions Panel */}
      <div className="lg:col-span-8">
        <Card className="h-full">
          <CardHeader 
            title="Recommended Interventions" 
            subtitle="AI-prioritized actions based on current risk and impact analysis"
          />
          
          <div className="space-y-4">
            {PRIORITY_ACTIONS.map((action) => (
              <div key={action.id} className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-lg shrink-0",
                      action.urgency === 'Critical' ? "bg-red-100 text-red-600" :
                      action.urgency === 'High' ? "bg-orange-100 text-orange-600" :
                      "bg-blue-100 text-blue-600"
                    )}>
                      {action.type === 'Immediate' && <ShieldAlert className="h-6 w-6" />}
                      {action.type === 'Infrastructure' && <Truck className="h-6 w-6" />}
                      {action.type === 'Drainage' && <Waves className="h-6 w-6" />}
                      {action.type === 'Prevention' && <CheckCircle2 className="h-6 w-6" />}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={
                          action.urgency === 'Critical' ? 'critical' :
                          action.urgency === 'High' ? 'warning' : 'default'
                        }>
                          {action.urgency} Priority
                        </Badge>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{action.region}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{action.action}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Predicted to reduce risk exposure by <span className="font-semibold text-emerald-600">{action.coverage}%</span> in the next 24h.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center md:flex-col gap-2 shrink-0">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors w-full md:w-auto">
                      Initiate
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button className="px-4 py-2 text-slate-600 text-sm font-medium hover:text-slate-900 transition-colors">
                      View Details
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Side Panel: Effectiveness & Resources */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none">
          <div className="p-2">
            <h3 className="text-lg font-bold mb-1">Resource Allocation</h3>
            <p className="text-slate-300 text-sm mb-6">Available assets for deployment</p>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">NDRF Teams</span>
                  <span className="font-mono">12/20</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[60%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Relief Boats</span>
                  <span className="font-mono">45/50</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[90%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Medical Units</span>
                  <span className="font-mono">8/15</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[53%]" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Preventive Impact" subtitle="Projected outcome of actions" />
          <div className="flex items-center justify-center py-6">
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-emerald-500" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-800">75%</span>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Risk Reduction</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-slate-500 px-4">
            Implementation of top 3 actions is projected to reduce overall casualty risk by 75%.
          </p>
        </Card>
      </div>

    </div>
  );
};
