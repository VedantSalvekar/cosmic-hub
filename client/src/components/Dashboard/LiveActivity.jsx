import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Telescope, Satellite, Zap, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Live Activity Component
 * 
 * Shows a real-time feed of system activities:
 * - New asteroid discoveries
 * - APOD updates
 * - System status changes
 * - Threat level changes
 * - Data refresh events
 * 
 * Features:
 * - Auto-scrolling activity feed
 * - Color-coded activity types
 * - Timestamps for each activity
 * - Fade-in animations for new items
 */
const LiveActivity = ({ asteroids = [], apod, systemStatus, isLoading }) => {
  const [activities, setActivities] = useState([]);
  const [activityCounter, setActivityCounter] = useState(0);

  /**
   * Generate activity items based on data changes
   * Creates realistic activity log entries
   */
  useEffect(() => {
    const newActivities = [];
    
    // APOD activity
    if (apod && !isLoading) {
      newActivities.push({
        id: `apod-${Date.now()}`,
        type: 'discovery',
        icon: Telescope,
        title: 'New APOD Available',
        description: `Today's feature: ${apod.title}`,
        timestamp: new Date(),
        color: 'blue'
      });
    }

    // Asteroid activities
    const highThreatAsteroids = asteroids.filter(a => 
      a.threat_level === 'HIGH' || a.threat_level === 'CRITICAL'
    );
    
    if (highThreatAsteroids.length > 0) {
      newActivities.push({
        id: `threat-${Date.now()}`,
        type: 'alert',
        icon: AlertCircle,
        title: `${highThreatAsteroids.length} High-Priority Threats Detected`,
        description: 'Asteroid tracking system active',
        timestamp: new Date(),
        color: 'red'
      });
    }

    // System status activities
    if (systemStatus.isOnline) {
      newActivities.push({
        id: `system-${Date.now()}`,
        type: 'system',
        icon: CheckCircle,
        title: 'All Systems Operational',
        description: `${asteroids.length} objects tracked successfully`,
        timestamp: new Date(),
        color: 'green'
      });
    }

    // Add new activities if there are any
    if (newActivities.length > 0 && activities.length === 0) {
      setActivities(newActivities.slice(0, 8)); // Keep only recent 8 activities
    }
  }, [asteroids, apod, systemStatus, isLoading, activities.length]);

  /**
   * Simulate periodic activity updates
   * Adds realistic periodic activities
   */
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      const simulatedActivities = [
        {
          type: 'scan',
          icon: Satellite,
          title: 'Deep Space Scan Complete',
          description: 'Sector 7-Alpha surveyed',
          color: 'purple'
        },
        {
          type: 'data',
          icon: Activity,
          title: 'Data Synchronization',
          description: 'NASA database updated',
          color: 'blue'
        },
        {
          type: 'discovery',
          icon: Telescope,
          title: 'Minor Object Detected',
          description: 'Classification in progress',
          color: 'yellow'
        },
        {
          type: 'energy',
          icon: Zap,
          title: 'Solar Activity Monitor',
          description: 'Nominal solar wind conditions',
          color: 'orange'
        }
      ];

      const randomActivity = simulatedActivities[Math.floor(Math.random() * simulatedActivities.length)];
      const newActivity = {
        ...randomActivity,
        id: `activity-${activityCounter}`,
        timestamp: new Date()
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 8));
      setActivityCounter(prev => prev + 1);
    }, 15000); // Add new activity every 15 seconds

    return () => clearInterval(interval);
  }, [isLoading, activityCounter]);

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return timestamp.toLocaleTimeString();
  };

  /**
   * Get color classes for activity type
   */
  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
      green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
      red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
      orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
      yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' }
    };
    return colors[color] || colors.blue;
  };

  /**
   * Individual activity item component
   */
  const ActivityItem = ({ activity, index }) => {
    const colors = getColorClasses(activity.color);
    const Icon = activity.icon;

    return (
      <motion.div
        className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
        initial={{ opacity: 0, x: -20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.95 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        layout
      >
        <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border} flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${colors.text}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium text-white truncate">
                {activity.title}
              </h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {activity.description}
              </p>
            </div>
            <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
              {formatTimestamp(activity.timestamp)}
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
          <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
          <div className="text-gray-300 text-sm">Initializing activity feed...</div>
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
            <Activity className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Live Activity</h3>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-hidden">
        {activities.length > 0 ? (
          <div className="h-full overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {activities.map((activity, index) => (
                <ActivityItem 
                  key={activity.id} 
                  activity={activity} 
                  index={index} 
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Activity className="w-12 h-12 text-gray-500 mx-auto" />
              <div className="text-gray-400">
                <div className="font-medium">Monitoring Space</div>
                <div className="text-sm">Activity feed will appear here</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="text-gray-400">
            Mission Control Activity Log
          </div>
          <div className="flex items-center space-x-1 text-green-400">
            <span>Auto-refresh</span>
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveActivity; 