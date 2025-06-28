import React, { useState, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';

const FloatingAIButton = ({ onClick }) => {
  const [showDiscoveryTooltip, setShowDiscoveryTooltip] = useState(true);
  const [isJumping, setIsJumping] = useState(true);

  useEffect(() => {
    const tooltipTimer = setTimeout(() => {
      setShowDiscoveryTooltip(false);
    }, 4000);

    const jumpTimer = setTimeout(() => {
      setIsJumping(false);
    }, 10000);

    return () => {
      clearTimeout(tooltipTimer);
      clearTimeout(jumpTimer);
    };
  }, []);

  const handleClick = () => {
    setShowDiscoveryTooltip(false);
    setIsJumping(false);
    onClick();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`fixed bottom-6 left-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 z-[9999] group ${
          isJumping ? 'animate-bounce' : ''
        }`}
        style={{
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
        }}
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </div>
        
        {/* Regular hover tooltip */}
        <div className="absolute bottom-full left-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Ask Cosmic AI 
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
        </div>
      </button>

      {/* Discovery tooltip - shows for 4 seconds */}
      {showDiscoveryTooltip && (
        <div className="fixed bottom-24 left-6 z-[10000] animate-pulse">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-2xl shadow-2xl max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="font-semibold text-sm">New Feature!</span>
            </div>
            <p className="text-sm">
              Chat with our Cosmic AI Assistant! 🚀<br />
              Ask me anything about space & astronomy!
            </p>
            <div className="absolute top-full left-8 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-blue-500"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIButton;