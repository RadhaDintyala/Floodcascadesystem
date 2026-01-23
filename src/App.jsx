import { useState } from 'react';
import LiveSituation from './components/dashboard/LiveSituation.jsx';
import ImpactAnalysis from './components/dashboard/ImpactAnalysis.jsx';
import DecisionSupport from './components/dashboard/DecisionSupport.jsx';
import { cn, formatDate } from './lib/utils';
import { Activity, BarChart3, ShieldCheck, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('live');
  const [currentTime] = useState(new Date());

  const tabs = [
    { id: 'live', label: 'Live Situation', icon: Activity },
    { id: 'impact', label: 'Impact Analysis', icon: BarChart3 },
    { id: 'action', label: 'Prevention & Action', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-slate-900 text-white p-1.5 rounded">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-lg font-bold leading-none tracking-tight text-slate-900">NDMA <span className="font-normal text-slate-500">| Flood Risk</span></h1>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Decision Support System</p>
                </div>
              </div>
            </div>

            {/* Center Tabs (Desktop) */}
            <nav className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-slate-100 text-slate-900 shadow-sm ring-1 ring-slate-200" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-medium text-slate-900">{formatDate(currentTime)}</p>
                <p className="text-[10px] text-slate-500">UTC+05:30</p>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">
                IN
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Tab Bar */}
        <div className="md:hidden border-t border-slate-100 p-2 flex justify-around bg-white">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors",
                  isActive ? "text-blue-600 bg-blue-50" : "text-slate-500"
                )}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'live' && <LiveSituation />}
              {activeTab === 'impact' && <ImpactAnalysis />}
              {activeTab === 'action' && <DecisionSupport />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-200 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs text-slate-400 max-w-2xl">
            Insights generated using historical flood data, regional exposure datasets, and machine-learning–based risk analysis. 
            This system is a decision-support platform, not a prediction or alert system.
          </p>
          <div className="text-xs font-medium text-slate-500">
            v2.4.0-gov-stable
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
