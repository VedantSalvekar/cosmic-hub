import React from 'react';
import { 
  Target, 
  Clock, 
  Zap, 
  AlertTriangle, 
  Activity,
  Eye,
  Calendar,
  Ruler
} from 'lucide-react';
import RiskBadge from './RiskBadge';
import Countdown from './Countdown';

const AsteroidCard = ({ asteroid }) => {
  const getThreatColor = (level) => {
    switch (level) {
      case 'high': return 'from-red-600 to-red-800';
      case 'medium': return 'from-yellow-600 to-orange-600';
      case 'low': return 'from-green-600 to-green-800';
      default: return 'from-blue-600 to-blue-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDate(asteroid.approachDate);
  const isApproaching = asteroid.isApproachingNow;

  return (
    <div className={`
      relative bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-lg 
      rounded-2xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-2xl
      ${asteroid.isPotentiallyHazardous 
        ? 'border-red-500/30 hover:border-red-400/50' 
        : 'border-white/10 hover:border-white/20'
      }
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-gradient-to-br ${getThreatColor(asteroid.threatLevel)} rounded-lg`}>
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{asteroid.name}</h3>
            <p className="text-sm text-white/60">{asteroid.fullName}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isApproaching && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-300 font-medium">APPROACHING</span>
            </div>
          )}
          <RiskBadge level={asteroid.threatLevel} isPHO={asteroid.isPotentiallyHazardous} />
        </div>
      </div>

      {/* Countdown */}
      <div className="mb-4">
        <Countdown targetDate={asteroid.approachDate} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Ruler className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-300 font-medium">Distance</span>
          </div>
          <div className="text-sm text-white">
            <div className="font-bold">{asteroid.distance.ld} LD</div>
            <div className="text-white/60 text-xs">{asteroid.distance.au} AU</div>
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-300 font-medium">Velocity</span>
          </div>
          <div className="text-sm text-white">
                            <div className="font-bold">{asteroid.velocity?.kms || asteroid.velocity} km/s</div>
            <div className="text-white/60 text-xs">Relative to Earth</div>
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-300 font-medium">Size</span>
          </div>
          <div className="text-sm text-white">
            <div className="font-bold">{asteroid.diameter.min}-{asteroid.diameter.max}m</div>
            <div className="text-white/60 text-xs">Estimated diameter</div>
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-300 font-medium">Magnitude</span>
          </div>
          <div className="text-sm text-white">
            <div className="font-bold">{asteroid.magnitude}</div>
            <div className="text-white/60 text-xs">Absolute magnitude</div>
          </div>
        </div>
      </div>

      {/* Approach Details */}
      <div className="bg-black/20 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-cyan-300 font-medium">Close Approach</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-white">{date}</div>
            <div className="text-xs text-white/60">{time} UTC</div>
          </div>
          {asteroid.isPotentiallyHazardous && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-900/30 rounded border border-red-500/30">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-300">PHO</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsteroidCard; 