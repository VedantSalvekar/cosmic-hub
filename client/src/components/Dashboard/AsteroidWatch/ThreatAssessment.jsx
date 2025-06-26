import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Activity,
  Eye,
  Target,
  BarChart3,
  Zap,
  AlertCircle
} from 'lucide-react';
import RiskBadge from './components/RiskBadge';

const ThreatAssessment = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30'); // days

  // Generate mock threat data
  const generateThreatData = () => {
    const threatObjects = [
      { name: 'Apophis', diameter: 370, distance: 0.0997, probability: 0.00001, type: 'Aten' },
      { name: '2024 BX1', diameter: 280, distance: 0.0234, probability: 0.000003, type: 'Apollo' },
      { name: '2023 DW3', diameter: 450, distance: 0.0567, probability: 0.000015, type: 'Aten' },
      { name: '2024 EF4', diameter: 180, distance: 0.0134, probability: 0.000001, type: 'Apollo' },
      { name: 'Bennu', diameter: 492, distance: 0.1245, probability: 0.000037, type: 'Apollo' },
      { name: '2023 GH5', diameter: 320, distance: 0.0445, probability: 0.000008, type: 'Aten' },
      { name: '2024 IJ6', diameter: 150, distance: 0.0189, probability: 0.0000004, type: 'Apollo' },
      { name: '2023 KL7', diameter: 890, distance: 0.1567, probability: 0.000089, type: 'Apollo' }
    ];

    return threatObjects.map((obj, index) => ({
      id: `threat_${index}`,
      name: obj.name,
      diameter: obj.diameter,
      distance: {
        au: obj.distance.toFixed(4),
        ld: (obj.distance * 389.2).toFixed(1),
        km: (obj.distance * 149597870.7).toFixed(0)
      },
      impactProbability: obj.probability,
      kineticEnergy: Math.pow(obj.diameter / 100, 3) * 15, // Simplified calculation
      orbitType: obj.type,
      lastObserved: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      threatLevel: obj.diameter > 400 ? 'high' : obj.diameter > 200 ? 'medium' : 'low',
      isPotentiallyHazardous: true,
      observationConfidence: 90 + Math.random() * 10,
      approachDate: new Date(Date.now() + Math.random() * parseInt(selectedTimeframe) * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setThreats(generateThreatData());
      setLoading(false);
    }, 1000);
  }, [selectedTimeframe]);

  const getThreatStats = () => {
    const high = threats.filter(t => t.threatLevel === 'high').length;
    const medium = threats.filter(t => t.threatLevel === 'medium').length;
    const low = threats.filter(t => t.threatLevel === 'low').length;
    const totalProbability = threats.reduce((sum, t) => sum + t.impactProbability, 0);
    
    return { high, medium, low, totalProbability };
  };

  const stats = getThreatStats();

  const ThreatCard = ({ threat }) => {
    const getRiskColor = (level) => {
      switch (level) {
        case 'high': return 'from-red-900/30 to-red-800/30 border-red-500/30';
        case 'medium': return 'from-yellow-900/30 to-orange-800/30 border-yellow-500/30';
        case 'low': return 'from-green-900/30 to-green-800/30 border-green-500/30';
        default: return 'from-gray-900/30 to-gray-800/30 border-gray-500/30';
      }
    };

    return (
      <div className={`bg-gradient-to-br ${getRiskColor(threat.threatLevel)} backdrop-blur-lg rounded-xl p-6 border hover:scale-105 transition-all duration-300`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{threat.name}</h3>
            <p className="text-sm text-white/60">{threat.orbitType} Class • PHO</p>
          </div>
          <RiskBadge level={threat.threatLevel} isPHO={true} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-300">Size</span>
            </div>
            <div className="text-lg font-bold text-white">{threat.diameter}m</div>
            <div className="text-xs text-white/60">Diameter</div>
          </div>

          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-300">Distance</span>
            </div>
            <div className="text-lg font-bold text-white">{threat.distance.ld}</div>
            <div className="text-xs text-white/60">Lunar Distances</div>
          </div>

          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-300">Impact Probability</span>
            </div>
            <div className="text-lg font-bold text-white">
              {(threat.impactProbability * 100).toExponential(2)}%
            </div>
            <div className="text-xs text-white/60">Next 100 years</div>
          </div>

          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-300">Energy</span>
            </div>
            <div className="text-lg font-bold text-white">{threat.kineticEnergy.toFixed(1)}</div>
            <div className="text-xs text-white/60">Megatons TNT</div>
          </div>
        </div>

        {/* Risk Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Risk Assessment</span>
            <span>{threat.observationConfidence.toFixed(1)}% confidence</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                threat.threatLevel === 'high' ? 'bg-red-500' :
                threat.threatLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${threat.observationConfidence}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-white/60">
            Next approach: {new Date(threat.approachDate).toLocaleDateString()}
          </span>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white">
            View Details
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-white/70">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
          <span>Analyzing threat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Threat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-900/20 backdrop-blur-lg rounded-xl p-4 border border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-300">{stats.high}</div>
              <div className="text-sm text-red-200/70">High Risk Objects</div>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-yellow-900/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-300">{stats.medium}</div>
              <div className="text-sm text-yellow-200/70">Medium Risk Objects</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-green-900/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-300">{stats.low}</div>
              <div className="text-sm text-green-200/70">Low Risk Objects</div>
            </div>
            <Shield className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-purple-900/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-300">
                {(stats.totalProbability * 100).toExponential(1)}%
              </div>
              <div className="text-sm text-purple-200/70">Cumulative Risk</div>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Threat Assessment</h3>
            <span className="text-sm text-white/60">({threats.length} PHOs monitored)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/70">Timeframe:</span>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white"
            >
              <option value="7">Next 7 days</option>
              <option value="30">Next 30 days</option>
              <option value="90">Next 90 days</option>
              <option value="365">Next year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Risk Matrix */}
      <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Risk Distribution Matrix
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk by Size */}
          <div>
            <h4 className="text-sm font-medium text-white/80 mb-3">Objects by Size Category</h4>
            <div className="space-y-2">
              {[
                { label: 'Large (>1km)', count: threats.filter(t => t.diameter > 1000).length, color: 'bg-red-500' },
                { label: 'Medium (500m-1km)', count: threats.filter(t => t.diameter >= 500 && t.diameter <= 1000).length, color: 'bg-yellow-500' },
                { label: 'Small (100-500m)', count: threats.filter(t => t.diameter >= 100 && t.diameter < 500).length, color: 'bg-green-500' },
                { label: 'Very Small (<100m)', count: threats.filter(t => t.diameter < 100).length, color: 'bg-blue-500' }
              ].map((category, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-4 h-4 ${category.color} rounded`}></div>
                  <span className="text-sm text-white/70 flex-1">{category.label}</span>
                  <span className="text-sm font-medium text-white">{category.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk by Distance */}
          <div>
            <h4 className="text-sm font-medium text-white/80 mb-3">Objects by Distance</h4>
            <div className="space-y-2">
              {[
                { label: 'Very Close (<0.05 AU)', count: threats.filter(t => parseFloat(t.distance.au) < 0.05).length, color: 'bg-red-500' },
                { label: 'Close (0.05-0.1 AU)', count: threats.filter(t => parseFloat(t.distance.au) >= 0.05 && parseFloat(t.distance.au) < 0.1).length, color: 'bg-yellow-500' },
                { label: 'Moderate (0.1-0.2 AU)', count: threats.filter(t => parseFloat(t.distance.au) >= 0.1 && parseFloat(t.distance.au) < 0.2).length, color: 'bg-green-500' },
                { label: 'Distant (>0.2 AU)', count: threats.filter(t => parseFloat(t.distance.au) >= 0.2).length, color: 'bg-blue-500' }
              ].map((category, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-4 h-4 ${category.color} rounded`}></div>
                  <span className="text-sm text-white/70 flex-1">{category.label}</span>
                  <span className="text-sm font-medium text-white">{category.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Threat Objects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {threats.map(threat => (
          <ThreatCard key={threat.id} threat={threat} />
        ))}
      </div>

      {threats.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-300 mb-2">No High-Risk Objects Detected</h3>
          <p className="text-white/50">Current monitoring shows no immediate threats in the selected timeframe.</p>
        </div>
      )}
    </div>
  );
};

export default ThreatAssessment; 