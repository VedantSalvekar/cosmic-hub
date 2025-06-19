import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Shield, Globe } from 'lucide-react';

/**
 * Mission Stats Component
 * 
 * Displays key mission metrics in a grid layout:
 * - Asteroids tracked today
 * - Hazardous objects detected
 * - Recent fireball events
 * - Total discoveries
 * - Mission duration
 * 
 * Features:
 * - Animated counters
 * - Color-coded status indicators
 * - Progress bars for some metrics
 * - Glass morphism design
 */
const MissionStats = ({ stats, isLoading }) => {
  /**
   * Animate number counting up
   * Creates a smooth counting animation
   */
  const AnimatedCounter = ({ value, duration = 2 }) => {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-white"
      >
        {value.toLocaleString()}
      </motion.span>
    );
  };

  /**
   * Individual stat card component
   */
  const StatCard = ({ icon: Icon, label, value, color = "blue", trend, delay = 0 }) => {
    const colorClasses = {
      blue: "text-blue-400",
      green: "text-green-400", 
      orange: "text-orange-400",
      purple: "text-purple-400",
      red: "text-red-400"
    };

    return (
      <motion.div
        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg bg-${color}-500/20`}>
            <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
          </div>
          {trend && (
            <div className={`text-xs px-2 py-1 rounded-full ${
              trend > 0 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <AnimatedCounter value={value} />
          <div className="text-sm text-gray-400 leading-tight">
            {label}
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="cosmic-card h-80 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <div className="text-gray-300 text-sm">Loading mission stats...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cosmic-card h-80 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Mission Stats</h3>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 h-full">
        
        {/* Asteroids Today */}
        <StatCard
          icon={Globe}
          label="Asteroids Tracked Today"
          value={stats.asteroidsToday || 0}
          color="blue"
          trend={12}
          delay={0.1}
        />

        {/* Hazardous Objects */}
        <StatCard
          icon={Shield}
          label="Potentially Hazardous Objects"
          value={stats.hazardousCount || 0}
          color={stats.hazardousCount > 0 ? "orange" : "green"}
          trend={-5}
          delay={0.2}
        />

        {/* Recent Fireballs */}
        <StatCard
          icon={Zap}
          label="Recent Fireball Events"
          value={stats.recentFireballs || 0}
          color="red"
          trend={8}
          delay={0.3}
        />

        {/* Mission Day */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm text-gray-400">Mission Day</span>
            </div>
            <div className="text-xs text-purple-400 font-medium">
              {((stats.missionDay || 0) / 365).toFixed(1)} years
            </div>
          </div>
          
          <div className="flex items-end space-x-2">
            <AnimatedCounter value={stats.missionDay || 0} />
            <span className="text-sm text-gray-400 pb-1">days</span>
          </div>
          
          {/* Progress bar showing year progress */}
          <div className="mt-3">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((stats.missionDay || 0) % 365) / 365 * 100}%` 
                }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Year Start</span>
              <span>{Math.floor(((stats.missionDay || 0) % 365) / 365 * 100)}%</span>
              <span>Year End</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Status Footer */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-gray-400">
            <span>Last updated: Just now</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionStats; 