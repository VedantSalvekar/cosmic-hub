import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Target } from 'lucide-react';

/**
 * Threat Radar Component
 * 
 * Displays approaching asteroids in a radar-style circular visualization
 * Features:
 * - Circular radar with distance rings
 * - Color-coded threat levels
 * - Animated threat dots
 * - Central Earth representation
 * - Real-time threat counter
 * 
 * Threat Levels:
 * - CRITICAL: Red (< 0.01 AU, large)
 * - HIGH: Orange (< 0.02 AU or hazardous)
 * - MODERATE: Yellow (< 0.05 AU)
 * - LOW: Green (> 0.05 AU)
 */
const ThreatRadar = ({ asteroids = [], alerts = [], isLoading }) => {
  /**
   * Convert threat level to color
   */
  const getThreatColor = (level) => {
    switch (level) {
      case 'CRITICAL': return '#ef4444'; // red-500
      case 'HIGH': return '#f97316'; // orange-500
      case 'MODERATE': return '#eab308'; // yellow-500
      case 'LOW': return '#22c55e'; // green-500
      default: return '#6b7280'; // gray-500
    }
  };

  /**
   * Position asteroid on radar based on distance
   * Maps real distance to radar position
   */
  const getRadarPosition = (asteroid) => {
    if (!asteroid.closest_approach?.distance_km) return { x: 50, y: 50 };
    
    // Convert distance to AU for positioning
    const distanceKm = parseFloat(asteroid.closest_approach.distance_km);
    const distanceAU = distanceKm / 149597870.7; // km to AU conversion
    
    // Map distance to radar rings (0.5 AU = outer ring)
    const normalizedDistance = Math.min(distanceAU / 0.5, 1);
    const radarRadius = (1 - normalizedDistance) * 35 + 10; // 10-45% from center
    
    // Random angle for positioning
    const angle = (asteroid.id % 360) * (Math.PI / 180);
    
    const x = 50 + Math.cos(angle) * radarRadius;
    const y = 50 + Math.sin(angle) * radarRadius;
    
    return { x: Math.max(15, Math.min(85, x)), y: Math.max(15, Math.min(85, y)) };
  };

  /**
   * Get asteroid size for radar dot
   */
  const getAsteroidSize = (asteroid) => {
    const diameter = asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
    if (diameter > 1) return 8; // Large
    if (diameter > 0.1) return 6; // Medium
    return 4; // Small
  };

  /**
   * Count threats by level
   */
  const threatCounts = asteroids.reduce((counts, asteroid) => {
    const level = asteroid.threat_level || 'LOW';
    counts[level] = (counts[level] || 0) + 1;
    return counts;
  }, {});

  if (isLoading) {
    return (
      <div className="cosmic-card h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <div className="text-gray-300">Scanning for threats...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cosmic-card h-96 relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Threat Radar</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-orange-400 font-bold text-xl">
              {alerts.length}
            </div>
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Radar Display */}
      <div className="relative p-6 h-80">
        <div className="relative w-full h-full">
          
          {/* Radar Rings */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Outer rings */}
            {[15, 25, 35, 45].map((radius, index) => (
              <circle
                key={radius}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="0.5"
                className="animate-pulse"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            ))}
            
            {/* Crosshairs */}
            <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5" />
            
            {/* Central Earth */}
            <circle
              cx="50"
              cy="50"
              r="3"
              fill="#22c55e"
              className="animate-pulse"
            />
            
            {/* Radar Sweep */}
            <motion.line
              x1="50"
              y1="50"
              x2="50"
              y2="5"
              stroke="rgba(34, 197, 94, 0.6)"
              strokeWidth="1"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "50% 50%" }}
            />
            
            {/* Asteroid Dots */}
            {asteroids.slice(0, 10).map((asteroid, index) => {
              const position = getRadarPosition(asteroid);
              const size = getAsteroidSize(asteroid);
              const color = getThreatColor(asteroid.threat_level);
              
              return (
                <motion.g key={asteroid.id}>
                  <motion.circle
                    cx={position.x}
                    cy={position.y}
                    r={size / 2}
                    fill={color}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="cursor-pointer"
                  />
                  
                  {/* Pulse effect for high threats */}
                  {(asteroid.threat_level === 'CRITICAL' || asteroid.threat_level === 'HIGH') && (
                    <motion.circle
                      cx={position.x}
                      cy={position.y}
                      r={size}
                      fill="none"
                      stroke={color}
                      strokeWidth="1"
                      initial={{ scale: 0.5, opacity: 0.8 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.g>
              );
            })}
          </svg>
          
          {/* Distance Labels */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-400">
            0.5 AU
          </div>
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs text-blue-400/60">
            0.3 AU
          </div>
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-xs text-blue-400/40">
            0.1 AU
          </div>
          
          {/* Earth Label */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-4 text-xs text-green-400">
            Earth
          </div>
        </div>
      </div>

      {/* Threat Summary */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm">
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="text-red-400 font-bold">
              {threatCounts.CRITICAL || 0}
            </div>
            <div className="text-gray-400">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-orange-400 font-bold">
              {threatCounts.HIGH || 0}
            </div>
            <div className="text-gray-400">High</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-bold">
              {threatCounts.MODERATE || 0}
            </div>
            <div className="text-gray-400">Moderate</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold">
              {threatCounts.LOW || 0}
            </div>
            <div className="text-gray-400">Low</div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        {alerts.length > 0 ? (
          <div className="flex items-center space-x-1 text-red-400">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-medium">ALERT</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-green-400">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium">SECURE</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatRadar; 