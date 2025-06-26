import React from 'react';
import { RiMenu3Line, RiSpaceShipLine } from 'react-icons/ri';
import { HiOutlineSparkles } from 'react-icons/hi2';

const FloatingMenuButton = ({ onClick, isOpen }) => {
  return (
    <motion.div
      className="fixed z-[100]"
      style={{ 
        top: '24px', 
        left: isOpen ? '300px' : '24px',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        duration: 0.6, 
        bounce: 0.3 
      }}
    >
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-500/30 blur-lg"
        style={{ width: '64px', height: '64px' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Main Button */}
      <motion.button
        onClick={onClick}
        className="relative rounded-full bg-gradient-to-br from-slate-800/95 to-slate-900/95 
                   backdrop-blur-lg border-2 border-white/30 shadow-2xl
                   flex items-center justify-center"
        style={{ width: '64px', height: '64px' }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 0 40px rgba(6, 182, 212, 0.5)",
          borderColor: "rgba(6, 182, 212, 0.6)"
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Inner Background Gradient */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-600/15" />
        
        {/* Main Icon */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          animate={{ 
            rotate: isOpen ? 180 : 0 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 150, 
            damping: 12 
          }}
        >
          {isOpen ? (
            <motion.div
              key="spaceship"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <RiSpaceShipLine 
                className="text-white drop-shadow-lg" 
                style={{ width: '28px', height: '28px' }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <RiMenu3Line 
                className="text-white drop-shadow-lg" 
                style={{ width: '28px', height: '28px' }}
              />
            </motion.div>
          )}
        </motion.div>
        
        {/* Corner Sparkle */}
        <motion.div
          className="absolute"
          style={{ top: '6px', right: '6px' }}
          animate={{ 
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <HiOutlineSparkles 
            className="text-cyan-400/80" 
            style={{ width: '14px', height: '14px' }}
          />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default FloatingMenuButton; 