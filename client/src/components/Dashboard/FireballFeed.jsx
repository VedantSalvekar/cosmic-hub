import React from 'react';
import { motion } from 'framer-motion';
import { Flame, MapPin, Clock, Zap } from 'lucide-react';

/**
 * Fireball Feed Component
 * 
 * Displays recent fireball events detected by NASA
 * Features:
 * - Scrollable list of recent events
 * - Location and time information
 * - Energy level indicators
 * - Visual impact markers
 * - Auto-refresh capability
 * 
 * Data from NASA's CNEOS Fireball database
 */
const FireballFeed = ({ fireballs = [], isLoading }) => {
  /**
   * Format date for display
   * Shows relative time and full date
   */
  const formatFireballDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  /**
   * Get energy level color and description
   * Based on total impact energy
   */
  const getEnergyLevel = (energy) => {
    if (!energy) return { color: 'gray', level: 'Unknown', intensity: 0 };
    
    const energyVal = parseFloat(energy);
    if (energyVal >= 1) return { color: 'red', level: 'Major', intensity: 100 };
    if (energyVal >= 0.1) return { color: 'orange', level: 'Significant', intensity: 75 };
    if (energyVal >= 0.01) return { color: 'yellow', level: 'Moderate', intensity: 50 };
    return { color: 'green', level: 'Minor', intensity: 25 };
  };

  /**
   * Format coordinates for display
   */
  const formatCoordinates = (lat, lon) => {
    if (!lat || !lon) return 'Unknown Location';
    
    const latDir = parseFloat(lat) >= 0 ? 'N' : 'S';
    const lonDir = parseFloat(lon) >= 0 ? 'E' : 'W';
    
    return `${Math.abs(parseFloat(lat)).toFixed(1)}°${latDir}, ${Math.abs(parseFloat(lon)).toFixed(1)}°${lonDir}`;
  };

  /**
   * Individual fireball item component
   */
  const FireballItem = ({ fireball, index }) => {
    const energy = getEnergyLevel(fireball['impact-e']);
    
    return (
      <motion.div
        className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-full bg-${energy.color}-500/20`}>
              <Flame className={`w-3 h-3 text-${energy.color}-400`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                Fireball Event
              </div>
              <div className="text-xs text-gray-400">
                {formatFireballDate(fireball.date)}
              </div>
            </div>
          </div>
          
          <div className={`text-xs px-2 py-1 rounded-full bg-${energy.color}-500/20 text-${energy.color}-400`}>
            {energy.level}
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {/* Location */}
          <div className="flex items-center space-x-2 text-gray-300">
            <MapPin className="w-3 h-3" />
            <span>{formatCoordinates(fireball.lat, fireball.lon)}</span>
          </div>

          {/* Time */}
          <div className="flex items-center space-x-2 text-gray-300">
            <Clock className="w-3 h-3" />
            <span>{fireball['date-time'] || 'Time unknown'}</span>
          </div>

          {/* Energy */}
          {fireball['impact-e'] && (
            <div className="flex items-center space-x-2 text-gray-300">
              <Zap className="w-3 h-3" />
              <span>{parseFloat(fireball['impact-e']).toFixed(3)} kt TNT</span>
            </div>
          )}

          {/* Energy Level Bar */}
          <div className="mt-2">
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-${energy.color}-400`}
                initial={{ width: 0 }}
                animate={{ width: `${energy.intensity}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="cosmic-card h-80 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <div className="text-gray-300 text-sm">Loading fireball data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cosmic-card h-80 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Fireball Events</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-orange-400 font-bold text-sm">
              {fireballs.length}
            </div>
            <span className="text-xs text-gray-400">Last 7 days</span>
          </div>
        </div>
      </div>

      {/* Fireball List */}
      <div className="flex-1 overflow-hidden">
        {fireballs.length > 0 ? (
          <div className="h-full overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {fireballs.slice(0, 5).map((fireball, index) => (
              <FireballItem 
                key={`${fireball.date}-${fireball.lat}-${fireball.lon}`} 
                fireball={fireball} 
                index={index} 
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Flame className="w-12 h-12 text-gray-500 mx-auto" />
              <div className="text-gray-400">
                <div className="font-medium">No Recent Fireballs</div>
                <div className="text-sm">No events detected in the last 7 days</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm font-bold text-red-400">
              {fireballs.filter(f => parseFloat(f['impact-e'] || 0) >= 1).length}
            </div>
            <div className="text-xs text-gray-400">Major</div>
          </div>
          <div>
            <div className="text-sm font-bold text-orange-400">
              {fireballs.filter(f => {
                const energy = parseFloat(f['impact-e'] || 0);
                return energy >= 0.1 && energy < 1;
              }).length}
            </div>
            <div className="text-xs text-gray-400">Significant</div>
          </div>
          <div>
            <div className="text-sm font-bold text-green-400">
              {fireballs.filter(f => parseFloat(f['impact-e'] || 0) < 0.1).length}
            </div>
            <div className="text-xs text-gray-400">Minor</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireballFeed; 