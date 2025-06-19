import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, Loader } from 'lucide-react';

/**
 * Loading Screen Component
 * 
 * Displays while the dashboard is initializing
 * Features:
 * - Space-themed loading animation
 * - Rotating satellite icon
 * - Pulsing progress indicators
 * - Mission-style text
 * - Gradient background effects
 */
const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-cosmic-dark flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Background stars */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-blue-900/20"></div>
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center space-y-8">
        
        {/* Main Logo/Icon */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Orbiting rings */}
            <motion.div
              className="absolute inset-0 w-24 h-24 border-2 border-blue-500/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 w-20 h-20 border-2 border-purple-500/30 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Central satellite */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Satellite className="w-8 h-8 text-blue-400" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Mission Title */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-white tracking-wider">
            COSMIC AWARENESS HUB
          </h1>
          <p className="text-blue-300/80 text-lg">
            Initializing Mission Control Systems
          </p>
        </motion.div>

        {/* Loading Progress */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Loading Text */}
          <motion.div
            className="text-gray-300 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Connecting to NASA Deep Space Network...</span>
            </div>
          </motion.div>
        </motion.div>

        {/* System Status Indicators */}
        <motion.div
          className="grid grid-cols-3 gap-6 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { label: 'APOD Service', delay: 0.5 },
            { label: 'Asteroid Tracker', delay: 1.0 },
            { label: 'Fireball Monitor', delay: 1.5 }
          ].map((system, index) => (
            <div key={system.label} className="text-center">
              <motion.div
                className="w-3 h-3 rounded-full bg-gray-600 mx-auto mb-2"
                initial={{ backgroundColor: '#4b5563' }}
                animate={{ backgroundColor: '#22c55e' }}
                transition={{ delay: system.delay, duration: 0.5 }}
              />
              <div className="text-xs text-gray-400">
                {system.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Mission Stats */}
        <motion.div
          className="text-xs text-gray-500 space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div>Mission Control • Earth Sector</div>
          <div>Establishing secure connection...</div>
          <div className="font-mono">CONNECT://NASA-JPL-DSN</div>
        </motion.div>
      </div>

      {/* Bottom Mission Badge */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Deep Space Monitoring Active</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen; 