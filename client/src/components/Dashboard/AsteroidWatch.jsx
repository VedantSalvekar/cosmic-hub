import React, { useState, useEffect } from 'react';
import { 
  Target, 
  AlertTriangle, 
  Clock, 
  Search, 
  Bell, 
  Eye,
  Calendar,
  Zap,
  Globe,
  Activity,
  Info,
  Filter,
  TrendingUp,
  Shield,
  Orbit
} from 'lucide-react';
import AsteroidTracker from './AsteroidWatch/AsteroidTracker';
import ThreatAssessment from './AsteroidWatch/ThreatAssessment';
import HistoricalAnalysis from './AsteroidWatch/HistoricalAnalysis';
import AsteroidProfiles from './AsteroidWatch/AsteroidProfiles';
import AlertSystem from './AsteroidWatch/AlertSystem';

const AsteroidWatch = () => {
  const [activeTab, setActiveTab] = useState('tracker');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { 
      id: 'tracker', 
      label: 'Live Tracker', 
      icon: Target,
      description: 'Real-time asteroid approaches'
    },
    { 
      id: 'history', 
      label: 'Historical Analysis', 
      icon: Clock,
      description: 'Past close approaches'
    }
    // Hidden tabs (kept in codebase for future use):
    // { 
    //   id: 'threats', 
    //   label: 'Threat Assessment', 
    //   icon: AlertTriangle,
    //   description: 'Potentially hazardous objects'
    // },
    // { 
    //   id: 'profiles', 
    //   label: 'Asteroid Profiles', 
    //   icon: Search,
    //   description: 'Detailed asteroid data'
    // },
    // { 
    //   id: 'alerts', 
    //   label: 'Alert System', 
    //   icon: Bell,
    //   description: 'Monitoring & notifications'
    // }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'tracker':
        return <AsteroidTracker />;
      case 'history':
        return <HistoricalAnalysis />;
      // Hidden components (kept in codebase for future use):
      // case 'threats':
      //   return <ThreatAssessment />;
      // case 'profiles':
      //   return <AsteroidProfiles />;
      // case 'alerts':
      //   return <AlertSystem />;
      default:
        return <AsteroidTracker />;
    }
  };

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

      {/* Navigation Tabs */}
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-2 border border-white/10">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'hover:bg-white/10 text-white/70 hover:text-white'
                  }
                `}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                <div className="text-left hidden sm:block">
                  <div className="font-medium">{tab.label}</div>
                  <div className={`text-xs ${isActive ? 'text-white/80' : 'text-white/50'}`}>
                    {tab.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default AsteroidWatch; 