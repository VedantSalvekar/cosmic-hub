import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Clock, 
  Globe,
  Activity
} from 'lucide-react';
import AsteroidTracker from './AsteroidWatch/AsteroidTracker';

const AsteroidWatch = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen text-white p-6 space-y-6">
      {/* Header Section */}
      <div className="relative">
        <div className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-cyan-900/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    Asteroid Watch Center
                  </h1>
                  <p className="text-white/70 text-lg">
                    Monitoring Near-Earth Objects and Space Threats
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-lg border border-green-500/30">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-green-300">System Online</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300">NASA Data Feed Active</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300">
                    {currentTime.toLocaleTimeString()} UTC
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-300">24/7</div>
                <div className="text-sm text-white/60">Monitoring</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Live Feed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        <AsteroidTracker />
      </div>
    </div>
  );
};

export default AsteroidWatch; 