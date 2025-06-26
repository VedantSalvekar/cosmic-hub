import React from 'react';
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react';

const RiskBadge = ({ level, isPHO }) => {
  const getBadgeConfig = (threatLevel) => {
    switch (threatLevel) {
      case 'high':
        return {
          bg: 'bg-red-900/30 border-red-500/50',
          text: 'text-red-300',
          icon: AlertCircle,
          label: 'HIGH RISK',
          animation: 'animate-pulse'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-900/30 border-yellow-500/50',
          text: 'text-yellow-300',
          icon: AlertTriangle,
          label: 'MEDIUM RISK',
          animation: ''
        };
      case 'low':
        return {
          bg: 'bg-green-900/30 border-green-500/50',
          text: 'text-green-300',
          icon: Shield,
          label: 'LOW RISK',
          animation: ''
        };
      default:
        return {
          bg: 'bg-blue-900/30 border-blue-500/50',
          text: 'text-blue-300',
          icon: Shield,
          label: 'MONITORED',
          animation: ''
        };
    }
  };

  const config = getBadgeConfig(level);
  const IconComponent = config.icon;

  return (
    <div className="flex flex-col gap-1">
      <div className={`
        flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium
        ${config.bg} ${config.text} ${config.animation}
      `}>
        <IconComponent className="w-3 h-3" />
        <span>{config.label}</span>
      </div>
      
      {isPHO && (
        <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-900/30 border border-orange-500/50 rounded-md text-xs font-medium text-orange-300">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>PHO</span>
        </div>
      )}
    </div>
  );
};

export default RiskBadge; 