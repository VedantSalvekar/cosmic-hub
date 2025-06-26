import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate);
      const now = new Date();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, isPast: false };
      } else {
        return { isPast: true };
      }
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 text-white/60">
        <Clock className="w-4 h-4 animate-spin" />
        <span className="text-sm">Calculating...</span>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-600/30">
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Approach Completed</span>
        </div>
      </div>
    );
  }

  const getUrgencyColor = () => {
    if (timeLeft.days < 1) return 'text-red-300 bg-red-900/30 border-red-500/30';
    if (timeLeft.days < 7) return 'text-yellow-300 bg-yellow-900/30 border-yellow-500/30';
    return 'text-blue-300 bg-blue-900/30 border-blue-500/30';
  };

  const formatTimeUnit = (value, unit) => (
    <div className="flex flex-col items-center">
      <div className="text-lg font-bold text-white">{value.toString().padStart(2, '0')}</div>
      <div className="text-xs text-white/60">{unit}</div>
    </div>
  );

  return (
    <div className={`rounded-lg p-3 border ${getUrgencyColor()}`}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className={`w-4 h-4 ${timeLeft.days < 1 ? 'animate-pulse' : ''}`} />
        <span className="text-sm font-medium">Time Until Close Approach</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {formatTimeUnit(timeLeft.days, 'DAYS')}
        {formatTimeUnit(timeLeft.hours, 'HRS')}
        {formatTimeUnit(timeLeft.minutes, 'MIN')}
        {formatTimeUnit(timeLeft.seconds, 'SEC')}
      </div>

      {timeLeft.days < 1 && (
        <div className="mt-2 text-center">
          <span className="text-xs font-medium text-red-300 animate-pulse">
            ⚠️ IMMINENT APPROACH
          </span>
        </div>
      )}
    </div>
  );
};

export default Countdown; 