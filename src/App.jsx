import { useState, useEffect } from 'react';
import { Activity, ScanLine, Database, Settings, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Background3D from './components/Background3D';
import DetectTab from './components/DetectTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('detect');
  const [apiStatus, setApiStatus] = useState('connecting...');

  useEffect(() => {
    const checkApi = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
        setTimeout(() => setApiStatus('online'), 1000); 
      } catch {
        setApiStatus('offline');
      }
    };
    checkApi();
  }, []);

  const navItems = [
    { id: 'detect', label: 'Detect', icon: ScanLine },
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'config', label: 'Configuration', icon: Settings },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      <Background3D />

      <div className="relative z-10 flex h-screen">
        <aside className="w-64 glass-panel border-y-0 border-l-0 flex flex-col">
          <div className="p-8">
            <h1 className="text-2xl font-black tracking-tighter uppercase text-glow">
              DF_Detect
            </h1>
            <p className="text-xs text-gray-400 mt-2 font-mono tracking-widest uppercase">
              By PRAKITESH BAKSHI
            </p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-white/10 text-neon-blue shadow-[inset_2px_0_0_#00f3ff]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 m-4 rounded-lg bg-black/40 border border-white/5 flex items-center space-x-3">
            <Server size={16} className={apiStatus === 'online' ? 'text-green-400' : 'text-red-400'} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">API Status</p>
              <p className="text-sm font-mono">{apiStatus}</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-end mb-4 space-x-3">
            <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">Aditya Roy</span>
            <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">Prakitesh Bakshi</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeTab === 'detect' && <DetectTab />}
              {activeTab === 'overview' && <div className="text-2xl font-light tracking-tight">Overview Dashboard <span className="text-gray-500 text-sm font-mono">(IN DEVELOPMENT)</span></div>}
              {activeTab === 'datasets' && <div className="text-2xl font-light tracking-tight">Dataset Management <span className="text-gray-500 text-sm font-mono">(IN DEVELOPMENT)</span></div>}
              {activeTab === 'config' && <div className="text-2xl font-light tracking-tight">Model Configuration <span className="text-gray-500 text-sm font-mono">(IN DEVELOPMENT)</span></div>}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}