import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Satellite, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

/**
 * Glass Header Component
 * 
 * NASA Mission Control inspired header with:
 * - System status indicators
 * - Live mission metrics
 * - Glass morphism design
 * - Real-time updates
 * 
 * Features:
 * - Connection status indicator
 * - Active alerts counter
 * - Mission day tracker
 * - Manual refresh button
 * - Last updated timestamp
 */
const GlassHeader = ({ systemStatus, lastUpdated, onRefresh }) => {
  /**
   * Format the last updated time for display
   * Shows relative time (e.g., "2 minutes ago")
   */
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const updated = new Date(timestamp);
    const diffInMinutes = Math.floor((now - updated) / (1000 * 60));
    
    if (diffInMinutes === 0) return 'Just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  };

  /**
   * Get current mission time
   * Shows current UTC time for space operations
   */
  const getCurrentTime = () => {
    return new Date().toUTCString().slice(17, 25); // HH:MM:SS format
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left Section - Mission Branding */}
          <div className="flex items-center space-x-4">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wider">
                  COSMIC AWARENESS HUB
                </h1>
                <p className="text-sm text-blue-300/80">
                  Mission Control • Earth Sector
                </p>
              </div>
            </motion.div>
          </div>

          {/* Center Section - Mission Stats */}
          <div className="hidden md:flex items-center space-x-8">
            
            {/* Mission Day Counter */}
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {systemStatus.missionDay.toLocaleString()}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">
                Mission Day
              </div>
            </div>

            {/* Current Time */}
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 font-mono">
                {getCurrentTime()}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">
                UTC Time
              </div>
            </div>

            {/* Active Alerts */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="text-2xl font-bold text-orange-400">
                  {systemStatus.activeAlerts}
                </div>
                {systemStatus.activeAlerts > 0 && (
                  <AlertTriangle className="w-5 h-5 text-orange-400 animate-pulse" />
                )}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">
                Active Alerts
              </div>
            </div>
          </div>

          {/* Right Section - System Status */}
          <div className="flex items-center space-x-4">
            
            {/* Connection Status */}
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              {systemStatus.isOnline ? (
                <div className="flex items-center space-x-2 text-green-400">
                  <Wifi className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">ONLINE</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-400">
                  <WifiOff className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">OFFLINE</span>
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                </div>
              )}
            </motion.div>

            {/* Last Updated */}
            <div className="hidden lg:block text-right">
              <div className="text-xs text-gray-400">
                Last Update
              </div>
              <div className="text-sm text-white">
                {formatLastUpdated(lastUpdated)}
              </div>
            </div>

            {/* Refresh Button */}
            <motion.button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Stats Row */}
        <div className="md:hidden mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {systemStatus.missionDay.toLocaleString()}
            </div>
            <div className="text-xs text-gray-300">Mission Day</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-green-400 font-mono">
              {getCurrentTime()}
            </div>
            <div className="text-xs text-gray-300">UTC Time</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="text-lg font-bold text-orange-400">
                {systemStatus.activeAlerts}
              </div>
              {systemStatus.activeAlerts > 0 && (
                <AlertTriangle className="w-4 h-4 text-orange-400 animate-pulse" />
              )}
            </div>
            <div className="text-xs text-gray-300">Alerts</div>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
    </motion.header>
  );
};

export default GlassHeader; 